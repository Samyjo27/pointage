
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
  const { user } = useAuth();
  const { toast } = useToast();

  // Simulate network checking
  const checkNetworkAccess = async () => {
    setNetworkStatus(prev => ({ ...prev, isChecking: true }));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock network validation logic
    const allowedIPs = ['192.168.1.100', '192.168.1.101', '10.0.0.50'];
    const currentIP = '192.168.1.100'; // TODO: Replace with real IP lookup via backend/service
    
    // Admin/SuperAdmin can access from anywhere
    const isPrivileged = user?.role === 'Admin' || user?.role === 'SuperAdmin';
    const isAllowed = isPrivileged || allowedIPs.includes(currentIP);
    
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
  }, [user]);

  const value = {
    networkStatus,
    checkNetworkAccess
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
};
