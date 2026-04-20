import { describe, it, expect } from 'vitest';
import { BCD } from "./bcd2"

describe('BCD', () => {
    const bcd = new BCD(65536)

    it('toNumber', () => {
        expect(bcd.toNumber()).toBe(65536)
    }) 

    it('toString', () => {
        expect(bcd.toString()).toBe('65536')
    })

    it('normalizedIndex', () => {
        expect(bcd.getNormalizedIndex(0)).toBe(4)
        expect(bcd.getNormalizedIndex(1)).toBe(3)
        expect(bcd.getNormalizedIndex(4)).toBe(0)
        expect(bcd.getNormalizedIndex(-1)).toBe(0)
        expect(bcd.getNormalizedIndex(-2)).toBe(1)
        expect(bcd.getNormalizedIndex(-5)).toBe(4)
    })

    it('at', () => {
        expect(bcd.at(0)).toBe(6)
        expect(bcd.at(1)).toBe(5)
        expect(bcd.at(-1)).toBe(6)
        expect(bcd.at(-2)).toBe(3)
    })
})