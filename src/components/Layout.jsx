
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNetwork } from '@/contexts/NetworkContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Clock,
  Timer,
  Calendar,
  Users,
  Building2,
  Puzzle,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Wifi,
  WifiOff,
  Shield
} from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { networkStatus } = useNetwork();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord', roles: ['admin', 'hr', 'employee'] },
    { path: '/time-tracking', icon: Clock, label: 'Mes horaires', roles: ['admin', 'hr', 'employee'] },
    { path: '/clock-in', icon: Timer, label: 'Pointage', roles: ['admin', 'hr', 'employee'] },
    { path: '/absence-requests', icon: Calendar, label: 'Demandes d\'absence', roles: ['admin', 'hr', 'employee'] },
    { path: '/employees', icon: Users, label: 'Gestion des employés', roles: ['admin', 'hr'] },
    { path: '/departments', icon: Building2, label: 'Gestion des secteurs', roles: ['admin', 'hr'] },
    { path: '/extension', icon: Puzzle, label: 'Extension navigateur', roles: ['admin', 'hr', 'employee'] },
    { path: '/reports', icon: FileText, label: 'Export / Rapports', roles: ['admin', 'hr'] },
    { path: '/settings', icon: Settings, label: 'Paramètres / Profil', roles: ['admin', 'hr', 'employee'] }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'hr': return 'Ressources Humaines';
      case 'employee': return 'Employé';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed lg:relative z-50 w-80 h-screen glass-effect border-r border-white/10"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Timer className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold gradient-text">TimeTrackPro</h1>
                      <p className="text-xs text-gray-400">Gestion des présences</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* User Info */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{user?.name}</p>
                    <p className="text-sm text-gray-400 truncate">{getRoleLabel(user?.role)}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.department}</p>
                  </div>
                </div>

                {/* Network Status */}
                <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-2">
                    {networkStatus.isAllowed ? (
                      <Wifi className="w-4 h-4 text-green-400" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-sm font-medium">
                      {networkStatus.isAllowed ? 'Réseau autorisé' : 'Réseau non autorisé'}
                    </span>
                    {user?.role === 'admin' && (
                      <Shield className="w-4 h-4 text-yellow-400" title="Accès administrateur" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{networkStatus.location}</p>
                  <p className="text-xs text-gray-500">IP: {networkStatus.ip}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2">
                {filteredMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Logout */}
              <div className="p-4 border-t border-white/10">
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 glass-effect">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold gradient-text">TimeTrackPro</h1>
          <div className="w-10" />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
