export class BCD {
  #bytes = new Uint8Array(new ArrayBuffer(4, { maxByteLength: 100 }))
  #length = 0

  constructor(num) { // num = 65536
    let cursor = 0

    do {
      this.addToBytes(cursor, num % 10) // 6 3 5 5 6
      num = Math.floor(num / 10)
      cursor++
    } while (num)

    this.#length = cursor
    // #bytes = 6_3 5_5 6_0 0_0

    console.log(this.#bytes, this.#length)
  }

  addToBytes(cursor, value) {
    const byteIndex = Math.floor(cursor / 2)

    if (this.#bytes.length - 1 <= byteIndex) {
      this.#bytes.buffer.resize(this.#bytes.length * 2)
    }

    if (cursor % 2) { // вторые полбайта
      this.#bytes[byteIndex] |= value
    } else { // первые полбайта
      this.#bytes[byteIndex] |= (value << 4)
    }
  }

  getDigit(index) {
    let byteIndex = Math.floor(index / 2)

    if (index % 2) { // второй полубайт
      return this.#bytes[byteIndex] & 0b1111

    }
    // первый полубайт
    return this.#bytes[byteIndex] >>> 4 & 0b1111
  }

  toNumber() {
    let result = 0

    for (let i = 0; i < this.#length; i++) {
      result += this.getDigit(i) * 10 ** i
    }

    return result
  }

  toString() {
    let result = ''

    // let skip = this.length % 2 !== 0

    for (let i = this.#length - 1; i >= 0; i--) {
      result += this.getDigit(i)
      // let a = this.bytes[i] >>> 4
      // let b = this.bytes[i] & 0b1111
      // if (!skip) {
      //   string += (this.bytes[i] >>> 4)
      // }
      // string += (this.bytes[i] & 0b1111)
      // skip = false
    }
    return result
  }

  getNormalizedIndex(index) {
    let normalizedIndex = index < 0 ? this.#length + index : index
    if (normalizedIndex >= this.#length) return -1
    return this.#length - 1 - normalizedIndex
  }

  at(index) {
    const normalizedIndex = this.getNormalizedIndex(index)
    return this.getDigit(normalizedIndex)
  }
}