
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  Calendar,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Upload
} from 'lucide-react';

const AbsenceRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
    document: null
  });

  useEffect(() => {
    // Load absence requests from localStorage
    const savedRequests = JSON.parse(localStorage.getItem('timetrack_absences') || '[]');
    const userRequests = savedRequests.filter(req => req.userId === user.id);
    setRequests(userRequests);
  }, [user.id]);

  const absenceTypes = [
    { value: 'vacation', label: 'Congés payés' },
    { value: 'sick', label: 'Arrêt maladie' },
    { value: 'personal', label: 'Congé personnel' },
    { value: 'family', label: 'Congé familial' },
    { value: 'training', label: 'Formation' },
    { value: 'other', label: 'Autre' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.type || !formData.startDate || !formData.endDate || !formData.reason) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const newRequest = {
      id: Date.now(),
      userId: user.id,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      document: formData.document ? formData.document : null
    };

    const allRequests = JSON.parse(localStorage.getItem('timetrack_absences') || '[]');
    allRequests.push(newRequest);
    localStorage.setItem('timetrack_absences', JSON.stringify(allRequests));

    setRequests(prev => [...prev, newRequest]);
    setFormData({
      type: '',
      startDate: '',
      endDate: '',
      reason: '',
      document: null
    });
    setShowForm(false);

    toast({
      title: "Demande envoyée",
      description: "Votre demande d'absence a été soumise avec succès",
      className: "success-gradient text-white"
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Approuvée';
      case 'rejected': return 'Refusée';
      default: return 'En attente';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const getTypeLabel = (type) => {
    const typeObj = absenceTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Mock some approved/rejected requests for demo
  const mockRequests = [
    {
      id: 'mock-1',
      type: 'vacation',
      startDate: '2025-01-15',
      endDate: '2025-01-19',
      reason: 'Vacances en famille',
      status: 'approved',
      submittedAt: '2025-01-01T10:00:00Z'
    },
    {
      id: 'mock-2',
      type: 'sick',
      startDate: '2025-01-08',
      endDate: '2025-01-08',
      reason: 'Consultation médicale',
      status: 'approved',
      submittedAt: '2025-01-07T14:30:00Z'
    }
  ];

  const allRequests = [...requests, ...mockRequests].sort((a, b) => 
    new Date(b.submittedAt) - new Date(a.submittedAt)
  );

  return (
    <>
      <Helmet>
        <title>Demandes d'Absence - TimeTrackPro</title>
        <meta name="description" content="Gérez vos demandes de congés et absences" />
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
            <h1 className="text-3xl font-bold text-white">Demandes d'Absence</h1>
            <p className="text-gray-400 mt-1">
              Gérez vos congés et absences
            </p>
          </div>

          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle demande
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
                    <p className="text-gray-400 text-sm">Congés restants</p>
                    <p className="text-2xl font-bold text-white">23 jours</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">En attente</p>
                    <p className="text-2xl font-bold text-white">
                      {allRequests.filter(r => r.status === 'pending').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Approuvées</p>
                    <p className="text-2xl font-bold text-white">
                      {allRequests.filter(r => r.status === 'approved').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Refusées</p>
                    <p className="text-2xl font-bold text-white">
                      {allRequests.filter(r => r.status === 'rejected').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Request Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Nouvelle demande d'absence</CardTitle>
                <CardDescription className="text-gray-400">
                  Remplissez le formulaire pour soumettre votre demande
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-white">Type d'absence *</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                        <SelectContent>
                          {absenceTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Durée</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="startDate" className="text-gray-400 text-sm">Date de début *</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                            className="bg-white/5 border-white/20 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate" className="text-gray-400 text-sm">Date de fin *</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                            className="bg-white/5 border-white/20 text-white"
                            required
                          />
                        </div>
                      </div>
                      {formData.startDate && formData.endDate && (
                        <p className="text-sm text-gray-400">
                          Durée: {calculateDays(formData.startDate, formData.endDate)} jour(s)
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason" className="text-white">Motif *</Label>
                    <Textarea
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Décrivez le motif de votredemande..."
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="document" className="text-white">Justificatif (optionnel)</Label>
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center px-3 py-2 border rounded-md cursor-pointer border-white/20 text-gray-400 hover:bg-white/5">
                        <Upload className="w-4 h-4 mr-2" />
                        <span>Sélectionner un fichier</span>
                        <input
                          id="document"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (!file) return;
                            if (file.size > 5 * 1024 * 1024) {
                              toast({ variant: 'destructive', title: 'Fichier trop volumineux', description: 'Max 5MB' });
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                              setFormData(prev => ({ ...prev, document: reader.result }));
                              toast({ title: 'Fichier ajouté', description: file.name });
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                      <span className="text-sm text-gray-400">
                        PDF, JPG, PNG (max 5MB)
                      </span>
                    </div>
                    {formData.document && (
                      <p className="text-xs text-green-400">Justificatif prêt à être envoyé.</p>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    >
                      Soumettre la demande
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="border-white/20 text-gray-400 hover:bg-white/5"
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Requests List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Historique des demandes</CardTitle>
              <CardDescription className="text-gray-400">
                Toutes vos demandes d'absence
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allRequests.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Aucune demande d'absence</p>
                  <p className="text-gray-500 text-sm">Créez votre première demande</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="glass-effect rounded-lg p-6 border border-white/10"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              {getTypeLabel(request.type)}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                              {getStatusIcon(request.status)}
                              <span className="ml-1">{getStatusText(request.status)}</span>
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Période</p>
                              <p className="text-white">
                                {new Date(request.startDate).toLocaleDateString('fr-FR')} - {new Date(request.endDate).toLocaleDateString('fr-FR')}
                              </p>
                              <p className="text-gray-500">
                                {calculateDays(request.startDate, request.endDate)} jour(s)
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-gray-400">Soumise le</p>
                              <p className="text-white">
                                {new Date(request.submittedAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-gray-400">Motif</p>
                              <p className="text-white">{request.reason}</p>
                            </div>
                            {request.document && (
                              <div className="md:col-span-3">
                                <p className="text-gray-400">Justificatif</p>
                                <a
                                  href={request.document}
                                  download={`justificatif-${request.id}`}
                                  className="text-blue-400 underline"
                                >
                                  Télécharger le justificatif
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {request.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                              onClick={() => {
                                const all = JSON.parse(localStorage.getItem('timetrack_absences') || '[]');
                                const next = all.filter(r => r.id !== request.id);
                                localStorage.setItem('timetrack_absences', JSON.stringify(next));
                                setRequests(prev => prev.filter(r => r.id !== request.id));
                                toast({ title: 'Demande annulée', description: 'Votre demande a été retirée.' });
                              }}
                            >
                              Annuler
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default AbsenceRequests;
