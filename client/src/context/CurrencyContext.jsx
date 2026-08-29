import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext(null);

const RATES = {
  INR: { symbol: '₹', rate: 1.0, label: 'INR (₹)' },
  USD: { symbol: '$', rate: 1 / 83.5, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 1 / 90.5, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 1 / 106.0, label: 'GBP (£)' }
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('app_currency') || 'INR';
  });

  useEffect(() => {
    localStorage.setItem('app_currency', currency);
  }, [currency]);

  const activeRate = RATES[currency] || RATES.INR;

  const convertFromINR = (inrAmount) => {
    if (inrAmount === null || inrAmount === undefined) return 0;
    return Number(inrAmount) * activeRate.rate;
  };

  const convertToINR = (amountInActiveCurrency) => {
    if (!amountInActiveCurrency) return 0;
    return Math.round(Number(amountInActiveCurrency) / activeRate.rate);
  };

  const formatAmount = (inrAmount, options = {}) => {
    const { compact = false } = options;
    const converted = convertFromINR(inrAmount);

    if (compact) {
      if (converted >= 10000000 && currency === 'INR') {
        return `₹${(converted / 10000000).toFixed(1)}Cr`;
      }
      if (converted >= 100000 && currency === 'INR') {
        return `₹${(converted / 100000).toFixed(1)}L`;
      }
      if (converted >= 1000000) {
        return `${activeRate.symbol}${(converted / 1000000).toFixed(1)}M`;
      }
      if (converted >= 1000) {
        return `${activeRate.symbol}${(converted / 1000).toFixed(1)}k`;
      }
    }

    const formattedNumber = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      maximumFractionDigits: currency === 'INR' ? 0 : 2,
      minimumFractionDigits: 0
    }).format(converted);

    return `${activeRate.symbol}${formattedNumber}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        currencySymbol: activeRate.symbol,
        availableCurrencies: Object.keys(RATES).map(k => ({ code: k, ...RATES[k] })),
        formatAmount,
        convertFromINR,
        convertToINR
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext;
