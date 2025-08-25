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
import { useNetwork } from '@/contexts/NetworkContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, changePassword, MOCK_USERS, getTeamMembers, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { toast } = useToast();
  const { networkConfig, updateNetworkConfig, networkStatus, checkNetworkAccess } = useNetwork();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    username: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [networkForm, setNetworkForm] = useState({
    enforce: networkConfig?.enforce || false,
    allowed: Array.isArray(networkConfig?.allowed) ? networkConfig.allowed.join(', ') : ''
  });

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Les mots de passe ne correspondent pas.' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Le mot de passe doit contenir au moins 6 caractères.' });
      return;
    }
    const result = changePassword(passwordForm.username, passwordForm.newPassword);
    if (result.success) {
      toast({ title: 'Succès', description: result.message });
      setPasswordForm({ username: '', newPassword: '', confirmPassword: '' });
    } else {
      toast({ variant: 'destructive', title: 'Erreur', description: result.message });
    }
  };

  const handleSaveNetwork = async () => {
    const list = (networkForm.allowed || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    updateNetworkConfig({ enforce: !!networkForm.enforce, allowed: list });
    toast({ title: 'Paramètres réseau enregistrés', description: 'Les restrictions IP ont été mises à jour.' });
    await checkNetworkAccess();
  };

  const teamMembers = user?.role === 'Manager' ? getTeamMembers(user.id) : [];

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Paramètres - TimeTrackPro</title>
        <meta name="description" content="Gérez les paramètres de votre compte." />
      </Helmet>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Paramètres / Profil</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gérez les informations de votre profil et les paramètres de l'application.</p>
        </div>
        <SettingsIcon className={`h-8 w-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-6">
              <User className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Profil utilisateur</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Nom complet</Label>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
              </div>
              <div>
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Nom d'utilisateur</Label>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.username}</p>
              </div>
              <div>
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Email</Label>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.email}</p>
              </div>
              <div>
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Rôle</Label>
                <div className="flex items-center gap-2">
                  <Shield className={`h-4 w-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.role}</span>
                </div>
              </div>
              {user?.teamName && (
                <div>
                  <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Équipe</Label>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.teamName}</p>
                </div>
              )}
              {(user?.role === 'Employé' || user?.role === 'Manager') ? null : (
                <Button className="w-full">Modifier le profil</Button>
              )}
              {user?.role === 'Manager' && teamMembers.length > 0 && (
                <div className="pt-2">
                  <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Membres de votre équipe</Label>
                  <ul className="list-disc list-inside text-sm text-gray-300">
                    {teamMembers.map(m => (
                      <li key={m.id}>{m.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Theme Settings */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-6">
              {isDarkMode ? <Moon className="h-6 w-6 text-yellow-400" /> : <Sun className="h-6 w-6 text-blue-600" />}
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Apparence</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Mode d'affichage</Label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>Choisissez entre le mode clair et le mode sombre.</p>
                <Button onClick={toggleTheme} variant="outline" className="w-full">
                  {isDarkMode ? 'Passer au mode jour' : 'Passer au mode nuit'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Session Controls */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
          <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-6">
              <Lock className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Connexion / Déconnexion</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => navigate('/login')}>Se connecter</Button>
              <Button variant="outline" onClick={() => { logout(); navigate('/login'); toast({ title: 'Déconnexion', description: 'À bientôt !' }); }}>Se déconnecter</Button>
            </div>
          </Card>
        </motion.div>

        {/* SuperAdmin: Network Restriction & Passwords */}
        {user?.role === 'SuperAdmin' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 space-y-6">
            <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-6">
                <Shield className={`h-6 w-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Réseaux autorisés (pointage)</h2>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'}`}>SuperAdmin</div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Activer la restriction</Label>
                  <button type="button" onClick={() => setNetworkForm(prev => ({ ...prev, enforce: !prev.enforce }))} className={`w-12 h-6 rounded-full relative transition-colors ${networkForm.enforce ? 'bg-green-500' : 'bg-gray-500'}`} aria-pressed={networkForm.enforce}>
                    <span className={`absolute top-0.5 ${networkForm.enforce ? 'right-0.5' : 'left-0.5'} w-5 h-5 bg-white rounded-full transition-all`} />
                  </button>
                </div>
                <div>
                  <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>IP autorisées (séparées par des virgules)</Label>
                  <Input value={networkForm.allowed} onChange={(e) => setNetworkForm({ ...networkForm, allowed: e.target.value })} placeholder="192.168.1.100, 192.168.1.101" className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} />
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Les rôles Admin et SuperAdmin ne sont pas restreints.</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveNetwork} className="bg-green-600 hover:bg-green-700"><Save className="w-4 h-4 mr-2" />Enregistrer</Button>
                  <Button variant="outline" onClick={checkNetworkAccess}>Vérifier l'accès</Button>
                </div>
              </div>
            </Card>

            <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-6">
                <Key className={`h-6 w-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Gestion des mots de passe</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Nom d'utilisateur</Label>
                    <Select value={passwordForm.username} onValueChange={(value) => setPasswordForm({...passwordForm, username: value})}>
                      <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}>
                        <SelectValue placeholder="Sélectionner un utilisateur" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(MOCK_USERS).map((u) => (
                          <SelectItem key={u.username} value={u.username}>{u.name} ({u.role})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Nouveau mot de passe</Label>
                    <div className="relative">
                      <Input id="newPassword" type={showPassword ? 'text' : 'password'} value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} placeholder="Nouveau mot de passe" className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white pr-10' : 'bg-white border-gray-300 pr-10'} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Confirmer le mot de passe</Label>
                    <Input id="confirmPassword" type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} placeholder="Confirmer le mot de passe" className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} />
                  </div>
                  <Button onClick={handlePasswordChange} disabled={!passwordForm.username || !passwordForm.newPassword || !passwordForm.confirmPassword} className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"><Lock className="h-4 w-4 mr-2" />Changer le mot de passe</Button>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Instructions</h3>
                  <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>• Sélectionnez l'utilisateur</li>
                    <li>• 6 caractères minimum</li>
                    <li>• Confirmez le nouveau mot de passe</li>
                    <li>• SuperAdmin uniquement</li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Settings;