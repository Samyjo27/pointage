// Service de calcul des salaires avec différents dispositifs

export class SalaryCalculator {
  // Calcul salaire horaire
  static calculateHourlySalary(hourlyRate, hoursWorked, overtimeRate = 1.5) {
    const regularHours = Math.min(hoursWorked, 40);
    const overtimeHours = Math.max(0, hoursWorked - 40);
    
    const regularPay = regularHours * hourlyRate;
    const overtimePay = overtimeHours * hourlyRate * overtimeRate;
    
    return {
      regularPay,
      overtimePay,
      totalPay: regularPay + overtimePay,
      hoursWorked,
      regularHours,
      overtimeHours
    };
  }

  // Calcul salaire mensuel fixe
  static calculateMonthlySalary(monthlySalary, daysWorked, totalDaysInMonth = 22) {
    const dailyRate = monthlySalary / totalDaysInMonth;
    const actualPay = (daysWorked / totalDaysInMonth) * monthlySalary;
    
    return {
      dailyRate,
      actualPay,
      daysWorked,
      totalDaysInMonth
    };
  }

  // Calcul salaire à la commission
  static calculateCommissionSalary(baseSalary, commissionRate, salesAmount) {
    const commission = salesAmount * commissionRate;
    const totalPay = baseSalary + commission;
    
    return {
      baseSalary,
      commission,
      totalPay,
      salesAmount,
      commissionRate
    };
  }

  // Calcul salaire au rendement
  static calculatePerformanceSalary(baseSalary, performanceRate, targets) {
    const performanceBonus = baseSalary * performanceRate;
    const totalPay = baseSalary + performanceBonus;
    
    return {
      baseSalary,
      performanceBonus,
      totalPay,
      performanceRate,
      targets
    };
  }

  // Calcul salaire au forfait
  static calculateFixedSalary(fixedAmount, daysWorked, totalDaysInMonth = 22) {
    const dailyRate = fixedAmount / totalDaysInMonth;
    const actualPay = (daysWorked / totalDaysInMonth) * fixedAmount;
    
    return {
      dailyRate,
      actualPay,
      daysWorked,
      totalDaysInMonth,
      fixedAmount
    };
  }

  // Calcul salaire mixte (base + commission)
  static calculateMixedSalary(baseSalary, commissionRate, salesAmount, bonusRate = 0) {
    const commission = salesAmount * commissionRate;
    const bonus = baseSalary * bonusRate;
    const totalPay = baseSalary + commission + bonus;
    
    return {
      baseSalary,
      commission,
      bonus,
      totalPay,
      salesAmount,
      commissionRate,
      bonusRate
    };
  }

  // Calcul des charges sociales (exemple français)
  static calculateSocialCharges(grossSalary, employeeRate = 0.23, employerRate = 0.45) {
    const employeeCharges = grossSalary * employeeRate;
    const employerCharges = grossSalary * employerRate;
    const netSalary = grossSalary - employeeCharges;
    const totalCost = grossSalary + employerCharges;
    
    return {
      grossSalary,
      employeeCharges,
      employerCharges,
      netSalary,
      totalCost,
      employeeRate,
      employerRate
    };
  }

  // Calcul complet du salaire selon le type
  static calculateCompleteSalary(employee, hoursWorked = 0, daysWorked = 0, salesAmount = 0, performanceRate = 0) {
    const { salaryType } = employee;
    
    let salaryCalculation = {};
    
    switch (salaryType) {
      case 'hourly':
        salaryCalculation = this.calculateHourlySalary(employee.hourlyRate, hoursWorked);
        break;
      case 'monthly':
        salaryCalculation = this.calculateMonthlySalary(employee.monthlySalary, daysWorked);
        break;
      case 'commission':
        salaryCalculation = this.calculateCommissionSalary(employee.baseSalary, employee.commissionRate, salesAmount);
        break;
      case 'performance':
        salaryCalculation = this.calculatePerformanceSalary(employee.baseSalary, performanceRate, {});
        break;
      case 'fixed':
        salaryCalculation = this.calculateFixedSalary(employee.fixedAmount || employee.monthlySalary, daysWorked);
        break;
      case 'mixed':
        salaryCalculation = this.calculateMixedSalary(employee.baseSalary, employee.commissionRate, salesAmount);
        break;
      default:
        throw new Error(`Type de salaire non supporté: ${salaryType}`);
    }
    
    // Ajouter les charges sociales
    const socialCharges = this.calculateSocialCharges(salaryCalculation.totalPay || salaryCalculation.actualPay);
    
    return {
      employee,
      salaryCalculation,
      socialCharges,
      summary: {
        grossSalary: salaryCalculation.totalPay || salaryCalculation.actualPay,
        netSalary: socialCharges.netSalary,
        totalCost: socialCharges.totalCost
      }
    };
  }

  // Obtenir les types de salaires disponibles
  static getSalaryTypes() {
    return [
      { value: 'hourly', label: 'Salaire horaire', description: 'Rémunération basée sur les heures travaillées' },
      { value: 'monthly', label: 'Salaire mensuel', description: 'Salaire fixe mensuel' },
      { value: 'commission', label: 'Salaire à la commission', description: 'Base + commission sur ventes' },
      { value: 'performance', label: 'Salaire au rendement', description: 'Base + bonus selon performance' },
      { value: 'fixed', label: 'Salaire au forfait', description: 'Montant fixe indépendant du temps' },
      { value: 'mixed', label: 'Salaire mixte', description: 'Base + commission + bonus' }
    ];
  }
}

