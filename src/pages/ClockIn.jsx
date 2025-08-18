
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { useNetwork } from '@/contexts/NetworkContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Clock,
  MapPin,
  Wifi,
  Timer,
  Coffee,
  CheckCircle,
  Play,
  Pause,
  Square
} from 'lucide-react';

const ClockIn = () => {
  const { user } = useAuth();
  const { networkStatus } = useNetwork();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockStatus, setClockStatus] = useState('out');
  const [sessionStart, setSessionStart] = useState(null);
  const [breakStart, setBreakStart] = useState(null);
  const [totalWorkedTime, setTotalWorkedTime] = useState(0);
  const [totalBreakTime, setTotalBreakTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Load saved state
    const savedStatus = localStorage.getItem('timetrack_clock_status');
    const savedSessionStart = localStorage.getItem('timetrack_session_start');
    const savedBreakStart = localStorage.getItem('timetrack_break_start');
    const savedWorkedTime = localStorage.getItem('timetrack_worked_time');
    const savedBreakTime = localStorage.getItem('timetrack_break_time');

    if (savedStatus) setClockStatus(savedStatus);
    if (savedSessionStart) setSessionStart(new Date(savedSessionStart));
    if (savedBreakStart) setBreakStart(new Date(savedBreakStart));
    if (savedWorkedTime) setTotalWorkedTime(parseInt(savedWorkedTime));
    if (savedBreakTime) setTotalBreakTime(parseInt(savedBreakTime));

    // Extension message bridge
    const onMessage = (event) => {
      if (!event?.data || event.data?.source !== 'timetrackpro-extension') return;
      const action = event.data?.action;
      if (action === 'clock_in' && clockStatus === 'out') handleClockIn();
      if (action === 'clock_out' && (clockStatus === 'in' || clockStatus === 'break')) handleClockOut();
      if (action === 'break_start' && clockStatus === 'in') handleBreakStart();
      if (action === 'break_end' && clockStatus === 'break') handleBreakEnd();
    };
    window.addEventListener('message', onMessage);

    // Simple reminder between 08:00 and 10:00 on weekdays if not clocked in
    const reminder = setInterval(() => {
      const now = new Date();
      const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
      const hour = now.getHours();
      if (isWeekday && hour >= 8 && hour <= 10 && localStorage.getItem('timetrack_clock_status') !== 'in') {
        toast({ title: 'Rappel de pointage', description: 'Veuillez pointer votre arrivée.', className: 'warning-gradient text-white' });
      }
    }, 30 * 60 * 1000);

    return () => {
      clearInterval(timer);
      window.removeEventListener('message', onMessage);
      clearInterval(reminder);
    };
  }, []);

  const saveClockEntry = (type, timestamp) => {
    const clockIns = JSON.parse(localStorage.getItem('timetrack_clockins') || '[]');
    clockIns.push({
      id: Date.now(),
      userId: user.id,
      type,
      timestamp: timestamp.toISOString(),
      location: networkStatus.location,
      ip: networkStatus.ip
    });
    localStorage.setItem('timetrack_clockins', JSON.stringify(clockIns));
  };

  const isPrivileged = user?.role === 'Admin' || user?.role === 'SuperAdmin';

  const handleClockIn = () => {
    if (!isPrivileged && !networkStatus?.isAllowed) {
      toast({ title: 'Réseau non autorisé', description: "Vous devez être sur le réseau de l'entreprise pour pointer.", variant: 'destructive' });
      return;
    }
    const now = new Date();
    setClockStatus('in');
    setSessionStart(now);
    setTotalWorkedTime(0);
    setTotalBreakTime(0);
    
    localStorage.setItem('timetrack_clock_status', 'in');
    localStorage.setItem('timetrack_session_start', now.toISOString());
    localStorage.setItem('timetrack_worked_time', '0');
    localStorage.setItem('timetrack_break_time', '0');
    
    saveClockEntry('clock_in', now);
    
    toast({
      title: "Arrivée enregistrée",
      description: `Bon travail ${user.name} ! Session commencée à ${now.toLocaleTimeString('fr-FR')}`,
      className: "success-gradient text-white"
    });
  };

  const handleClockOut = () => {
    if (!isPrivileged && !networkStatus?.isAllowed) {
      toast({ title: 'Réseau non autorisé', description: "Vous devez être sur le réseau de l'entreprise pour pointer.", variant: 'destructive' });
      return;
    }
    const now = new Date();
    
    // Calculate final worked time
    let finalWorkedTime = totalWorkedTime;
    if (sessionStart && clockStatus === 'in') {
      finalWorkedTime += Math.floor((now - sessionStart) / 1000);
    }
    
    setClockStatus('out');
    setSessionStart(null);
    setBreakStart(null);
    
    localStorage.setItem('timetrack_clock_status', 'out');
    localStorage.removeItem('timetrack_session_start');
    localStorage.removeItem('timetrack_break_start');
    localStorage.setItem('timetrack_worked_time', finalWorkedTime.toString());
    
    saveClockEntry('clock_out', now);
    
    const hours = Math.floor(finalWorkedTime / 3600);
    const minutes = Math.floor((finalWorkedTime % 3600) / 60);
    
    toast({
      title: "Départ enregistré",
      description: `Bonne soirée ${user.name} ! Temps travaillé: ${hours}h ${minutes}m`,
      className: "info-gradient text-white"
    });
  };

  const handleBreakStart = () => {
    if (!isPrivileged && !networkStatus?.isAllowed) {
      toast({ title: 'Réseau non autorisé', description: "Vous devez être sur le réseau de l'entreprise pour pointer.", variant: 'destructive' });
      return;
    }
    const now = new Date();
    
    // Save current work session
    if (sessionStart) {
      const workedSeconds = Math.floor((now - sessionStart) / 1000);
      setTotalWorkedTime(prev => prev + workedSeconds);
      localStorage.setItem('timetrack_worked_time', (totalWorkedTime + workedSeconds).toString());
    }
    
    setClockStatus('break');
    setBreakStart(now);
    setSessionStart(null);
    
    localStorage.setItem('timetrack_clock_status', 'break');
    localStorage.setItem('timetrack_break_start', now.toISOString());
    localStorage.removeItem('timetrack_session_start');
    
    saveClockEntry('break_start', now);
    
    toast({
      title: "Pause commencée",
      description: "Bonne pause ! N'oubliez pas de reprendre le travail.",
      className: "warning-gradient text-white"
    });
  };

  const handleBreakEnd = () => {
    if (!isPrivileged && !networkStatus?.isAllowed) {
      toast({ title: 'Réseau non autorisé', description: "Vous devez être sur le réseau de l'entreprise pour pointer.", variant: 'destructive' });
      return;
    }
    const now = new Date();
    
    // Save break time
    if (breakStart) {
      const breakSeconds = Math.floor((now - breakStart) / 1000);
      setTotalBreakTime(prev => prev + breakSeconds);
      localStorage.setItem('timetrack_break_time', (totalBreakTime + breakSeconds).toString());
    }
    
    setClockStatus('in');
    setSessionStart(now);
    setBreakStart(null);
    
    localStorage.setItem('timetrack_clock_status', 'in');
    localStorage.setItem('timetrack_session_start', now.toISOString());
    localStorage.removeItem('timetrack_break_start');
    
    saveClockEntry('break_end', now);
    
    toast({
      title: "Retour de pause",
      description: "Bon retour au travail !",
      className: "success-gradient text-white"
    });
  };

  const getCurrentSessionTime = () => {
    if (!sessionStart) return 0;
    return Math.floor((currentTime - sessionStart) / 1000);
  };

  const getCurrentBreakTime = () => {
    if (!breakStart) return 0;
    return Math.floor((currentTime - breakStart) / 1000);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalWorkedToday = () => {
    let total = totalWorkedTime;
    if (clockStatus === 'in' && sessionStart) {
      total += getCurrentSessionTime();
    }
    return total;
  };

  const getStatusColor = () => {
    switch (clockStatus) {
      case 'in': return 'text-green-400';
      case 'break': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (clockStatus) {
      case 'in': return 'Au travail';
      case 'break': return 'En pause';
      default: return 'Absent';
    }
  };

  return (
    <>
      <Helmet>
        <title>Pointage - TimeTrackPro</title>
        <meta name="description" content="Pointez vos heures d'arrivée et de départ en temps réel" />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Pointage</h1>
          <p className="text-gray-400">
            Enregistrez vos heures d'arrivée et de départ
          </p>
        </motion.div>

        {/* Current Time & Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass-effect border-white/10">
            <CardContent className="p-8 text-center">
              <div className="space-y-6">
                <div>
                  <p className="text-6xl font-bold time-display text-white mb-2">
                    {currentTime.toLocaleTimeString('fr-FR')}
                  </p>
                  <p className="text-xl text-gray-400">
                    {currentTime.toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
                    <div className={`w-3 h-3 rounded-full ${
                      clockStatus === 'in' ? 'bg-green-400 pulse-animation' :
                      clockStatus === 'break' ? 'bg-yellow-400 pulse-animation' :
                      'bg-gray-400'
                    }`} />
                    <span className="text-lg font-semibold">{getStatusText()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{networkStatus.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wifi className="w-4 h-4" />
                    <span>{networkStatus.ip}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-effect border-white/10">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {clockStatus === 'out' && (
                  <Button
                    onClick={handleClockIn}
                    className="h-20 text-lg font-semibold bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Play className="w-6 h-6 mr-3" />
                    Pointer l'arrivée
                  </Button>
                )}

                {clockStatus === 'in' && (
                  <>
                    <Button
                      onClick={handleBreakStart}
                      className="h-20 text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      <Pause className="w-6 h-6 mr-3" />
                      Commencer une pause
                    </Button>
                    <Button
                      onClick={handleClockOut}
                      className="h-20 text-lg font-semibold bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Square className="w-6 h-6 mr-3" />
                      Pointer la sortie
                    </Button>
                  </>
                )}

                {clockStatus === 'break' && (
                  <>
                    <Button
                      onClick={handleBreakEnd}
                      className="h-20 text-lg font-semibold bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Play className="w-6 h-6 mr-3" />
                      Reprendre le travail
                    </Button>
                    <Button
                      onClick={handleClockOut}
                      className="h-20 text-lg font-semibold bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Square className="w-6 h-6 mr-3" />
                      Pointer la sortie
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Session Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Temps travaillé aujourd'hui</p>
                    <p className="text-2xl font-bold text-white time-display">
                      {formatTime(getTotalWorkedToday())}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Session actuelle</p>
                    <p className="text-2xl font-bold text-white time-display">
                      {clockStatus === 'in' ? formatTime(getCurrentSessionTime()) : '--:--:--'}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Timer className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Temps de pause</p>
                    <p className="text-2xl font-bold text-white time-display">
                      {clockStatus === 'break' 
                        ? formatTime(totalBreakTime + getCurrentBreakTime())
                        : formatTime(totalBreakTime)
                      }
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Coffee className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Today's Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Activité d'aujourd'hui</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Chronologie de vos pointages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {JSON.parse(localStorage.getItem('timetrack_clockins') || '[]')
                  .filter(entry => {
                    const entryDate = new Date(entry.timestamp).toDateString();
                    const today = new Date().toDateString();
                    return entryDate === today && entry.userId === user.id;
                  })
                  .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                  .map((entry, index) => (
                    <div key={entry.id} className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        entry.type === 'clock_in' ? 'bg-green-400' :
                        entry.type === 'clock_out' ? 'bg-red-400' :
                        entry.type === 'break_start' ? 'bg-yellow-400' :
                        'bg-blue-400'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">
                            {entry.type === 'clock_in' ? 'Arrivée' :
                             entry.type === 'clock_out' ? 'Départ' :
                             entry.type === 'break_start' ? 'Début de pause' :
                             'Fin de pause'}
                          </span>
                          <span className="text-gray-400 text-sm time-display">
                            {new Date(entry.timestamp).toLocaleTimeString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm">{entry.location}</p>
                      </div>
                    </div>
                  ))}
                
                {JSON.parse(localStorage.getItem('timetrack_clockins') || '[]')
                  .filter(entry => {
                    const entryDate = new Date(entry.timestamp).toDateString();
                    const today = new Date().toDateString();
                    return entryDate === today && entry.userId === user.id;
                  }).length === 0 && (
                  <p className="text-gray-400 text-center py-8">
                    Aucune activité enregistrée aujourd'hui
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default ClockIn;
