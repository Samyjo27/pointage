
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();

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
      <p className="text-lg text-gray-300">
        Bonjour, {user?.name} ! Bienvenue sur votre tableau de bord.
      </p>
    </motion.div>
  );
};

export default Dashboard;
