
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

const BrowserExtension = () => {
  const { toast } = useToast();

  const downloadZip = async () => {
    try {
      // Create a simple zip blob dynamically (placeholder). In real build, serve a real zip asset.
      const content = 'Voir le dossier extension/ pour le code source. Zipez ce dossier pour installation manuelle.';
      const blob = new Blob([content], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'timetrackpro-extension.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: 'Téléchargé', description: 'Archive téléchargée. Décompressez et chargez l’extension.' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Erreur', description: "Impossible de préparer l'archive" });
    }
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
        <title>Extension Navigateur - TimeTrackPro</title>
        <meta name="description" content="Guide d'installation de l'extension navigateur." />
      </Helmet>
      <h1 className="text-3xl font-bold text-white mb-6">Extension Navigateur</h1>
      <div className="space-y-6 text-gray-300">
        <p>
          L’extension est compatible <strong>Google Chrome</strong>, <strong>Mozilla Firefox</strong> et <strong>Opera</strong>.
          Elle permet d’envoyer des actions de pointage vers l’application ouverte (arrivée, pause, reprise, sortie).
        </p>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Installation (Chrome / Opera)</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Téléchargez l’archive ci-dessous puis décompressez-la (ou zipez le dossier <code>extension/</code>).</li>
            <li>Ouvrez <code>chrome://extensions</code> (ou <code>opera://extensions</code>).</li>
            <li>Activez le <strong>Mode développeur</strong>.</li>
            <li>Cliquez sur <strong>Charger l’extension non empaquetée</strong> et sélectionnez le dossier <code>extension/</code>.</li>
          </ol>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Installation (Firefox)</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Ouvrez <code>about:debugging#/runtime/this-firefox</code>.</li>
            <li>Cliquez sur <strong>Charger un module complémentaire temporaire…</strong>.</li>
            <li>Sélectionnez le fichier <code>manifest.json</code> dans le dossier <code>extension/</code>.</li>
          </ol>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={downloadZip} className="bg-blue-600 hover:bg-blue-700">Télécharger l’archive</Button>
          <a
            className="underline text-sm text-gray-300"
            href="/extension/manifest.json"
            target="_blank"
            rel="noreferrer"
          >
            Voir le manifest
          </a>
        </div>

        <p className="text-sm text-gray-400">
          Astuce: utilisez la pop-up de l’extension pendant que l’application est ouverte pour déclencher le pointage.
        </p>
      </div>
    </motion.div>
  );
};

export default BrowserExtension;
