
import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

const Dashboard = () => {
  const { user, MOCK_USERS, getTeamMembers } = useAuth();

  const visibleEmployees = useMemo(() => {
    if (!user) return [];
    if (user.role === 'Employé') {
      return [user];
    }
    if (user.role === 'Manager') {
      // Only names of team members
      return getTeamMembers(user.id).map(m => ({ id: m.id, name: m.name, teamName: m.teamName }));
    }
    // Admin and SuperAdmin: all employees
    return Object.values(MOCK_USERS).filter(u => u.role === 'Employé');
  }, [user, getTeamMembers, MOCK_USERS]);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Helmet>
        <title>Tableau de bord - TimeTrackPro</title>
        <meta name="description" content="Tableau de bord principal de TimeTrackPro." />
      </Helmet>
      <h1 className="text-3xl font-bold text-white mb-6">Tableau de bord</h1>
      <p className="text-lg text-gray-300 mb-6">Bonjour, {user?.name} ! Bienvenue sur votre tableau de bord.</p>

      <Card className="glass-effect border-white/10">
        <CardHeader>
          <CardTitle className="text-white">{user.role === 'Employé' ? 'Vos informations' : 'Équipe visible'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visibleEmployees.map(emp => (
              <div key={emp.id} className="p-4 rounded-lg border border-white/10 glass-effect">
                <p className="text-white font-medium">{emp.name}</p>
                {user.role !== 'Employé' && (
                  <p className="text-gray-400 text-sm">{emp.teamName || '—'}</p>
                )}
              </div>
            ))}
            {visibleEmployees.length === 0 && (
              <p className="text-gray-400">Aucun membre à afficher</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Dashboard;
