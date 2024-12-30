import { truncateDecimals } from "./formatting"

describe('truncateDecimals', () => {
  it('should return the whole number if no decimal', () => {
    const value = '1234'
    const decimals = 2
    const result = truncateDecimals(value, decimals)
    expect(result).toBe('1234')
  })

  it('should return the whole number if decimals is 0', () => {
    const value = '1234.56'
    const decimals = 0
    const result = truncateDecimals(value, decimals)
    expect(result).toBe('1234')
  })

  it('should remove decimal point if decimals = 0', () => {
    const value = '1234.'
    const decimals = 0
    const result = truncateDecimals(value, decimals)
    expect(result).toBe('1234')
  })

  it('should not remove decimal point if decimals > 0', () => {
    const value = '1234.'
    const decimals = 1
    const result = truncateDecimals(value, decimals)
    expect(result).toBe('1234.')
  })

  it('should return a truncated value with the specified number of decimals', () => {
    const value = '1234.5678'
    const decimals = 2
    const result = truncateDecimals(value, decimals)
    expect(result).toBe('1234.56')
  })

  it('should handle having no whole number', () => {
    const value = '.456'
    const decimals = 2
    const result = truncateDecimals(value, decimals)
    expect(result).toBe('.45')
  })

  it('should return "." if value is "."', () => {
    const value = '.'
    const decimals = 2
    const result = truncateDecimals(value, decimals)
    expect(result).toBe('.')
  })
})