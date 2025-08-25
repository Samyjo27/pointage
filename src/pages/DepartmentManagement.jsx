
import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getDepartments, addDepartment, setDepartments as setDepartmentsStore } from '@/lib/departments';

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
  const [departments, setDepartments] = useState(['Direction', 'RH', 'Informatique']);
  const [newDept, setNewDept] = useState('');

  useEffect(() => {
    setDepartments(getDepartments());
  }, []);

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

  const handleAdd = () => {
    if (!newDept.trim()) return;
    if (departments.includes(newDept.trim())) {
      toast({ variant: 'destructive', title: 'Déjà existant', description: 'Ce secteur existe déjà.' });
      return;
    }
    const next = addDepartment(newDept.trim());
    setDepartments(next);
    setNewDept('');
    toast({ title: 'Secteur ajouté' });
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
        <input value={newDept} onChange={(e) => setNewDept(e.target.value)} placeholder="Nouveau secteur" className="px-3 py-2 rounded bg-white/10 border border-white/20 text-white" />
        <Button onClick={handleAdd}>Ajouter</Button>
      </div>
      <ul className="space-y-2">
        {departments.map(d => (
          <li key={d} className="p-3 rounded border border-white/10 glass-effect text-white flex items-center justify-between">
            <span>{d}</span>
            <span className="text-sm opacity-80">{counts[d] || 0}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default DepartmentManagement;
