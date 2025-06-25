import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-primary text-white px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between max-w-full">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <ApperIcon name="BookOpen" size={32} className="text-accent" />
            </motion.div>
            <h1 className="text-xl md:text-2xl font-display font-bold">
              Phonics Playground
            </h1>
          </div>
          
          {/* Volume Control */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <ApperIcon name="Volume2" size={24} />
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation */}
      <nav className="flex-shrink-0 bg-white border-t-4 border-primary/20 px-2 py-3 shadow-2xl">
        <div className="flex justify-around items-center max-w-full">
          {routeArray.map((route) => {
            const isActive = location.pathname === route.path;
            
            return (
              <NavLink
                key={route.id}
                to={route.path}
                className="flex-1 max-w-[120px]"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-primary/10'
                  }`}
                >
                  <motion.div
                    animate={isActive ? { y: [0, -2, 0] } : {}}
                    transition={{ duration: 0.6, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
                  >
                    <ApperIcon 
                      name={route.icon} 
                      size={24} 
                      className={isActive ? 'text-accent' : 'text-current'}
                    />
                  </motion.div>
                  <span className="text-xs font-medium leading-tight text-center">
                    {route.label}
                  </span>
                </motion.div>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;