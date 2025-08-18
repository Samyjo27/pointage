export const AFRICAN_CURRENCIES = [
  { code: 'XOF', label: 'CFA BCEAO (XOF)', locale: 'fr-FR', symbol: 'CFA' },
  { code: 'XAF', label: 'CFA BEAC (XAF)', locale: 'fr-FR', symbol: 'FCFA' },
  { code: 'NGN', label: 'Naira nigérian (NGN)', locale: 'en-NG', symbol: '₦' },
  { code: 'ZAR', label: 'Rand sud-africain (ZAR)', locale: 'en-ZA', symbol: 'R' },
  { code: 'MAD', label: 'Dirham marocain (MAD)', locale: 'fr-MA', symbol: 'DH' },
  { code: 'TND', label: 'Dinar tunisien (TND)', locale: 'ar-TN', symbol: 'د.ت' },
  { code: 'DZD', label: 'Dinar algérien (DZD)', locale: 'ar-DZ', symbol: 'دج' },
  { code: 'KES', label: 'Shilling kényan (KES)', locale: 'en-KE', symbol: 'KSh' },
  { code: 'GHS', label: 'Cedi ghanéen (GHS)', locale: 'en-GH', symbol: '₵' },
  { code: 'XPF', label: 'Franc CFP (XPF)', locale: 'fr-FR', symbol: '₣' },
  { code: 'USD', label: 'Dollar US (USD)', locale: 'en-US', symbol: '$' },
  { code: 'EUR', label: 'Euro (EUR)', locale: 'fr-FR', symbol: '€' },
];

const PREFERRED_CURRENCY_KEY = 'timetrack_preferred_currency';

export function getPreferredCurrency() {
  const fromStorage = localStorage.getItem(PREFERRED_CURRENCY_KEY);
  return fromStorage || 'XOF';
}

export function setPreferredCurrency(code) {
  localStorage.setItem(PREFERRED_CURRENCY_KEY, code);
}

export function getCurrencyMeta(code) {
  return AFRICAN_CURRENCIES.find(c => c.code === code) || AFRICAN_CURRENCIES[0];
}

export function formatCurrency(amount, code = getPreferredCurrency()) {
  const { locale } = getCurrencyMeta(code);
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: code, maximumFractionDigits: 2 }).format(amount || 0);
  } catch (_) {
    // Fallback for non-standard currencies like XOF/XAF on some runtimes
    const symbol = getCurrencyMeta(code).symbol;
    const value = (Number(amount) || 0).toFixed(2);
    return `${value} ${symbol}`;
  }
}


