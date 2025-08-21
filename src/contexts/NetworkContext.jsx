
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const NetworkContext = createContext();

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

export const NetworkProvider = ({ children }) => {
  const [networkStatus, setNetworkStatus] = useState({
    isAllowed: true,
    location: 'Bureau Principal',
    ip: '192.168.1.100',
    isChecking: false
  });
  const [networkConfig, setNetworkConfig] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('network_config') || '{"enforce":false,"allowed":[]}');
    } catch {
      return { enforce: false, allowed: [] };
    }
  });
  const { user } = useAuth();
  const { toast } = useToast();

  // Simulate network checking
  const ipToInt = (ip) => ip.split('.').reduce((acc, part) => (acc << 8) + (parseInt(part, 10) || 0), 0) >>> 0;
  const inRange = (ip, range) => {
    const [start, end] = range.split('-').map(s => s.trim());
    if (!start || !end) return false;
    const x = ipToInt(ip);
    return x >= ipToInt(start) && x <= ipToInt(end);
  };

  const checkNetworkAccess = async () => {
    setNetworkStatus(prev => ({ ...prev, isChecking: true }));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock network validation logic (replace with real IP lookup via backend/service)
    const currentIP = '192.168.1.100';
    const enforce = !!networkConfig?.enforce;
    const allowedIPs = Array.isArray(networkConfig?.allowed) ? networkConfig.allowed : [];
    
    // Admin/SuperAdmin can access from anywhere
    const isPrivileged = user?.role === 'Admin' || user?.role === 'SuperAdmin';
    const isAllowed = isPrivileged || !enforce || allowedIPs.some(entry => entry.includes('-') ? inRange(currentIP, entry) : entry === currentIP);
    
    setNetworkStatus({
      isAllowed,
      location: isAllowed ? 'Bureau Principal' : 'Localisation non autorisée',
      ip: currentIP,
      isChecking: false
    });

    if (!isAllowed && !isPrivileged) {
      toast({
        title: "Accès réseau restreint",
        description: "Vous devez être connecté depuis le réseau de l'entreprise",
        variant: "destructive"
      });
    }

    return isAllowed;
  };

  useEffect(() => {
    if (user) {
      checkNetworkAccess();
    }
  }, [user, networkConfig]);

  const updateNetworkConfig = (next) => {
    const merged = { ...networkConfig, ...next };
    setNetworkConfig(merged);
    localStorage.setItem('network_config', JSON.stringify(merged));
  };

  const value = {
    networkStatus,
    checkNetworkAccess,
    networkConfig,
    updateNetworkConfig
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
};
