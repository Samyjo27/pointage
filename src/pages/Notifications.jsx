import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getNotificationsFor, markAsRead } from '@/lib/notifications';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [items, setItems] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setItems(getNotificationsFor(user.id));
    const handler = () => setItems(getNotificationsFor(user.id));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [user]);

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
              <button key={n.id} onClick={() => { if (n.route) navigate(n.route); markAsRead(n.id); }} className="w-full text-left p-3 rounded-lg border border-white/10 glass-effect hover:bg-white/5">
                <div className="flex items-center justify-between">
                  <p className="text-white font-medium">{n.title}</p>
                  <span className="text-xs text-gray-400">{new Date(n.time).toLocaleString('fr-FR')}</span>
                </div>
                <p className="text-gray-400 text-sm">{n.description}</p>
              </button>
            ))}
            {items.length === 0 && <p className="text-gray-400">Aucune notification</p>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Notifications;


