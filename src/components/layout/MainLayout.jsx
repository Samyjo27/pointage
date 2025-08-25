
import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import { useTheme } from '@/contexts/ThemeContext';

const MainLayout = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' 
        : 'bg-white text-gray-900'
    }`}>
      <div className="flex h-screen">
        <Sidebar />
        <motion.main 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto ${
            isDarkMode 
              ? 'bg-gray-900/50 backdrop-blur-sm' 
              : 'bg-white'
          }`}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default MainLayout;
