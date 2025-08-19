
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  Fingerprint,
  Calendar,
  CalendarOff,
  Users,
  Building,
  Puzzle,
  FileText,
  Bell,
  Settings,
  LogOut,
  Briefcase,
  Sun,
  Moon,
  UserCheck,
  DollarSign,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';

const navItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Tableau de bord', 
    path: '/', 
    roles: ['SuperAdmin', 'Admin', 'Manager', 'Employé'] 
  },
  { 
    icon: Clock, 
    label: 'Mes horaires', 
    path: '/my-hours', 
    roles: ['Employé'] 
  },
  { 
    icon: Fingerprint, 
    label: 'Pointage', 
    path: '/clocking', 
    roles: ['Employé'] 
  },
  { 
    icon: Calendar, 
    label: 'Agenda', 
    path: '/agenda', 
    roles: ['SuperAdmin', 'Admin', 'Manager', 'Employé'] 
  },
  { 
    icon: CalendarOff, 
    label: 'Demandes d\'absence', 
    path: '/absence-requests', 
    roles: ['Employé', 'Manager'] 
  },
  { 
    icon: Users, 
    label: 'Gestion des employés', 
    path: '/employee-management', 
    roles: ['SuperAdmin', 'Admin'] 
  },
  { 
    icon: Building, 
    label: 'Gestion des secteurs', 
    path: '/department-management', 
    roles: ['SuperAdmin', 'Admin'] 
  },
  { 
    icon: UserCheck, 
    label: 'Gestion d\'équipe', 
    path: '/team-management', 
    roles: ['SuperAdmin', 'Admin'] 
  },
  { 
    icon: DollarSign, 
    label: 'Gestion des salaires', 
    path: '/salary-management', 
    roles: ['SuperAdmin', 'Admin'] 
  },
  { 
    icon: Puzzle, 
    label: 'Extension navigateur', 
    path: '/browser-extension', 
    roles: ['SuperAdmin', 'Admin', 'Manager', 'Employé'] 
  },
  { 
    icon: FileText, 
    label: 'Export / Rapports', 
    path: '/reports', 
    roles: ['SuperAdmin', 'Admin', 'Manager'] 
  },
  { 
    icon: Bell, 
    label: 'Notifications', 
    path: '/notifications', 
    roles: ['SuperAdmin', 'Admin', 'Manager', 'Employé'] 
  },
  { 
    icon: Settings, 
    label: 'Paramètres / Profil', 
    path: '/settings', 
    roles: ['SuperAdmin', 'Admin', 'Manager', 'Employé'] 
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
  };

  if (!user) return null;

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <motion.aside 
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className={`${
        isDarkMode 
          ? 'bg-gray-900/90 backdrop-blur-xl border-gray-700/50' 
          : 'bg-white/90 backdrop-blur-xl border-gray-200/50'
      } border-r flex flex-col p-4 transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 p-2">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Briefcase className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'} h-8 w-8`} />
        </motion.div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              TimeTrackPro
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      {/* User Info */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 p-3 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-800/50 border border-gray-700/50' 
                : 'bg-gray-100/50 border border-gray-200/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                  {user.name}
                  {user.role === 'Manager' && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${isDarkMode ? 'bg-blue-500/10 text-blue-300 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                      Manager
                    </span>
                  )}
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user.role}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                isActive 
                  ? `${isDarkMode ? 'bg-purple-600/30 text-white' : 'bg-purple-100 text-purple-700'} font-semibold` 
                  : `${isDarkMode ? 'text-gray-300 hover:bg-purple-500/20 hover:text-white' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'}`
              }`
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            <motion.div
              className={`absolute inset-0 ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-500/5'}`}
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          </NavLink>
        ))}
      </nav>

      {/* Theme Toggle */}
      <div className="mb-4">
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
            isDarkMode 
              ? 'text-yellow-400 hover:bg-yellow-500/20' 
              : 'text-blue-600 hover:bg-blue-500/20'
          }`}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                {isDarkMode ? 'Mode jour' : 'Mode nuit'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Collapse Toggle */}
      <div className="mb-4">
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
            isDarkMode 
              ? 'text-gray-400 hover:bg-gray-700/50' 
              : 'text-gray-600 hover:bg-gray-200/50'
          }`}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                Réduire
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Logout */}
      <motion.button
        onClick={handleLogout}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
          isDarkMode 
            ? 'text-red-400 hover:bg-red-500/20 hover:text-red-300' 
            : 'text-red-600 hover:bg-red-50 hover:text-red-700'
        }`}
      >
        <LogOut className="h-5 w-5" />
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              Déconnexion
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.aside>
  );
};

export default Sidebar;
