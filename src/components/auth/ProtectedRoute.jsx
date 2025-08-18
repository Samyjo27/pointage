
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNetwork } from '@/contexts/NetworkContext';
import { useToast } from '@/components/ui/use-toast';

const ProtectedRoute = ({ element: Component, role, ...rest }) => {
  const { user, loading } = useAuth();
  const { networkStatus } = useNetwork();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    // Restrict non-admin roles by network policy
    if (!networkStatus?.isAllowed && user.role !== 'Admin' && user.role !== 'SuperAdmin') {
      toast({
        variant: "destructive",
        title: "Accès non autorisé",
        description: "Vous devez être sur le réseau de l'entreprise pour accéder à cette page.",
      });
      navigate('/login');
      return;
    }

    // Role gating: Admin/SuperAdmin can access everything
    if (role && user.role !== role && user.role !== 'Admin' && user.role !== 'SuperAdmin') {
       if (!(role === 'RH' && user.role === 'Admin')) {
            toast({
                variant: "destructive",
                title: "Accès restreint",
                description: "Vous n'avez pas les permissions nécessaires pour voir cette page.",
            });
            navigate('/');
       }
    }
  }, [user, loading, navigate, toast, role, networkStatus]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
