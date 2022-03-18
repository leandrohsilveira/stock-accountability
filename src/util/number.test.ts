import { formatNumber, parseNumber } from './number'

describe('formatNumber function', () => {
  describe('given defaults precision, thousands and decimal separators', () => {
    test('should format number 300 to "300,00"', () => {
      const result = formatNumber(300)
      expect(result).toEqual('300,00')
    })

    test('should format number 3000 to "3.000,00"', () => {
      const result = formatNumber(3000)
      expect(result).toEqual('3.000,00')
    })

    test('should format number 300.54 to "300,54"', () => {
      const result = formatNumber(300.54)
      expect(result).toEqual('300,54')
    })

    test('should format number 3000.54 to "3.000,54"', () => {
      const result = formatNumber(3000.54)
      expect(result).toEqual('3.000,54')
    })

    test('should format number 300.5 to "300,50"', () => {
      const result = formatNumber(300.5)
      expect(result).toEqual('300,50')
    })

    test('should format number 3000.5 to "3.000,50"', () => {
      const result = formatNumber(3000.5)
      expect(result).toEqual('3.000,50')
    })
  })
})

describe('parseNumber function', () => {
  describe('given default precision', () => {
    test('should parse "300,00" to 300', () => {
      const result = parseNumber('300,00')
      expect(result).toEqual(300)
    })

    test('should parse "3.000,00" to 3000', () => {
      const result = parseNumber('3.000,00')
      expect(result).toEqual(3000)
    })

    test('should parse "3.000,54" to 3000.54', () => {
      const result = parseNumber('3.000.54')
      expect(result).toEqual(3000.54)
    })

    test('should parse "3.000,540" to 30005.4', () => {
      const result = parseNumber('3.000.540')
      expect(result).toEqual(30005.4)
    })
  })
})
