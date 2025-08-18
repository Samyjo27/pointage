
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Clock,
  DollarSign
} from 'lucide-react';

const EmployeeManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const departments = [
    'Direction', 'RH', 'Informatique', 'Comptabilité', 'Commercial', 
    'Marketing', 'Logistique', 'Production', 'Support', 'Maintenance',
    'Sécurité', 'Juridique', 'Accueil'
  ];

  const mockEmployees = [
    {
      id: 1,
      name: 'Marie Dubois',
      email: 'marie.dubois@timetrackpro.com',
      role: 'admin',
      department: 'Direction',
      hourlyRate: 35,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      joinDate: '2023-01-15',
      lastSeen: '2025-07-15T14:30:00Z'
    },
    {
      id: 2,
      name: 'Pierre Martin',
      email: 'pierre.martin@timetrackpro.com',
      role: 'hr',
      department: 'RH',
      hourlyRate: 28,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      joinDate: '2023-03-20',
      lastSeen: '2025-07-15T16:45:00Z'
    },
    {
      id: 3,
      name: 'Sophie Leroy',
      email: 'sophie.leroy@timetrackpro.com',
      role: 'employee',
      department: 'Informatique',
      hourlyRate: 25,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      joinDate: '2023-06-10',
      lastSeen: '2025-07-15T17:00:00Z'
    },
    {
      id: 4,
      name: 'Jean Dupont',
      email: 'jean.dupont@timetrackpro.com',
      role: 'employee',
      department: 'Commercial',
      hourlyRate: 22,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      joinDate: '2023-09-05',
      lastSeen: '2025-07-15T15:20:00Z'
    },
    {
      id: 5,
      name: 'Emma Bernard',
      email: 'emma.bernard@timetrackpro.com',
      role: 'employee',
      department: 'Marketing',
      hourlyRate: 24,
      status: 'inactive',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      joinDate: '2023-11-12',
      lastSeen: '2025-07-10T12:00:00Z'
    }
  ];

  useEffect(() => {
    setEmployees(mockEmployees);
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'hr': return 'RH';
      case 'employee': return 'Employé';
      default: return role;
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Actif' : 'Inactif';
  };

  const handleAddEmployee = () => {
    toast({
      title: "🚧 Cette fonctionnalité n'est pas encore implémentée",
      description: "Mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine requête ! 🚀"
    });
  };

  const handleEditEmployee = (employeeId) => {
    toast({
      title: "🚧 Cette fonctionnalité n'est pas encore implémentée",
      description: "Mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine requête ! 🚀"
    });
  };

  const handleDeleteEmployee = (employeeId) => {
    toast({
      title: "🚧 Cette fonctionnalité n'est pas encore implémentée",
      description: "Mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine requête ! 🚀"
    });
  };

  const handleViewDetails = (employeeId) => {
    toast({
      title: "🚧 Cette fonctionnalité n'est pas encore implémentée",
      description: "Mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine requête ! 🚀"
    });
  };

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    inactive: employees.filter(e => e.status === 'inactive').length,
    avgSalary: employees.reduce((acc, e) => acc + e.hourlyRate, 0) / employees.length
  };

  return (
    <>
      <Helmet>
        <title>Gestion des Employés - TimeTrackPro</title>
        <meta name="description" content="Gérez les employés, leurs rôles et leurs informations" />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Gestion des Employés</h1>
            <p className="text-gray-400 mt-1">
              Gérez les employés et leurs informations
            </p>
          </div>

          <Button
            onClick={handleAddEmployee}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un employé
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total employés</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Actifs</p>
                    <p className="text-2xl font-bold text-white">{stats.active}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Inactifs</p>
                    <p className="text-2xl font-bold text-white">{stats.inactive}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <UserX className="w-6 h-6 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Salaire moyen</p>
                    <p className="text-2xl font-bold text-white">{stats.avgSalary.toFixed(0)}€/h</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-effect border-white/10">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un employé..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="lg:w-64">
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Tous les secteurs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les secteurs</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Employees List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Liste des employés</CardTitle>
              <CardDescription className="text-gray-400">
                {filteredEmployees.length} employé(s) trouvé(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEmployees.map((employee, index) => (
                  <motion.div
                    key={employee.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="glass-effect rounded-lg p-6 border border-white/10 card-hover"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex items-center space-x-4">
                        <img
                          src={employee.avatar}
                          alt={employee.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/30"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-lg font-semibold text-white">{employee.name}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}>
                              {getStatusText(employee.status)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Email</p>
                              <p className="text-white">{employee.email}</p>
                            </div>
                            
                            <div>
                              <p className="text-gray-400">Rôle</p>
                              <p className="text-white">{getRoleLabel(employee.role)}</p>
                            </div>
                            
                            <div>
                              <p className="text-gray-400">Secteur</p>
                              <p className="text-white">{employee.department}</p>
                            </div>
                            
                            <div>
                              <p className="text-gray-400">Salaire horaire</p>
                              <p className="text-white">{employee.hourlyRate}€/h</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                            <span>Embauché le {new Date(employee.joinDate).toLocaleDateString('fr-FR')}</span>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Vu le {new Date(employee.lastSeen).toLocaleDateString('fr-FR')}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(employee.id)}
                          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEmployee(employee.id)}
                          className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        {user.role === 'admin' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {filteredEmployees.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Aucun employé trouvé</p>
                    <p className="text-gray-500 text-sm">Modifiez vos critères de recherche</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default EmployeeManagement;
