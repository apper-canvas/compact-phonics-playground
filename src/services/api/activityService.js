import activitiesData from '../mockData/activities.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let activities = [...activitiesData];

export const activityService = {
  async getAll() {
    await delay(300);
    return [...activities];
  },

  async getById(id) {
    await delay(200);
    const activity = activities.find(a => a.Id === parseInt(id, 10));
    return activity ? { ...activity } : null;
  },

  async getByType(type) {
    await delay(300);
    return activities.filter(a => a.type === type).map(a => ({ ...a }));
  },

  async create(activityData) {
    await delay(300);
    const maxId = Math.max(...activities.map(a => a.Id), 0);
    const newActivity = {
      Id: maxId + 1,
      completedAt: Date.now(),
      ...activityData
    };
    activities.push(newActivity);
    return { ...newActivity };
  },

  async getRecentActivities(limit = 5) {
    await delay(200);
    return activities
      .sort((a, b) => b.completedAt - a.completedAt)
      .slice(0, limit)
      .map(a => ({ ...a }));
  }
};

export default activityService;