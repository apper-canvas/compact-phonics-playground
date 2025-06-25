import wordsData from '../mockData/words.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let words = [...wordsData];

export const wordService = {
  async getAll() {
    await delay(300);
    return [...words];
  },

  async getById(id) {
    await delay(200);
    const word = words.find(w => w.Id === parseInt(id, 10));
    return word ? { ...word } : null;
  },

  async getByDifficulty(difficulty) {
    await delay(300);
    return words.filter(w => w.difficulty === difficulty).map(w => ({ ...w }));
  },

  async validateWord(letters) {
    await delay(200);
    const wordText = letters.join('');
    const foundWord = words.find(w => w.text === wordText.toUpperCase());
    return foundWord ? { ...foundWord } : null;
  },

  async create(wordData) {
    await delay(300);
    const maxId = Math.max(...words.map(w => w.Id), 0);
    const newWord = {
      Id: maxId + 1,
      ...wordData
    };
    words.push(newWord);
    return { ...newWord };
  },

  async playSound(wordId) {
    await delay(100);
    console.log(`Playing sound for word ID: ${wordId}`);
    return true;
  }
};

export default wordService;