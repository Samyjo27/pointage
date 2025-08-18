
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

const Clocking = () => {
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
        <title>Pointage - TimeTrackPro</title>
        <meta name="description" content="Pointez votre arrivée et votre départ." />
      </Helmet>
      <h1 className="text-3xl font-bold text-white mb-6">Pointage</h1>
      <div className="flex gap-4">
        <Button onClick={handleNotImplemented} size="lg" className="bg-green-600 hover:bg-green-700">Pointer l'arrivée</Button>
        <Button onClick={handleNotImplemented} size="lg" className="bg-red-600 hover:bg-red-700">Pointer le départ</Button>
      </div>
    </motion.div>
  );
};

export default Clocking;
