
import React, { useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
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

const DepartmentManagement = () => {
  const { toast } = useToast();
  const { MOCK_USERS } = useAuth();
  const [departments, setDepartments] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tt_departments') || '["Direction", "RH", "Informatique"]'); } catch { return ["Direction", "RH", "Informatique"]; }
  });
  const [newDept, setNewDept] = useState('');

  const counts = useMemo(() => {
    const users = Object.values(MOCK_USERS || {});
    const map = {};
    users.forEach(u => {
      if (u.role === 'Employé' && u.department) {
        map[u.department] = (map[u.department] || 0) + 1;
      }
    });
    return map;
  }, [MOCK_USERS]);

  const saveDepartments = (list) => {
    localStorage.setItem('tt_departments', JSON.stringify(list));
  };

  const handleAdd = () => {
    if (!newDept.trim()) return;
    if (departments.includes(newDept.trim())) {
      toast({ variant: 'destructive', title: 'Déjà existant', description: 'Ce secteur existe déjà.' });
      return;
    }
    const updated = [...departments, newDept.trim()];
    setDepartments(updated);
    saveDepartments(updated);
    setNewDept('');
    toast({ title: 'Secteur ajouté', description: `${newDept.trim()} a été ajouté avec succès.` });
  };

  const handleRemove = (dept) => {
    if (counts[dept] > 0) {
      toast({ variant: 'destructive', title: 'Impossible de supprimer', description: `${dept} contient ${counts[dept]} employé(s).` });
      return;
    }
    const updated = departments.filter(d => d !== dept);
    setDepartments(updated);
    saveDepartments(updated);
    toast({ title: 'Secteur supprimé', description: `${dept} a été supprimé.` });
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
        <title>Gestion des secteurs - TimeTrackPro</title>
        <meta name="description" content="Gérez les secteurs d'activité de l'entreprise." />
      </Helmet>
      <h1 className="text-3xl font-bold text-white mb-6">Gestion des secteurs</h1>
      <p className="text-gray-300 mb-4">Gérez les différents secteurs de votre entreprise.</p>
      <div className="flex gap-2 mb-6">
        <input 
          value={newDept} 
          onChange={(e) => setNewDept(e.target.value)} 
          placeholder="Nouveau secteur" 
          className="px-3 py-2 rounded bg-white/10 border border-white/20 text-white flex-1" 
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button onClick={handleAdd}>Ajouter</Button>
      </div>
      <ul className="space-y-2">
        {departments.map(d => (
          <li key={d} className="p-3 rounded border border-white/10 glass-effect text-white flex items-center justify-between">
            <span>{d}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-80">{counts[d] || 0} employé(s)</span>
              {counts[d] === 0 && (
                <button 
                  onClick={() => handleRemove(d)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Supprimer
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default DepartmentManagement;
