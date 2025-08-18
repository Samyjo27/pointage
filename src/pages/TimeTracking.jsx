
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Clock,
  Calendar,
  TrendingUp,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const TimeTracking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [timeEntries, setTimeEntries] = useState([]);

  useEffect(() => {
    // Load time entries from localStorage
    const clockIns = JSON.parse(localStorage.getItem('timetrack_clockins') || '[]');
    const userEntries = clockIns.filter(entry => entry.userId === user.id);
    setTimeEntries(userEntries);
  }, [user.id]);

  const generateMockTimeEntries = () => {
    const entries = [];
    const today = new Date();
    
    for (let i = 0; i < 20; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
        const clockIn = new Date(date);
        clockIn.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
        
        const clockOut = new Date(clockIn);
        clockOut.setHours(clockIn.getHours() + 8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
        
        const breakTime = 30 + Math.floor(Math.random() * 30); // 30-60 minutes
        const workedMinutes = (clockOut - clockIn) / (1000 * 60) - breakTime;
        const workedHours = workedMinutes / 60;
        const earnings = workedHours * (user.hourlyRate || 25);
        
        entries.push({
          id: `mock-${i}`,
          date: date.toISOString().split('T')[0],
          clockIn: clockIn.toTimeString().slice(0, 5),
          clockOut: clockOut.toTimeString().slice(0, 5),
          breakTime: `${breakTime}m`,
          workedHours: `${Math.floor(workedHours)}h ${Math.floor((workedHours % 1) * 60)}m`,
          earnings: `${earnings.toFixed(2)}€`,
          status: 'completed'
        });
      }
    }
    
    return entries.reverse();
  };

  const mockEntries = generateMockTimeEntries();

  const calculateMonthlyStats = () => {
    const totalHours = mockEntries.reduce((acc, entry) => {
      const hours = parseFloat(entry.workedHours.split('h')[0]);
      const minutes = parseFloat(entry.workedHours.split('h')[1]?.split('m')[0] || 0);
      return acc + hours + (minutes / 60);
    }, 0);

    const totalEarnings = mockEntries.reduce((acc, entry) => {
      return acc + parseFloat(entry.earnings.replace('€', ''));
    }, 0);

    const avgHoursPerDay = totalHours / mockEntries.length;
    const daysWorked = mockEntries.length;

    return {
      totalHours: `${Math.floor(totalHours)}h ${Math.floor((totalHours % 1) * 60)}m`,
      totalEarnings: `${totalEarnings.toFixed(2)}€`,
      avgHoursPerDay: `${Math.floor(avgHoursPerDay)}h ${Math.floor((avgHoursPerDay % 1) * 60)}m`,
      daysWorked
    };
  };

  const stats = calculateMonthlyStats();

  const navigateMonth = (direction) => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setSelectedMonth(newMonth);
  };

  const exportData = () => {
    toast({
      title: "🚧 Cette fonctionnalité n'est pas encore implémentée",
      description: "Mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine requête ! 🚀"
    });
  };

  return (
    <>
      <Helmet>
        <title>Mes Horaires - TimeTrackPro</title>
        <meta name="description" content="Consultez vos horaires de travail, heures effectuées et gains mensuels" />
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
            <h1 className="text-3xl font-bold text-white">Mes Horaires</h1>
            <p className="text-gray-400 mt-1">
              Suivi de vos heures de travail et gains
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              onClick={exportData}
              variant="outline"
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button
              onClick={() => toast({
                title: "🚧 Cette fonctionnalité n'est pas encore implémentée",
                description: "Mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine requête ! 🚀"
              })}
              variant="outline"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
          </div>
        </motion.div>

        {/* Month Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass-effect border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth(-1)}
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {mockEntries.length} jours travaillés
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth(1)}
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-effect border-white/10 card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total heures</p>
                    <p className="text-2xl font-bold text-white">{stats.totalHours}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10 card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Gains totaux</p>
                    <p className="text-2xl font-bold text-white">{stats.totalEarnings}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10 card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Moyenne/jour</p>
                    <p className="text-2xl font-bold text-white">{stats.avgHoursPerDay}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10 card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Jours travaillés</p>
                    <p className="text-2xl font-bold text-white">{stats.daysWorked}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Time Entries Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Détail des horaires</CardTitle>
              <CardDescription className="text-gray-400">
                Historique complet de vos pointages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Arrivée</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Départ</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Pause</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Heures</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Gains</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockEntries.map((entry, index) => (
                      <motion.tr
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 px-4 text-white">
                          {new Date(entry.date).toLocaleDateString('fr-FR', { 
                            weekday: 'short', 
                            day: '2-digit', 
                            month: '2-digit' 
                          })}
                        </td>
                        <td className="py-3 px-4 text-white time-display">{entry.clockIn}</td>
                        <td className="py-3 px-4 text-white time-display">{entry.clockOut}</td>
                        <td className="py-3 px-4 text-gray-400">{entry.breakTime}</td>
                        <td className="py-3 px-4 text-white font-medium">{entry.workedHours}</td>
                        <td className="py-3 px-4 text-green-400 font-medium">{entry.earnings}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                            Terminé
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default TimeTracking;
