
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

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
  const { toast } = useToast();

  const handleNotImplemented = () => {
    toast({
      title: "🚧 Fonctionnalité en cours de développement",
      description: "Cette fonctionnalité n'est pas encore implémentée. Vous pourrez la demander dans un prochain prompt ! 🚀",
    });
  };

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
      <p className="text-gray-300 mb-4">
        Ici, vous pourrez consulter l'historique de vos pointages.
      </p>
      <Button onClick={handleNotImplemented}>Voir l'historique détaillé</Button>
    </motion.div>
  );
};

export default MyHours;
