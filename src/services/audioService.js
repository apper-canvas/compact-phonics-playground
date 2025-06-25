import { toast } from "react-toastify";
import React from "react";
import activitiesData from "@/services/mockData/activities.json";
import progressData from "@/services/mockData/progress.json";
import lettersData from "@/services/mockData/letters.json";
import wordsData from "@/services/mockData/words.json";

class AudioService {
  constructor() {
    this.audioContext = null;
    this.audioBuffers = new Map();
    this.audioElements = new Map();
    this.volume = 1.0;
    this.isMuted = false;
    this.isInitialized = false;
    
    // Initialize on first user interaction
    this.initPromise = null;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    if (!this.initPromise) {
      this.initPromise = this._doInitialize();
    }
    
    return this.initPromise;
  }

  async _doInitialize() {
    try {
      // Try to use Web Audio API for better performance
      if (window.AudioContext || window.webkitAudioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Resume context if it's suspended (autoplay policy)
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.warn('Web Audio API not available, falling back to HTML5 Audio:', error);
      this.isInitialized = true;
    }
  }

  async preloadAudio(audioUrl) {
try {
      if (this.audioBuffers.has(audioUrl) || this.audioElements.has(audioUrl)) {
        return true; // Already preloaded
      }

      if (this.audioContext) {
        // Use Web Audio API
        const response = await fetch(audioUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch audio: ${response.status}`);
        }
        
        const audioData = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(audioData);
        this.audioBuffers.set(audioUrl, audioBuffer);
      } else {
        // Use HTML5 Audio as fallback with retry mechanism
        let lastError = null;
        const maxRetries = 3;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            const audio = new Audio(audioUrl);
            audio.preload = 'auto';
            audio.volume = this.isMuted ? 0 : this.volume;
            
            // Wait for audio to be ready with timeout
            await new Promise((resolve, reject) => {
              const timeout = setTimeout(() => {
                reject(new Error(`Audio preload timeout after 10 seconds (attempt ${attempt}/${maxRetries})`));
              }, 10000);
              
              const cleanup = () => {
                clearTimeout(timeout);
                audio.removeEventListener('canplaythrough', onSuccess);
                audio.removeEventListener('error', onError);
              };
              
              const onSuccess = () => {
                cleanup();
                resolve();
              };
              
              const onError = (event) => {
                cleanup();
                const errorMessage = audio.error 
                  ? `Audio error (code: ${audio.error.code}): ${this._getAudioErrorMessage(audio.error.code)}`
                  : 'Unknown audio loading error';
                reject(new Error(`${errorMessage} (attempt ${attempt}/${maxRetries})`));
              };
              
              audio.addEventListener('canplaythrough', onSuccess, { once: true });
              audio.addEventListener('error', onError, { once: true });
              
              // Check network connectivity
              if (!navigator.onLine) {
                reject(new Error('No network connection available for audio loading'));
                return;
              }
              
              audio.load();
            });
            
            // Success - store and exit retry loop
            this.audioElements.set(audioUrl, audio);
            if (attempt > 1) {
              console.log(`Audio preload succeeded on attempt ${attempt}:`, audioUrl);
            }
            return true;
            
          } catch (error) {
            lastError = error;
            console.warn(`Audio preload attempt ${attempt}/${maxRetries} failed:`, error.message);
            
            // Wait before retry (exponential backoff)
            if (attempt < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
            }
          }
        }
        
        // All retries failed - log error but don't throw to allow graceful degradation
        console.error(`Failed to preload audio after ${maxRetries} attempts:`, audioUrl, lastError?.message);
        toast.warn('Audio may not be available for some sounds', { 
          position: 'bottom-right',
          autoClose: 3000 
        });
        
        // Store null to indicate failed preload but prevent repeated attempts
        this.audioElements.set(audioUrl, null);
      }

      return true;
    } catch (error) {
      console.error('Failed to preload audio:', audioUrl, error);
      return false;
    }
  }
async playSound(audioUrl) {
    if (!audioUrl || this.isMuted) return false;

    try {
      await this.initialize();

      // Try to preload if not already loaded
      if (!this.audioBuffers.has(audioUrl) && !this.audioElements.has(audioUrl)) {
        const preloaded = await this.preloadAudio(audioUrl);
        if (!preloaded) {
          throw new Error('Failed to preload audio');
        }
      }

      if (this.audioContext && this.audioBuffers.has(audioUrl)) {
        // Use Web Audio API
        const audioBuffer = this.audioBuffers.get(audioUrl);
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext.destination);
        source.start(0);
      } else {
        // Use HTML5 Audio
        const audio = this.audioElements.get(audioUrl);
        if (audio === null) {
          // Audio failed to preload - provide user feedback
          console.warn('Audio not available:', audioUrl);
          toast.info('Audio not available for this sound', { 
            position: 'bottom-right',
            autoClose: 2000 
          });
          return false;
        }
        
        if (audio) {
          audio.currentTime = 0; // Reset to beginning
          await audio.play();
        }
      }

      return true;
    } catch (error) {
      console.error('Failed to play sound:', audioUrl, error);
      
      // Show user-friendly error message
      toast.error('Audio not available for this letter', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      
      return false;
    }
  }

  _getAudioErrorMessage(errorCode) {
    const errorMessages = {
      1: 'MEDIA_ERR_ABORTED - Audio loading was aborted',
      2: 'MEDIA_ERR_NETWORK - Network error occurred while loading audio',
      3: 'MEDIA_ERR_DECODE - Audio decoding error',
      4: 'MEDIA_ERR_SRC_NOT_SUPPORTED - Audio format not supported'
    };
    return errorMessages[errorCode] || `Unknown error code: ${errorCode}`;
  }
setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    // Update existing HTML5 audio elements
    this.audioElements.forEach(audio => {
      if (audio && typeof audio.volume !== 'undefined') {
        audio.volume = this.isMuted ? 0 : this.volume;
      }
    });
  }

  getVolume() {
    return this.volume;
  }

  mute() {
    this.isMuted = true;
    this.audioElements.forEach(audio => {
      if (audio && typeof audio.volume !== 'undefined') {
        audio.volume = 0;
      }
    });
  }

  unmute() {
    this.isMuted = false;
    this.audioElements.forEach(audio => {
      if (audio && typeof audio.volume !== 'undefined') {
        audio.volume = this.volume;
      }
    });
  }

  isMutedState() {
    return this.isMuted;
  }

  // Preload multiple audio files
  async preloadLetterSounds(letters) {
    const preloadPromises = letters
      .filter(letter => letter.audioUrl)
      .map(letter => this.preloadAudio(letter.audioUrl));
    
    const results = await Promise.allSettled(preloadPromises);
    const successful = results.filter(result => result.status === 'fulfilled' && result.value === true).length;
    
    console.log(`Preloaded ${successful}/${preloadPromises.length} letter sounds`);
    return successful;
  }

  // Clean up resources
cleanup() {
    this.audioBuffers.clear();
    this.audioElements.forEach(audio => {
      if (audio && typeof audio.pause === 'function') {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      }
    });
    this.audioElements.clear();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.isInitialized = false;
    this.initPromise = null;
  }
}

// Create singleton instance
const audioService = new AudioService();

export default audioService;