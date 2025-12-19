import { describe, it, expect } from 'vitest'
import { formatJson, compactJson, parseJson } from '../../src/lib/json'

describe('JSON Library Functions', () => {
  describe('formatJson', () => {
    it('formats valid JSON', () => {
      const input = '{"a":1,"b":2}'
      const result = formatJson(input)
      expect(result).toBeDefined()
      expect(result).toContain('\n')
    })

    it('returns original string for invalid JSON', () => {
      const input = 'not json'
      const result = formatJson(input)
      expect(result).toBe(input)
    })

    it('properly indents JSON', () => {
      const input = '{"name":"test","value":123}'
      const result = formatJson(input)
      expect(result).toContain('  "name"')
    })
  })

  describe('compactJson', () => {
    it('compacts formatted JSON', () => {
      const input = '{\n  "a": 1,\n  "b": 2\n}'
      const result = compactJson(input)
      expect(result).toBeDefined()
      expect(result).not.toContain('\n')
    })

    it('returns original string for invalid JSON', () => {
      const input = 'not json'
      const result = compactJson(input)
      expect(result).toBe(input)
    })

    it('maintains data integrity', () => {
      const original = { a: 1, b: 2, c: 3 }
      const formatted = JSON.stringify(original, null, 2)
      const compacted = compactJson(formatted)
      const reparsed = JSON.parse(compacted)
      expect(reparsed).toEqual(original)
    })
  })

  describe('parseJson', () => {
    it('parses valid JSON', () => {
      const input = '{"a": 1}'
      const result = parseJson(input)
      expect(result.error).toBeNull()
      expect(result.value).toEqual({ a: 1 })
    })

    it('returns error for invalid JSON', () => {
      const input = '{invalid}'
      const result = parseJson(input)
      expect(result.error).toBeDefined()
      expect(result.value).toBeNull()
    })

    it('handles arrays', () => {
      const input = '[1, 2, 3]'
      const result = parseJson(input)
      expect(result.error).toBeNull()
      expect(Array.isArray(result.value)).toBe(true)
    })

    it('handles primitives', () => {
      const numberResult = parseJson('123')
      expect(numberResult.error).toBeNull()
      expect(numberResult.value).toBe(123)

      const stringResult = parseJson('"hello"')
      expect(stringResult.error).toBeNull()
      expect(stringResult.value).toBe('hello')
    })
  })
})
