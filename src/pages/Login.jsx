
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Briefcase, Sun, Moon } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = login(username, password);
    if (result.success) {
      navigate('/');
      toast({
        title: "Connexion réussie !",
        description: "Bienvenue sur TimeTrackPro.",
      });
    } else {
      setError(result.message);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: result.message,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Connexion - TimeTrackPro</title>
        <meta name="description" content="Page de connexion de TimeTrackPro." />
      </Helmet>
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`}>
        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute top-6 right-6 p-3 rounded-full ${
            isDarkMode 
              ? 'bg-gray-800/50 text-yellow-400 hover:bg-yellow-500/20' 
              : 'bg-white/50 text-blue-600 hover:bg-blue-500/20'
          } backdrop-blur-lg border ${
            isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
          }`}
        >
          {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </motion.button>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`w-full max-w-md p-8 space-y-6 rounded-2xl shadow-2xl backdrop-blur-xl border ${
            isDarkMode 
              ? 'bg-gray-800/50 border-purple-500/20' 
              : 'bg-white/80 border-purple-200/50'
          }`}
        >
          <div className="text-center">
            <motion.div 
              className="flex justify-center items-center gap-3 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Briefcase className={`h-10 w-10 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                TimeTrackPro
              </h1>
            </motion.div>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Connectez-vous pour accéder à votre espace.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className={`text-sm font-medium block mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Nom d'utilisateur
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                  isDarkMode 
                    ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Nom d'utilisateur"
              />
            </div>
            
            <div>
              <label
                htmlFor="password"
                className={`text-sm font-medium block mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                  isDarkMode 
                    ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="••••••••"
              />
            </div>
            
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm text-center"
              >
                {error}
              </motion.p>
            )}
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Se connecter
            </motion.button>
          </form>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-center text-xs mt-6 p-4 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-700/50 text-gray-400' 
                : 'bg-gray-100/50 text-gray-600'
            }`}
          >
            <p className="font-semibold mb-2">Utilisateurs de démo :</p>
            <div className="space-y-1 text-left">
              <p><span className="font-medium">SuperAdmin:</span> superadmin / superadmin123</p>
              <p><span className="font-medium">Admin:</span> admin / admin123</p>
              <p><span className="font-medium">Manager 1:</span> manager1 / manager123</p>
              <p><span className="font-medium">Manager 2:</span> manager2 / manager123</p>
              <p><span className="font-medium">Employé 1:</span> employee1 / employee123</p>
              <p><span className="font-medium">Employé 2:</span> employee2 / employee123</p>
              <p><span className="font-medium">Employé 3:</span> employee3 / employee123</p>
              <p><span className="font-medium">Employé 4:</span> employee4 / employee123</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
