
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

// Structure des utilisateurs avec équipes et rôles
const MOCK_USERS = {
  'superadmin': { 
    id: 1, 
    username: 'superadmin',
    name: 'Super Administrateur', 
    role: 'SuperAdmin', 
    password: 'superadmin123',
    email: 'superadmin@timetrack.pro',
    canManageUsers: true,
    canManageTeams: true,
    canViewAllTeams: true
  },
  'admin': { 
    id: 2, 
    username: 'admin',
    name: 'Administrateur', 
    role: 'Admin', 
    password: 'admin123',
    email: 'admin@timetrack.pro',
    canManageUsers: true,
    canManageTeams: true,
    canViewAllTeams: true
  },
  'manager1': { 
    id: 3, 
    username: 'manager1',
    name: 'Manager Équipe A', 
    role: 'Manager', 
    password: 'manager123',
    email: 'manager1@timetrack.pro',
    teamId: 'team-a',
    teamName: 'Équipe A',
    canManageUsers: false,
    canManageTeams: false,
    canViewAllTeams: false
  },
  'manager2': { 
    id: 4, 
    username: 'manager2',
    name: 'Manager Équipe B', 
    role: 'Manager', 
    password: 'manager123',
    email: 'manager2@timetrack.pro',
    teamId: 'team-b',
    teamName: 'Équipe B',
    canManageUsers: false,
    canManageTeams: false,
    canViewAllTeams: false
  },
  'employee1': { 
    id: 5, 
    username: 'employee1',
    name: 'Employé 1', 
    role: 'Employé', 
    password: 'employee123',
    email: 'employee1@timetrack.pro',
    teamId: 'team-a',
    teamName: 'Équipe A',
    managerId: 3,
    hourlyRate: 15,
    salaryType: 'hourly'
  },
  'employee2': { 
    id: 6, 
    username: 'employee2',
    name: 'Employé 2', 
    role: 'Employé', 
    password: 'employee123',
    email: 'employee2@timetrack.pro',
    teamId: 'team-a',
    teamName: 'Équipe A',
    managerId: 3,
    hourlyRate: 18,
    salaryType: 'hourly'
  },
  'employee3': { 
    id: 7, 
    username: 'employee3',
    name: 'Employé 3', 
    role: 'Employé', 
    password: 'employee123',
    email: 'employee3@timetrack.pro',
    teamId: 'team-b',
    teamName: 'Équipe B',
    managerId: 4,
    monthlySalary: 2500,
    salaryType: 'monthly'
  },
  'employee4': { 
    id: 8, 
    username: 'employee4',
    name: 'Employé 4', 
    role: 'Employé', 
    password: 'employee123',
    email: 'employee4@timetrack.pro',
    teamId: 'team-b',
    teamName: 'Équipe B',
    managerId: 4,
    commissionRate: 0.05,
    baseSalary: 2000,
    salaryType: 'commission'
  }
};

// Structure des équipes
const MOCK_TEAMS = {
  'team-a': {
    id: 'team-a',
    name: 'Équipe A',
    managerId: 3,
    managerName: 'Manager Équipe A',
    members: [5, 6]
  },
  'team-b': {
    id: 'team-b',
    name: 'Équipe B',
    managerId: 4,
    managerName: 'Manager Équipe B',
    members: [7, 8]
  }
};

const COMPANY_NETWORK_IPS = ['127.0.0.1', '::1'];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAllowedByIP, setIsAllowedByIP] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('timeTrackUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsAllowedByIP(true); 
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const foundUser = MOCK_USERS[username];
    if (foundUser && foundUser.password === password) {
      // Enforce optional network restriction from NetworkContext's config persisted in localStorage
      try {
        const cfg = JSON.parse(localStorage.getItem('network_config') || '{"enforce":false,"allowed":[]}');
        const enforce = !!cfg.enforce;
        // If enforcement is on and user is not privileged, block unless IP is allowed.
        if (enforce && foundUser.role !== 'SuperAdmin' && foundUser.role !== 'Admin') {
          const currentIP = '192.168.1.100'; // Replace with real IP retrieval in production
          const allowed = Array.isArray(cfg.allowed) ? cfg.allowed : [];
          const ipToInt = (ip) => ip.split('.').reduce((acc, part) => (acc << 8) + (parseInt(part, 10) || 0), 0) >>> 0;
          const inRange = (ip, range) => {
            const [start, end] = String(range).split('-').map(s => s.trim());
            if (!start || !end) return false;
            const x = ipToInt(ip);
            return x >= ipToInt(start) && x <= ipToInt(end);
          };
          const ok = allowed.some(entry => String(entry).includes('-') ? inRange(currentIP, entry) : String(entry).trim() === currentIP);
          if (!ok) {
            return { success: false, message: "Accès refusé: connexion hors du réseau autorisé." };
          }
        }
      } catch {}
      localStorage.setItem('timeTrackUser', JSON.stringify(foundUser));
      setUser(foundUser);
      return { success: true };
    }
    return { success: false, message: "Nom d'utilisateur ou mot de passe incorrect." };
  };

  const logout = () => {
    localStorage.removeItem('timeTrackUser');
    setUser(null);
  };

  // Création d'utilisateur (SuperAdmin uniquement)
  const createUser = (newUser) => {
    if (user?.role !== 'SuperAdmin') {
      return { success: false, message: "Seul le SuperAdmin peut créer des utilisateurs." };
    }

    const { username, name, role, password, email, department } = newUser || {};
    if (!username || !name || !role || !password) {
      return { success: false, message: "Champs requis manquants." };
    }
    if (MOCK_USERS[username]) {
      return { success: false, message: "Ce nom d'utilisateur existe déjà." };
    }

    const nextId = Math.max(...Object.values(MOCK_USERS).map(u => u.id)) + 1;
    MOCK_USERS[username] = {
      id: nextId,
      username,
      name,
      role,
      password,
      email: email || `${username}@example.com`,
      ...(department ? { department } : {}),
      ...(role === 'Employé' ? { hourlyRate: 10, salaryType: 'hourly' } : {})
    };

    return { success: true, message: "Utilisateur créé avec succès.", user: MOCK_USERS[username] };
  };

  // Fonction pour obtenir les membres de l'équipe d'un manager
  const getTeamMembers = (managerId) => {
    return Object.values(MOCK_USERS).filter(user => 
      user.role === 'Employé' && user.managerId === managerId
    );
  };

  // Fonction pour obtenir tous les employés (pour Admin/SuperAdmin)
  const getAllEmployees = () => {
    return Object.values(MOCK_USERS).filter(user => user.role === 'Employé');
  };

  // Fonction pour obtenir les équipes
  const getTeams = () => {
    return Object.values(MOCK_TEAMS);
  };

  // Fonction pour changer le mot de passe (SuperAdmin seulement)
  const changePassword = (username, newPassword) => {
    if (user?.role !== 'SuperAdmin') {
      return { success: false, message: "Seul le SuperAdmin peut changer les mots de passe." };
    }
    
    if (MOCK_USERS[username]) {
      MOCK_USERS[username].password = newPassword;
      return { success: true, message: "Mot de passe modifié avec succès." };
    }
    
    return { success: false, message: "Utilisateur non trouvé." };
  };

  const value = { 
    user, 
    loading, 
    login, 
    logout, 
    isAllowedByIP,
    getTeamMembers,
    getAllEmployees,
    getTeams,
    changePassword,
    createUser,
    MOCK_USERS,
    MOCK_TEAMS
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
