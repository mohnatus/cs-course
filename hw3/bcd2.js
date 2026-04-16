class BCD {
  constructor(num) {
    this.length = 0
    this.bytes = new Uint8Array(new ArrayBuffer(4, { maxByteLength: 200 }))

    const addToBytes = (value) => {
      const cursor = Math.floor(this.length / 2)

      if (this.bytes.length - 1 <= cursor) {
        this.bytes.buffer.resize(this.bytes.length * 2)
      }
      if (this.length % 2 === 0) {
        this.bytes[cursor] |= value
      } else {
        this.bytes[cursor] |= (value << 4)
      }

      this.length++
    }

    do {
      addToBytes(num % 10)
      num = Math.floor(num / 10)

    } while (num)
  }

  toNumber() {
    let num = 0
    let index = 0

    for (let i = 0; i < this.bytes.length; i++) {
      num += (this.bytes[i] & 0b1111) * 10 ** index
      index++
      num += (this.bytes[i] >>> 4 & 0b1111) * 10 ** index
      index++
    }

    return num
  }

  toString() {
    let string = ''

    let skip = this.length % 2 !== 0

    for (let i = this.bytes.length - 1; i--;) {
      let a = this.bytes[i] >>> 4 
      let b = this.bytes[i]  & 0b1111
      if (!skip) {
        string += (this.bytes[i] >>> 4)
      }
      string += (this.bytes[i] & 0b1111)
      skip = false
    }
    return string
  }

  at(index) {
    const normalizedIndex = index >= 0 ? index : this.length + index
    const reversedIndex = this.length - 1 - normalizedIndex;
    const byte = this.bytes[Math.floor(reversedIndex / 2)]
    const offset = reversedIndex % 2 ? 4 : 0
    return (byte >>> offset) & 0b1111
  }
}

const n = new BCD(65536)

console.log(n.toNumber()) // 65536
console.log(n.toString()) // '65536'

console.log(n.at(0)) // 6
console.log(n.at(1)) // 5
console.log(n.at(-1)) // 6
console.log(n.at(-2)) // 3