import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FolderTree, UploadCloud, Send, Users, Shield, User } from 'lucide-react';

// Simple in-memory transfer store persisted in localStorage
const loadTransfers = () => {
  try { return JSON.parse(localStorage.getItem('tt_transfers') || '[]'); } catch { return []; }
};
const saveTransfers = (list) => localStorage.setItem('tt_transfers', JSON.stringify(list));

const roleHierarchyOrder = ['Employé', 'Manager', 'Admin', 'SuperAdmin'];

const Transfers = () => {
  const { isDarkMode } = useTheme();
  const { user, MOCK_USERS } = useAuth();
  const { toast } = useToast();
  const [transfers, setTransfers] = useState(loadTransfers());
  const [fileMeta, setFileMeta] = useState({ name: '', size: 0, type: '' });
  const [fileDataUrl, setFileDataUrl] = useState('');
  const [targetRole, setTargetRole] = useState('Manager');
  const [targetUserId, setTargetUserId] = useState('');

  const recipientsByRole = useMemo(() => {
    return Object.values(MOCK_USERS).filter(u => u.role === targetRole);
  }, [MOCK_USERS, targetRole]);

  const canSendToRole = (fromRole, toRole) => {
    const fromIdx = roleHierarchyOrder.indexOf(fromRole);
    const toIdx = roleHierarchyOrder.indexOf(toRole);
    return fromIdx >= 0 && toIdx >= 0 && fromIdx >= toIdx; // allow upwards or same-level send? We want hierarchical both ways: only upwards to higher roles or same team; here: allow to lower or equal (hierarchical dissemination)
  };

  const onPickFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        setFileDataUrl(String(reader.result));
        setFileMeta({ name: file.name, size: file.size, type: file.type });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const onSend = () => {
    if (!fileDataUrl) {
      toast({ variant: 'destructive', title: 'Fichier requis', description: 'Veuillez choisir un fichier.' });
      return;
    }
    const targetUser = recipientsByRole.find(u => String(u.id) === String(targetUserId));
    if (!targetUser) {
      toast({ variant: 'destructive', title: 'Destinataire requis', description: 'Sélectionnez un destinataire.' });
      return;
    }

    if (!canSendToRole(user.role, targetUser.role)) {
      toast({ variant: 'destructive', title: 'Non autorisé', description: "Transfert non autorisé selon la hiérarchie." });
      return;
    }

    const entry = {
      id: Date.now(),
      from: { id: user.id, name: user.name, role: user.role },
      to: { id: targetUser.id, name: targetUser.name, role: targetUser.role },
      file: fileMeta,
      dataUrl: fileDataUrl,
      createdAt: new Date().toISOString(),
      status: 'sent'
    };
    const next = [entry, ...transfers];
    setTransfers(next);
    saveTransfers(next);
    toast({ title: 'Transfert envoyé', description: `${fileMeta.name} → ${targetUser.name}` });
    setFileDataUrl('');
    setFileMeta({ name: '', size: 0, type: '' });
  };

  const userInbox = useMemo(() => transfers.filter(t => t.to.id === user.id), [transfers, user.id]);
  const userOutbox = useMemo(() => transfers.filter(t => t.from.id === user.id), [transfers, user.id]);

  const download = (t) => {
    try {
      const a = document.createElement('a');
      a.href = t.dataUrl;
      a.download = t.file.name || 'fichier';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast({ title: 'Téléchargé', description: t.file.name });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de télécharger.' });
    }
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Transferts - TimeTrackPro</title>
        <meta name="description" content="Transférez des fichiers selon la hiérarchie et recevez des notifications." />
      </Helmet>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Transferts</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Partage hiérarchique de fichiers</p>
        </div>
        <FolderTree className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'} h-8 w-8`} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3 mb-4">
            <UploadCloud className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} h-6 w-6`} />
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Envoyer un fichier</h2>
          </div>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={onPickFile} variant="outline" className="flex-1">
                Choisir un fichier
              </Button>
              <div className={`flex-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {fileMeta.name ? `${fileMeta.name} (${Math.round(fileMeta.size/1024)} Ko)` : 'Aucun fichier sélectionné'}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Rôle destinataire</label>
                <Select value={targetRole} onValueChange={setTargetRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleHierarchyOrder.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Utilisateur</label>
                <Select value={String(targetUserId)} onValueChange={setTargetUserId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {recipientsByRole.map(u => (
                      <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={onSend} className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Envoyer
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              <User className="h-5 w-5" />
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Reçus</h3>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {userInbox.map(t => (
                <div key={t.id} className={`p-3 rounded border ${isDarkMode ? 'border-gray-700/50 bg-gray-800/30' : 'border-gray-200 bg-gray-50'} flex items-center justify-between`}>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{t.file.name}</div>
                    <div className="text-xs opacity-70 truncate">De: {t.from.name} ({t.from.role})</div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => download(t)}>Télécharger</Button>
                </div>
              ))}
              {userInbox.length === 0 && (
                <div className="text-sm opacity-70">Aucun fichier reçu</div>
              )}
            </div>
          </Card>

          <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5" />
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Envoyés</h3>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {userOutbox.map(t => (
                <div key={t.id} className={`p-3 rounded border ${isDarkMode ? 'border-gray-700/50 bg-gray-800/30' : 'border-gray-200 bg-gray-50'} flex items-center justify-between`}>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{t.file.name}</div>
                    <div className="text-xs opacity-70 truncate">À: {t.to.name} ({t.to.role})</div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => download(t)}>Télécharger</Button>
                </div>
              ))}
              {userOutbox.length === 0 && (
                <div className="text-sm opacity-70">Aucun fichier envoyé</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Transfers;


