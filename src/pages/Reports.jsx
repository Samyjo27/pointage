
import React, { useState } from 'react';
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
  FileText,
  Download,
  Calendar,
  Users,
  Clock,
  TrendingUp,
  Filter,
  BarChart3,
  PieChart,
  FileSpreadsheet
} from 'lucide-react';

const Reports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reportType, setReportType] = useState('attendance');
  const [dateRange, setDateRange] = useState('month');
  const [department, setDepartment] = useState('all');
  const [employee, setEmployee] = useState('all');

  const reportTypes = [
    { value: 'attendance', label: 'Rapport de présence', icon: Clock },
    { value: 'hours', label: 'Heures travaillées', icon: BarChart3 },
    { value: 'salary', label: 'Calcul des salaires', icon: TrendingUp },
    { value: 'department', label: 'Analyse par secteur', icon: PieChart },
    { value: 'absence', label: 'Absences et congés', icon: Calendar },
    { value: 'performance', label: 'Performance équipe', icon: Users }
  ];

  const dateRanges = [
    { value: 'today', label: 'Aujourd\'hui' },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'quarter', label: 'Ce trimestre' },
    { value: 'year', label: 'Cette année' },
    { value: 'custom', label: 'Période personnalisée' }
  ];

  const departments = [
    'Direction', 'RH', 'Informatique', 'Comptabilité', 'Commercial', 
    'Marketing', 'Logistique', 'Production', 'Support', 'Maintenance'
  ];

  const mockEmployees = [
    'Marie Dubois', 'Pierre Martin', 'Sophie Leroy', 'Jean Dupont', 'Emma Bernard'
  ];

  const handleGenerateReport = () => {
    if (!reportType || !dateRange) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un type de rapport et une période",
        variant: "destructive"
      });
      return;
    }

    // Activer les rapports avec un mock de génération
    setTimeout(() => {
      toast({
        title: 'Rapport généré',
        description: `Type: ${reportType}, Période: ${dateRange}${department !== 'all' ? `, Secteur: ${department}` : ''}${employee !== 'all' ? `, Employé: ${employee}` : ''}`,
      });
    }, 500);
  };

  const handleExportExcel = () => {
    toast({ title: 'Export Excel', description: 'Export simulé en .xlsx' });
  };

  const handleExportPDF = () => {
    toast({ title: 'Export PDF', description: 'Export simulé en .pdf' });
  };

  const quickStats = {
    totalEmployees: 28,
    presentToday: 23,
    totalHours: 1840,
    avgHours: 7.5
  };

  const recentReports = [
    {
      id: 1,
      name: 'Rapport mensuel - Juin 2025',
      type: 'Heures travaillées',
      date: '2025-07-01',
      size: '2.3 MB'
    },
    {
      id: 2,
      name: 'Analyse secteur Informatique',
      type: 'Performance équipe',
      date: '2025-06-28',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'Calcul salaires Juin',
      type: 'Calcul des salaires',
      date: '2025-06-30',
      size: '3.1 MB'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Export / Rapports - TimeTrackPro</title>
        <meta name="description" content="Générez et exportez des rapports détaillés sur les présences et performances" />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-white">Export / Rapports</h1>
            <p className="text-gray-400 mt-1">
              Générez des rapports détaillés et exportez vos données
            </p>
          </div>
        </motion.div>

        {/* Quick Stats */}
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
                    <p className="text-2xl font-bold text-white">{quickStats.totalEmployees}</p>
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
                    <p className="text-gray-400 text-sm">Présents aujourd'hui</p>
                    <p className="text-2xl font-bold text-white">{quickStats.presentToday}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Heures ce mois</p>
                    <p className="text-2xl font-bold text-white">{quickStats.totalHours}h</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Moyenne/jour</p>
                    <p className="text-2xl font-bold text-white">{quickStats.avgHours}h</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Report Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Générateur de rapports</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configurez et générez vos rapports personnalisés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="reportType" className="text-white">Type de rapport *</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <type.icon className="w-4 h-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateRange" className="text-white">Période *</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="Sélectionnez une période" />
                    </SelectTrigger>
                    <SelectContent>
                      {dateRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {dateRange === 'custom' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-white">Date de début</Label>
                      <Input
                        id="startDate"
                        type="date"
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-white">Date de fin</Label>
                      <Input
                        id="endDate"
                        type="date"
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-white">Secteur (optionnel)</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
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

                <div className="space-y-2">
                  <Label htmlFor="employee" className="text-white">Employé (optionnel)</Label>
                  <Select value={employee} onValueChange={setEmployee}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="Tous les employés" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les employés</SelectItem>
                      {mockEmployees.map((emp) => (
                        <SelectItem key={emp} value={emp}>{emp}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={handleGenerateReport}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Générer le rapport
                </Button>
                
                <Button
                  onClick={handleExportExcel}
                  variant="outline"
                  className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Exporter Excel
                </Button>
                
                <Button
                  onClick={handleExportPDF}
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Report Templates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Modèles rapides</CardTitle>
              <CardDescription className="text-gray-400">
                Générez rapidement les rapports les plus demandés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportTypes.map((type, index) => (
                  <motion.div
                    key={type.value}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  >
                    <Button
                      onClick={() => {
                        setReportType(type.value);
                        setDateRange('month');
                        handleGenerateReport();
                      }}
                      variant="outline"
                      className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-white/20 text-white hover:bg-white/5"
                    >
                      <type.icon className="w-6 h-6" />
                      <span className="text-sm">{type.label}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Rapports récents</CardTitle>
              <CardDescription className="text-gray-400">
                Vos derniers rapports générés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-4 glass-effect rounded-lg border border-white/10"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{report.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{report.type}</span>
                          <span>•</span>
                          <span>{new Date(report.date).toLocaleDateString('fr-FR')}</span>
                          <span>•</span>
                          <span>{report.size}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast({
                        title: "🚧 Cette fonctionnalité n'est pas encore implémentée",
                        description: "Mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine requête ! 🚀"
                      })}
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Reports;
