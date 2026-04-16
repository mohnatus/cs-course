class BCD {
 constructor(num) {
    const arr = []
    while(num) {
        const bit = num % 10
        arr.push(bit)
        num = Math.floor(num / 10)
    }
    this.arr = new Uint8Array(arr)
 }

 toNumber() {
    let num = 0
    for (let i = 0; i < this.arr.length; i++) {
        const bit = this.arr[i]
        num += bit * 10 ** (this.arr.length - 1 - i)
    }
    return num
 }

  toString() {
    let string = ''
    for (let i = 0; i < this.arr.length; i++) {
        const bit = this.arr[i]
        string += bit
    }
    return string
  }

  at(index) {
    let normalizedIndex = index >= 0 ? index : this.arr.length + index
    return this.arr[this.arr.length - 1 - normalizedIndex]
  }
}

const n = new BCD(65536)

console.log(n)

console.log(n.toNumber()) // 65536
console.log(n.toString()) // '65536'

console.log(n.at(0)) // 6
console.log(n.at(1)) // 5
console.log(n.at(-1)) // 6
console.log(n.at(-2)) // 3