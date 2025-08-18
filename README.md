# TimeTrackPro - Interface Style Netflix avec Gestion Avancée

## 🎯 Vue d'ensemble

TimeTrackPro est une application de gestion du temps de travail avec une interface moderne inspirée de Netflix, incluant un système de rôles avancé, une gestion d'équipes, et des dispositifs de calcul de salaires multiples.

## ✨ Nouvelles Fonctionnalités

### 🎨 Interface Style Netflix
- **Design moderne** avec animations fluides et transitions élégantes
- **Mode nuit/jour** avec basculement automatique
- **Interface responsive** adaptée à tous les écrans
- **Animations Netflix-style** avec Framer Motion

### 👥 Système de Rôles Avancé
- **SuperAdmin** : Accès complet, gestion des mots de passe
- **Admin** : Gestion des employés, salaires, rapports
- **Manager** : Gestion de son équipe uniquement
- **Employé** : Accès limité à ses propres données

### 🏢 Gestion d'Équipes
- **Managers** voient uniquement leurs équipes
- **Admin/SuperAdmin** voient toutes les équipes
- **Statistiques en temps réel** par équipe
- **Filtres avancés** par statut (présent, absent, en retard)

### 💰 Dispositifs de Calcul de Salaires
- **Salaire horaire** : Calcul avec heures supplémentaires
- **Salaire mensuel** : Salaire fixe avec prorata
- **Salaire à la commission** : Base + commission sur ventes
- **Salaire au rendement** : Base + bonus selon performance
- **Salaire au forfait** : Montant fixe indépendant du temps
- **Salaire mixte** : Base + commission + bonus

### 🔐 Authentification Sécurisée
- **Noms d'utilisateur** au lieu d'emails
- **Mots de passe par défaut** configurables
- **Gestion des mots de passe** par SuperAdmin uniquement
- **Contrôle d'accès** basé sur les rôles

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [url-du-repo]
cd timetrackpro

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

### Accès à l'application
Ouvrez votre navigateur sur `http://localhost:5173`

## 👤 Comptes de Démonstration

### SuperAdmin
- **Nom d'utilisateur** : `superadmin`
- **Mot de passe** : `superadmin123`
- **Accès** : Toutes les fonctionnalités

### Admin
- **Nom d'utilisateur** : `admin`
- **Mot de passe** : `admin123`
- **Accès** : Gestion complète (sauf mots de passe)

### Managers
- **Manager 1** : `manager1` / `manager123` (Équipe A)
- **Manager 2** : `manager2` / `manager123` (Équipe B)
- **Accès** : Gestion de leur équipe uniquement

### Employés
- **Employé 1** : `employee1` / `employee123` (Salaire horaire)
- **Employé 2** : `employee2` / `employee123` (Salaire horaire)
- **Employé 3** : `employee3` / `employee123` (Salaire mensuel)
- **Employé 4** : `employee4` / `employee123` (Salaire commission)

## 📊 Fonctionnalités par Rôle

### SuperAdmin
- ✅ Gestion complète des utilisateurs
- ✅ Modification des mots de passe
- ✅ Accès à tous les rapports
- ✅ Configuration système
- ✅ Gestion des équipes

### Admin
- ✅ Gestion des employés
- ✅ Calcul des salaires
- ✅ Rapports et exports
- ✅ Gestion des départements
- ❌ Modification des mots de passe

### Manager
- ✅ Vue de son équipe uniquement
- ✅ Suivi des présences
- ✅ Gestion des demandes d'absence
- ✅ Rapports d'équipe
- ❌ Accès aux autres équipes

### Employé
- ✅ Pointage personnel
- ✅ Consultation de ses horaires
- ✅ Demandes d'absence
- ✅ Paramètres personnels
- ❌ Accès aux données d'autres employés

## 💡 Dispositifs de Calcul de Salaires

### 1. Salaire Horaire
```
Salaire = (Heures régulières × Taux horaire) + (Heures supplémentaires × Taux × 1.5)
```

### 2. Salaire Mensuel
```
Salaire = (Jours travaillés / 22) × Salaire mensuel
```

### 3. Salaire à la Commission
```
Salaire = Salaire de base + (Montant des ventes × Taux de commission)
```

### 4. Salaire au Rendement
```
Salaire = Salaire de base + (Salaire de base × Taux de performance)
```

### 5. Salaire au Forfait
```
Salaire = (Jours travaillés / 22) × Montant forfaitaire
```

### 6. Salaire Mixte
```
Salaire = Salaire de base + Commission + Bonus
```

## 🎨 Thèmes et Personnalisation

### Mode Sombre
- Interface sombre avec accents violets
- Réduction de la fatigue oculaire
- Ambiance professionnelle

### Mode Clair
- Interface claire et moderne
- Excellente lisibilité
- Design épuré

### Basculement Automatique
- Sauvegarde automatique de la préférence
- Transitions fluides entre les modes
- Persistance dans le navigateur

## 🔧 Technologies Utilisées

- **Frontend** : React 18 + Vite
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **Icons** : Lucide React
- **Routing** : React Router DOM
- **State Management** : React Context API

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte à :
- **Desktop** : Interface complète avec sidebar
- **Tablet** : Interface adaptée avec navigation optimisée
- **Mobile** : Interface mobile-first avec navigation tactile

## 🔒 Sécurité

- **Authentification** par nom d'utilisateur/mot de passe
- **Contrôle d'accès** basé sur les rôles
- **Validation** des données côté client
- **Protection** des routes sensibles

## 🚧 Fonctionnalités Futures

- [ ] Synchronisation en temps réel
- [ ] Notifications push
- [ ] Export PDF des rapports
- [ ] API REST complète
- [ ] Application mobile
- [ ] Intégration calendrier
- [ ] Système de badges et récompenses

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Contactez l'équipe de développement
- Consultez la documentation technique

---

**TimeTrackPro** - Gestion moderne du temps de travail avec style Netflix 🎬

