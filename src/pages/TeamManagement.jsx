import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Clock, 
  TrendingUp, 
  Calendar, 
  UserCheck, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Filter
} from 'lucide-react';

const TeamManagement = () => {
  const { user, getTeamMembers, getTeams, MOCK_USERS } = useAuth();
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [viewModal, setViewModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const teams = useMemo(() => getTeams ? getTeams() : [], [getTeams]);

  useEffect(() => {
    if (!user) return;
    if (user.role === 'Manager') {
      const members = getTeamMembers(user.id);
      setTeamMembers(members);
      setLoading(false);
    } else if (user.role === 'Admin' || user.role === 'SuperAdmin') {
      const firstTeam = teams[0]?.id || '';
      setSelectedTeamId(firstTeam);
      if (firstTeam) {
        const team = teams.find(t => t.id === firstTeam);
        const members = (team?.members || []).map(id => Object.values(MOCK_USERS).find(u => u.id === id)).filter(Boolean);
        setTeamMembers(members);
      }
      setLoading(false);
    }
  }, [user, getTeamMembers, teams, MOCK_USERS]);

  useEffect(() => {
    if (!selectedTeamId || !(user?.role === 'Admin' || user?.role === 'SuperAdmin')) return;
    const team = teams.find(t => t.id === selectedTeamId);
    const members = (team?.members || []).map(id => Object.values(MOCK_USERS).find(u => u.id === id)).filter(Boolean);
    setTeamMembers(members);
  }, [selectedTeamId, teams, MOCK_USERS, user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'text-green-500';
      case 'absent': return 'text-red-500';
      case 'late': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4" />;
      case 'absent': return <XCircle className="h-4 w-4" />;
      case 'late': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    if (filter === 'all') return true;
    if (filter === 'present') return member.status === 'present';
    if (filter === 'absent') return member.status === 'absent';
    if (filter === 'late') return member.status === 'late';
    return true;
  });

  const stats = {
    total: teamMembers.length,
    present: teamMembers.filter(m => m.status === 'present').length,
    absent: teamMembers.filter(m => m.status === 'absent').length,
    late: teamMembers.filter(m => m.status === 'late').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Gestion d'équipe
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {user?.role === 'Manager' ? `Gérez votre équipe : ${user?.teamName}` : 'Administration des équipes'}
          </p>
        </div>
        <div className="flex gap-2">
          {(user?.role === 'Admin' || user?.role === 'SuperAdmin') && (
            <div className="w-64">
              <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une équipe" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {(user?.role === 'Admin' || user?.role === 'SuperAdmin') && (
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Modifier l'équipe
            </Button>
          )}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total équipe
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.total}
              </p>
            </div>
            <Users className={`h-8 w-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
        </Card>

        <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Présents
              </p>
              <p className="text-2xl font-bold text-green-600">
                {stats.present}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                En retard
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.late}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>

        <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Absents
              </p>
              <p className="text-2xl font-bold text-red-600">
                {stats.absent}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Tous ({stats.total})
        </Button>
        <Button
          variant={filter === 'present' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('present')}
        >
          Présents ({stats.present})
        </Button>
        <Button
          variant={filter === 'late' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('late')}
        >
          En retard ({stats.late})
        </Button>
        <Button
          variant={filter === 'absent' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('absent')}
        >
          Absents ({stats.absent})
        </Button>
      </motion.div>

      {/* Team Members List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filteredMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`p-6 hover:shadow-lg transition-all duration-200 ${
              isDarkMode ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70' : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {member.name}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {member.email}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 ${getStatusColor(member.status || 'unknown')}`}>
                  {getStatusIcon(member.status || 'unknown')}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Type de salaire:
                  </span>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {member.salaryType === 'hourly' ? 'Horaire' : 
                     member.salaryType === 'monthly' ? 'Mensuel' : 
                     member.salaryType === 'commission' ? 'Commission' : 'Mixte'}
                  </span>
                </div>

                {member.hourlyRate && (
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Taux horaire:
                    </span>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {member.hourlyRate}€/h
                    </span>
                  </div>
                )}

                {member.monthlySalary && (
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Salaire mensuel:
                    </span>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {member.monthlySalary}€
                    </span>
                  </div>
                )}

                <div className="flex gap-2 pt-3">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setViewModal(member)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Voir détails
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditModal({ ...member })}>
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {viewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setViewModal(null)}>
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 w-full max-w-lg`} onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Détails du membre</h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{viewModal.name} • {viewModal.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Type salaire</div>
              <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{viewModal.salaryType}</div>
              {viewModal.hourlyRate && <><div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Taux horaire</div><div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{viewModal.hourlyRate}€/h</div></>}
              {viewModal.monthlySalary && <><div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mensuel</div><div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{viewModal.monthlySalary}€</div></>}
            </div>
            <div className="mt-4">
              <Button onClick={() => setViewModal(null)} className="w-full">Fermer</Button>
            </div>
          </Card>
        </div>
      )}

      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditModal(null)}>
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 w-full max-w-lg`} onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Modifier le membre</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Nom</label>
                <input value={editModal.name} onChange={(e) => setEditModal({ ...editModal, name: e.target.value })} className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} w-full px-3 py-2 rounded border`} />
              </div>
              <div>
                <label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Statut</label>
                <select value={editModal.status || 'present'} onChange={(e) => setEditModal({ ...editModal, status: e.target.value })} className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} w-full px-3 py-2 rounded border`}>
                  <option value="present">Présent</option>
                  <option value="late">En retard</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => { setTeamMembers(prev => prev.map(m => m.id === editModal.id ? { ...m, name: editModal.name, status: editModal.status } : m)); setEditModal(null); toast({ title: 'Membre mis à jour' }); }} className="flex-1">Enregistrer</Button>
              <Button variant="outline" onClick={() => setEditModal(null)} className="flex-1">Annuler</Button>
            </div>
          </Card>
        </div>
      )}

      {filteredMembers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
        >
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun membre trouvé avec ce filtre.</p>
        </motion.div>
      )}
    </div>
  );
};

export default TeamManagement;

