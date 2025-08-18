import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

const Notifications = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const demo = [
      { id: 1, title: "Rappel de pointage", description: "Veuillez pointer votre arrivée.", time: new Date().toLocaleTimeString('fr-FR') },
      { id: 2, title: "Absence validée", description: "Votre demande d'absence a été approuvée.", time: new Date().toLocaleDateString('fr-FR') },
    ];
    setItems(demo);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Helmet>
        <title>Notifications - TimeTrackPro</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-white mb-6">Notifications</h1>
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2"><Bell className="w-5 h-5" /> Flux</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.map(n => (
              <div key={n.id} className="p-3 rounded-lg border border-white/10 glass-effect">
                <div className="flex items-center justify-between">
                  <p className="text-white font-medium">{n.title}</p>
                  <span className="text-xs text-gray-400">{n.time}</span>
                </div>
                <p className="text-gray-400 text-sm">{n.description}</p>
              </div>
            ))}
            {items.length === 0 && <p className="text-gray-400">Aucune notification</p>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Notifications;


