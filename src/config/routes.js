import Alphabet from '@/components/pages/Alphabet';
import Games from '@/components/pages/Games';
import WordBuilder from '@/components/pages/WordBuilder';
import Progress from '@/components/pages/Progress';

export const routes = {
  alphabet: {
    id: 'alphabet',
    label: 'Alphabet',
    path: '/',
    icon: 'BookOpen',
    component: Alphabet
  },
  games: {
    id: 'games',
    label: 'Games',
    path: '/games',
    icon: 'Gamepad2',
    component: Games
  },
  wordBuilder: {
    id: 'wordBuilder',
    label: 'Word Builder',
    path: '/word-builder',
    icon: 'Blocks',
    component: WordBuilder
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: 'Trophy',
    component: Progress
  }
};

export const routeArray = Object.values(routes);
export default routes;