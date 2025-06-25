import lettersData from '../mockData/letters.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let letters = [...lettersData];

export const letterService = {
  async getAll() {
    await delay(300);
    return [...letters];
  },

  async getById(id) {
    await delay(200);
    const letter = letters.find(l => l.Id === parseInt(id, 10));
    return letter ? { ...letter } : null;
  },

  async update(id, data) {
    await delay(300);
    const index = letters.findIndex(l => l.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Letter not found');
    
    letters[index] = { ...letters[index], ...data };
    return { ...letters[index] };
  },

  async markCompleted(id) {
    await delay(300);
    const index = letters.findIndex(l => l.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Letter not found');
    
    letters[index].completed = true;
    return { ...letters[index] };
  },

  async getCompleted() {
    await delay(200);
    return letters.filter(l => l.completed).map(l => ({ ...l }));
  },

  async playSound(letterId) {
    await delay(100);
    // Simulate audio playback
    console.log(`Playing sound for letter ID: ${letterId}`);
    return true;
  }
};

export default letterService;