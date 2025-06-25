import { toast } from 'react-toastify';

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
    if (!audioUrl) return null;

    try {
      await this.initialize();

      // Check if already loaded
      if (this.audioBuffers.has(audioUrl) || this.audioElements.has(audioUrl)) {
        return true;
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
        // Use HTML5 Audio as fallback
        const audio = new Audio(audioUrl);
        audio.preload = 'auto';
        audio.volume = this.isMuted ? 0 : this.volume;
        
        // Wait for audio to be ready
        await new Promise((resolve, reject) => {
          audio.addEventListener('canplaythrough', resolve, { once: true });
          audio.addEventListener('error', reject, { once: true });
          audio.load();
        });
        
        this.audioElements.set(audioUrl, audio);
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
        const gainNode = this.audioContext.createGain();
        
        source.buffer = audioBuffer;
        gainNode.gain.value = this.volume;
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        source.start(0);
      } else if (this.audioElements.has(audioUrl)) {
        // Use HTML5 Audio
        const audio = this.audioElements.get(audioUrl);
        audio.currentTime = 0;
        audio.volume = this.volume;
        await audio.play();
      } else {
        // Last resort - create new audio element
        const audio = new Audio(audioUrl);
        audio.volume = this.volume;
        await audio.play();
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

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    // Update existing HTML5 audio elements
    this.audioElements.forEach(audio => {
      audio.volume = this.isMuted ? 0 : this.volume;
    });
  }

  getVolume() {
    return this.volume;
  }

  mute() {
    this.isMuted = true;
    this.audioElements.forEach(audio => {
      audio.volume = 0;
    });
  }

  unmute() {
    this.isMuted = false;
    this.audioElements.forEach(audio => {
      audio.volume = this.volume;
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
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
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