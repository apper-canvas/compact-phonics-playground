import progressData from '../mockData/progress.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let progress = [...progressData];

export const progressService = {
  async getProgress() {
    await delay(200);
    return progress.length > 0 ? { ...progress[0] } : null;
  },

  async updateProgress(data) {
    await delay(300);
    if (progress.length === 0) {
      const newProgress = {
        Id: 1,
        completedLetters: [],
        completedWords: [],
        totalStars: 0,
        currentLevel: 1,
        streakDays: 0,
        ...data
      };
      progress.push(newProgress);
      return { ...newProgress };
    }
    
    progress[0] = { ...progress[0], ...data };
    return { ...progress[0] };
  },

  async addCompletedLetter(letterId) {
    await delay(200);
    const currentProgress = progress[0] || {
      Id: 1,
      completedLetters: [],
      completedWords: [],
      totalStars: 0,
      currentLevel: 1,
      streakDays: 0
    };

    if (!currentProgress.completedLetters.includes(letterId)) {
      currentProgress.completedLetters.push(letterId);
      currentProgress.totalStars += 1;
    }

    if (progress.length === 0) {
      progress.push(currentProgress);
    } else {
      progress[0] = currentProgress;
    }

    return { ...currentProgress };
  },

  async addCompletedWord(wordId) {
    await delay(200);
    const currentProgress = progress[0] || {
      Id: 1,
      completedLetters: [],
      completedWords: [],
      totalStars: 0,
      currentLevel: 1,
      streakDays: 0
    };

    if (!currentProgress.completedWords.includes(wordId)) {
      currentProgress.completedWords.push(wordId);
      currentProgress.totalStars += 3;
    }

    if (progress.length === 0) {
      progress.push(currentProgress);
    } else {
      progress[0] = currentProgress;
    }

    return { ...currentProgress };
  },

  async awardStars(count) {
    await delay(200);
    const currentProgress = progress[0] || {
      Id: 1,
      completedLetters: [],
      completedWords: [],
      totalStars: 0,
      currentLevel: 1,
      streakDays: 0
    };

    currentProgress.totalStars += count;

    if (progress.length === 0) {
      progress.push(currentProgress);
    } else {
      progress[0] = currentProgress;
    }

    return { ...currentProgress };
  }
};

export default progressService;