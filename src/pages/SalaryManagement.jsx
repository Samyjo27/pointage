import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SalaryCalculator } from '@/lib/salaryCalculator';
import { 
  DollarSign, 
  Calculator, 
  TrendingUp, 
  Users, 
  Clock, 
  Calendar,
  Plus,
  Edit,
  Eye,
  Download,
  Filter,
  Settings
} from 'lucide-react';

const SalaryManagement = () => {
  const { user, getAllEmployees } = useAuth();
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [salaryType, setSalaryType] = useState('hourly');
  const [calculationParams, setCalculationParams] = useState({
    hoursWorked: 0,
    daysWorked: 0,
    salesAmount: 0,
    performanceRate: 0
  });
  const [calculatedSalary, setCalculatedSalary] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user && (user.role === 'SuperAdmin' || user.role === 'Admin')) {
      const allEmployees = getAllEmployees();
      setEmployees(allEmployees);
    }
  }, [user, getAllEmployees]);

  const handleCalculateSalary = () => {
    if (!selectedEmployee) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un employé.",
      });
      return;
    }

    try {
      const result = SalaryCalculator.calculateCompleteSalary(
        selectedEmployee,
        calculationParams.hoursWorked,
        calculationParams.daysWorked,
        calculationParams.salesAmount,
        calculationParams.performanceRate
      );
      setCalculatedSalary(result);
      
      toast({
        title: "Calcul effectué",
        description: "Le salaire a été calculé avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de calcul",
        description: error.message,
      });
    }
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setSalaryType(employee.salaryType);
    setCalculatedSalary(null);
  };

  const filteredEmployees = employees.filter(emp => {
    if (filter === 'all') return true;
    return emp.salaryType === filter;
  });

  const salaryTypes = SalaryCalculator.getSalaryTypes();

  const getSalaryTypeLabel = (type) => {
    const salaryType = salaryTypes.find(st => st.value === type);
    return salaryType ? salaryType.label : type;
  };

  const getSalaryTypeDescription = (type) => {
    const salaryType = salaryTypes.find(st => st.value === type);
    return salaryType ? salaryType.description : '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Gestion des salaires
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Calculez et gérez les salaires avec différents dispositifs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Employés
              </h2>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="hourly">Horaire</SelectItem>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                  <SelectItem value="commission">Commission</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="fixed">Forfait</SelectItem>
                  <SelectItem value="mixed">Mixte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredEmployees.map((employee) => (
                <motion.div
                  key={employee.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleEmployeeSelect(employee)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedEmployee?.id === employee.id
                      ? `${isDarkMode ? 'bg-purple-600/30 border-purple-500/50' : 'bg-purple-100 border-purple-300'} border`
                      : `${isDarkMode ? 'bg-gray-700/50 hover:bg-gray-700/70' : 'bg-gray-50 hover:bg-gray-100'} border border-transparent`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {employee.name}
                      </h3>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {getSalaryTypeLabel(employee.salaryType)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Employee Details */}
          {selectedEmployee && (
            <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Détails de l'employé
                </h2>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Nom complet
                  </Label>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedEmployee.name}
                  </p>
                </div>

                <div>
                  <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Type de salaire
                  </Label>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {getSalaryTypeLabel(selectedEmployee.salaryType)}
                  </p>
                </div>

                {selectedEmployee.hourlyRate && (
                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Taux horaire
                    </Label>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedEmployee.hourlyRate}€/h
                    </p>
                  </div>
                )}

                {selectedEmployee.monthlySalary && (
                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Salaire mensuel
                    </Label>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedEmployee.monthlySalary}€
                    </p>
                  </div>
                )}

                {selectedEmployee.baseSalary && (
                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Salaire de base
                    </Label>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedEmployee.baseSalary}€
                    </p>
                  </div>
                )}

                {selectedEmployee.commissionRate && (
                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Taux de commission
                    </Label>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {(selectedEmployee.commissionRate * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  <strong>Description:</strong> {getSalaryTypeDescription(selectedEmployee.salaryType)}
                </p>
              </div>
            </Card>
          )}

          {/* Calculator Form */}
          {selectedEmployee && (
            <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Calculateur de salaire
                </h2>
                <Calculator className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {selectedEmployee.salaryType === 'hourly' && (
                  <div>
                    <Label htmlFor="hoursWorked" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Heures travaillées
                    </Label>
                    <Input
                      id="hoursWorked"
                      type="number"
                      value={calculationParams.hoursWorked}
                      onChange={(e) => setCalculationParams({
                        ...calculationParams,
                        hoursWorked: parseFloat(e.target.value) || 0
                      })}
                      placeholder="40"
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                    />
                  </div>
                )}

                {(selectedEmployee.salaryType === 'monthly' || selectedEmployee.salaryType === 'fixed') && (
                  <div>
                    <Label htmlFor="daysWorked" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Jours travaillés
                    </Label>
                    <Input
                      id="daysWorked"
                      type="number"
                      value={calculationParams.daysWorked}
                      onChange={(e) => setCalculationParams({
                        ...calculationParams,
                        daysWorked: parseFloat(e.target.value) || 0
                      })}
                      placeholder="22"
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                    />
                  </div>
                )}

                {(selectedEmployee.salaryType === 'commission' || selectedEmployee.salaryType === 'mixed') && (
                  <div>
                    <Label htmlFor="salesAmount" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Montant des ventes (€)
                    </Label>
                    <Input
                      id="salesAmount"
                      type="number"
                      value={calculationParams.salesAmount}
                      onChange={(e) => setCalculationParams({
                        ...calculationParams,
                        salesAmount: parseFloat(e.target.value) || 0
                      })}
                      placeholder="10000"
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                    />
                  </div>
                )}

                {selectedEmployee.salaryType === 'performance' && (
                  <div>
                    <Label htmlFor="performanceRate" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Taux de performance (0-1)
                    </Label>
                    <Input
                      id="performanceRate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={calculationParams.performanceRate}
                      onChange={(e) => setCalculationParams({
                        ...calculationParams,
                        performanceRate: parseFloat(e.target.value) || 0
                      })}
                      placeholder="0.8"
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                    />
                  </div>
                )}
              </div>

              <Button 
                onClick={handleCalculateSalary}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculer le salaire
              </Button>
            </Card>
          )}

          {/* Results */}
          {calculatedSalary && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`p-6 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Résultats du calcul
                  </h2>
                  <DollarSign className={`h-6 w-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Salaire brut
                    </p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {calculatedSalary.summary.grossSalary.toFixed(2)}€
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Salaire net
                    </p>
                    <p className={`text-2xl font-bold text-green-600`}>
                      {calculatedSalary.summary.netSalary.toFixed(2)}€
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Coût total
                    </p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {calculatedSalary.summary.totalCost.toFixed(2)}€
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                    Détails du calcul
                  </h3>
                  <div className="space-y-1 text-sm">
                    {calculatedSalary.salaryCalculation.regularPay && (
                      <p className={isDarkMode ? 'text-green-300' : 'text-green-700'}>
                        Salaire régulier: {calculatedSalary.salaryCalculation.regularPay.toFixed(2)}€
                      </p>
                    )}
                    {calculatedSalary.salaryCalculation.overtimePay && (
                      <p className={isDarkMode ? 'text-green-300' : 'text-green-700'}>
                        Heures supplémentaires: {calculatedSalary.salaryCalculation.overtimePay.toFixed(2)}€
                      </p>
                    )}
                    {calculatedSalary.salaryCalculation.commission && (
                      <p className={isDarkMode ? 'text-green-300' : 'text-green-700'}>
                        Commission: {calculatedSalary.salaryCalculation.commission.toFixed(2)}€
                      </p>
                    )}
                    {calculatedSalary.salaryCalculation.performanceBonus && (
                      <p className={isDarkMode ? 'text-green-300' : 'text-green-700'}>
                        Bonus performance: {calculatedSalary.salaryCalculation.performanceBonus.toFixed(2)}€
                      </p>
                    )}
                    <p className={isDarkMode ? 'text-green-300' : 'text-green-700'}>
                      Charges salariales: {calculatedSalary.socialCharges.employeeCharges.toFixed(2)}€
                    </p>
                    <p className={isDarkMode ? 'text-green-300' : 'text-green-700'}>
                      Charges patronales: {calculatedSalary.socialCharges.employerCharges.toFixed(2)}€
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SalaryManagement;

