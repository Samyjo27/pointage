import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Lock, 
  Sun, 
  Moon, 
  Settings as SettingsIcon,
  Shield,
  Eye,
  EyeOff,
  Save,
  Key
} from 'lucide-react';

const Settings = () => {
  const { user, changePassword, MOCK_USERS } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    username: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
      });
      return;
    }

    const result = changePassword(passwordForm.username, passwordForm.newPassword);
    
    if (result.success) {
      toast({
        title: "Succès",
        description: result.message,
      });
      setPasswordForm({
        username: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: result.message,
      });
    }
  };

  const handleNotImplemented = () => {
    toast({
      title: "🚧 Fonctionnalité en cours de développement",
      description: "Cette fonctionnalité n'est pas encore implémentée. Vous pourrez la demander dans un prochain prompt ! 🚀",
    });
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Paramètres - TimeTrackPro</title>
        <meta name="description" content="Gérez les paramètres de votre compte." />
      </Helmet>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Paramètres / Profil
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Gérez les informations de votre profil et les paramètres de l'application.
          </p>
        </div>
        <SettingsIcon className={`h-8 w-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-6">
              <User className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Profil utilisateur
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Nom complet
                </Label>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user?.name}
                </p>
              </div>

              <div>
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Nom d'utilisateur
                </Label>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user?.username}
                </p>
              </div>

              <div>
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Email
                </Label>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user?.email}
                </p>
              </div>

              <div>
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Rôle
                </Label>
                <div className="flex items-center gap-2">
                  <Shield className={`h-4 w-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {user?.role}
                  </span>
                </div>
              </div>

              {user?.teamName && (
                <div>
                  <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Équipe
                  </Label>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {user.teamName}
                  </p>
                </div>
              )}

              <Button onClick={handleNotImplemented} className="w-full">
                Modifier le profil
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Theme Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-6">
              {isDarkMode ? (
                <Moon className="h-6 w-6 text-yellow-400" />
              ) : (
                <Sun className="h-6 w-6 text-blue-600" />
              )}
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Apparence
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Mode d'affichage
                </Label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                  Choisissez entre le mode clair et le mode sombre pour une expérience personnalisée.
                </p>
                <Button 
                  onClick={toggleTheme}
                  variant="outline"
                  className="w-full"
                >
                  {isDarkMode ? (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      Passer au mode jour
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      Passer au mode nuit
                    </>
                  )}
                </Button>
              </div>

              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>Mode actuel:</strong> {isDarkMode ? 'Sombre' : 'Clair'}
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  Le thème est automatiquement sauvegardé dans votre navigateur.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Password Management (SuperAdmin only) */}
        {user?.role === 'SuperAdmin' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-6">
                <Key className={`h-6 w-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Gestion des mots de passe
                </h2>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isDarkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
                }`}>
                  SuperAdmin uniquement
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Nom d'utilisateur
                    </Label>
                    <Select 
                      value={passwordForm.username} 
                      onValueChange={(value) => setPasswordForm({...passwordForm, username: value})}
                    >
                      <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}>
                        <SelectValue placeholder="Sélectionner un utilisateur" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(MOCK_USERS).map((user) => (
                          <SelectItem key={user.username} value={user.username}>
                            {user.name} ({user.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="newPassword" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Nouveau mot de passe
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        placeholder="Nouveau mot de passe"
                        className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white pr-10' : 'bg-white border-gray-300 pr-10'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                          isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Confirmer le mot de passe
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      placeholder="Confirmer le mot de passe"
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                    />
                  </div>

                  <Button 
                    onClick={handlePasswordChange}
                    disabled={!passwordForm.username || !passwordForm.newPassword || !passwordForm.confirmPassword}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Changer le mot de passe
                  </Button>
                </div>

                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Instructions
                  </h3>
                  <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>• Sélectionnez l'utilisateur dont vous voulez changer le mot de passe</li>
                    <li>• Le nouveau mot de passe doit contenir au moins 6 caractères</li>
                    <li>• Confirmez le nouveau mot de passe</li>
                    <li>• Cette action est irréversible</li>
                    <li>• Seul le SuperAdmin peut effectuer cette opération</li>
                  </ul>
                  
                  <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                      <strong>⚠️ Attention:</strong> Cette fonctionnalité permet de changer les mots de passe de tous les utilisateurs. Utilisez-la avec précaution.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Other Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-6">
              <SettingsIcon className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Autres paramètres
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={handleNotImplemented} variant="outline" className="h-20">
                <div className="text-center">
                  <Lock className="h-6 w-6 mx-auto mb-2" />
                  <span>Sécurité</span>
                </div>
              </Button>

              <Button onClick={handleNotImplemented} variant="outline" className="h-20">
                <div className="text-center">
                  <User className="h-6 w-6 mx-auto mb-2" />
                  <span>Notifications</span>
                </div>
              </Button>

              <Button onClick={handleNotImplemented} variant="outline" className="h-20">
                <div className="text-center">
                  <SettingsIcon className="h-6 w-6 mx-auto mb-2" />
                  <span>Préférences</span>
                </div>
              </Button>

              <Button onClick={handleNotImplemented} variant="outline" className="h-20">
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2" />
                  <span>Confidentialité</span>
                </div>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;