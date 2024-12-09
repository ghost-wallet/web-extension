export const getCurrencySymbol = (currency: string) => {
  switch (currency) {
    case 'USD':
      return '$' // US Dollar
    case 'EUR':
      return '€' // Euro
    case 'JPY':
      return '¥' // Japanese Yen
    case 'GBP':
      return '£' // British Pound
    case 'AUD':
      return 'A$' // Australian Dollar
    case 'CAD':
      return 'C$' // Canadian Dollar
    case 'CHF':
      return '₣' // Swiss Franc
    case 'CNY':
      return '¥' // Chinese Yuan
    case 'SEK':
      return 'kr' // Swedish Krona
    case 'NZD':
      return 'NZ$' // New Zealand Dollar
    default:
      return currency // Return the currency code if no symbol is defined
  }
}
