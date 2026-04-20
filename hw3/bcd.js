export class BCD {
    #bytes = new Uint8Array(new ArrayBuffer(4, { maxByteLength: 100 }))
    #length = 0

    constructor(num) { // num: 65536
        let len = 0
        while (num) {
            this.addToBytes(len, num % 10) // 6 3 5 5 6
            len++
            num = Math.floor(num / 10)
        }
        // #bytes = [6,3,5,5,6,0,0,0]
        this.#length = len
    }

    addToBytes(index, value) {
        if (this.#bytes.length - 1 <= index) {
            this.#bytes.buffer.resize(this.#bytes.length * 2)
        }
        this.#bytes[index] = value
    }

    getNormalizedIndex(index) {
        let normalizedIndex = index < 0 ? this.#length + index : index
        if (normalizedIndex >= this.#length) return -1
        return this.#length - 1 - normalizedIndex
    }

    toNumber() {
        let result = 0
        for (let i = 0; i < this.#length; i++) {
            const bit = this.#bytes[i] // 6 3 5 5 6
            result += bit * 10 ** i // 6 + 30 + 500 + 5_000 + 60_000
            // result += bit * 10 ** (this.#length - 1 - i)
        }
        return result
    }

    toString() {
        let result = ''
        for (let i = this.#length - 1; i >=0; i--) {
            const bit = this.#bytes[i]
            result += bit
        }
        return result
    }

    at(index) {
        let normalizedIndex = this.getNormalizedIndex(index)
        console.log({ normalizedIndex, bytes: this.#bytes })
        return this.#bytes[normalizedIndex]
    }
}

const n = new BCD(65536)