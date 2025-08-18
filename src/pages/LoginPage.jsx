
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();

  useEffect(() => {
    // Auto-fill demo credentials
    setEmail('admin@timetrackpro.com');
    setPassword('admin123');
  }, []);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await login(email, password);
    
    setIsLoading(false);
  };

  const demoAccounts = [
    { email: 'admin@timetrackpro.com', password: 'admin123', role: 'Administrateur', name: 'Marie Dubois' },
    { email: 'rh@timetrackpro.com', password: 'rh123', role: 'RH', name: 'Pierre Martin' },
    { email: 'employe@timetrackpro.com', password: 'employe123', role: 'Employé', name: 'Sophie Leroy' }
  ];

  return (
    <>
      <Helmet>
        <title>Connexion - TimeTrackPro</title>
        <meta name="description" content="Connectez-vous à votre espace TimeTrackPro pour gérer vos présences et pointages" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-6"
          >
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Timer className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text">TimeTrackPro</h1>
                <p className="text-gray-400">Gestion des présences</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">
                Simplifiez la gestion de vos équipes
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Pointage intelligent, calcul automatique des salaires, et contrôle d'accès sécurisé pour votre entreprise.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="glass-effect rounded-xl p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Timer className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white">Pointage Rapide</h3>
                <p className="text-sm text-gray-400">Extension navigateur incluse</p>
              </div>
              <div className="glass-effect rounded-xl p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white">Calcul Auto</h3>
                <p className="text-sm text-gray-400">Salaires et heures</p>
              </div>
              <div className="glass-effect rounded-xl p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white">Sécurisé</h3>
                <p className="text-sm text-gray-400">Contrôle réseau</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            <Card className="glass-effect border-white/10">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-white">Connexion</CardTitle>
                <CardDescription className="text-gray-400">
                  Accédez à votre espace de travail
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="••••••••"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2.5"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Connexion...</span>
                      </div>
                    ) : (
                      'Se connecter'
                    )}
                  </Button>
                </form>

                {/* Demo Accounts */}
                <div className="border-t border-white/10 pt-6">
                  <p className="text-sm text-gray-400 text-center mb-4">Comptes de démonstration :</p>
                  <div className="space-y-2">
                    {demoAccounts.map((account, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left border-white/20 bg-white/5 hover:bg-white/10 text-white"
                        onClick={() => {
                          setEmail(account.email);
                          setPassword(account.password);
                        }}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{account.name}</span>
                          <span className="text-xs text-gray-400">{account.role} - {account.email}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
