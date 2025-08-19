
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

const MyHours = () => {
  const { user } = useAuth();
  const entries = (JSON.parse(localStorage.getItem('timetrack_clockins') || '[]') || [])
    .filter(e => e.userId === user?.id)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const groupByDate = entries.reduce((acc, e) => {
    const key = new Date(e.timestamp).toLocaleDateString('fr-FR');
    acc[key] = acc[key] || [];
    acc[key].push(e);
    return acc;
  }, {});

  const days = Object.keys(groupByDate);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Helmet>
        <title>Mes Horaires - TimeTrackPro</title>
        <meta name="description" content="Consultez votre historique de pointage." />
      </Helmet>
      <h1 className="text-3xl font-bold text-white mb-6">Mes Horaires</h1>

      {days.length === 0 ? (
        <p className="text-gray-400">Aucun pointage enregistré.</p>
      ) : (
        <div className="space-y-6">
          {days.map((day) => (
            <Card key={day} className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white">{day}</CardTitle>
                <CardDescription className="text-gray-400">Historique des événements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {groupByDate[day]
                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                    .map((e) => (
                      <div key={e.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-none">
                        <span className="text-white">
                          {e.type === 'clock_in' ? 'Arrivée' : e.type === 'clock_out' ? 'Départ' : e.type === 'break_start' ? 'Début de pause' : 'Fin de pause'}
                        </span>
                        <span className="text-gray-400 time-display">{new Date(e.timestamp).toLocaleTimeString('fr-FR')}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyHours;
