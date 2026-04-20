```js
class BCD {
    // Максимальное количество цифр в нашем числе
    static MAX_DIGITS = 200;

    // Я не знаю, сколько байт будет занимать мое число в закодированном виде,
    // поэтому закладываю возможность буферу расти до константы MAX_DIGITS / 2
    // (в одном байте хранится 2 цифры)
    #bytes = new Uint8Array(new ArrayBuffer(1, {maxByteLength: Math.ceil(BCD.MAX_DIGITS / 2)}));

    // "Длина" числа означает количество десятичных цифр в нем
    #length = 0;

    constructor(num) {
        const bytes = this.#bytes;

        let i = 0;

        let cursor = -1;

        if (typeof num === "number") {
            do {
                addToBytes(num % 10);
                num = Math.floor(num / 10);
            } while (num !== 0);

        } else {
            do {
                addToBytes(Number(num % 10n));
                num = num / 10n;
            } while (num !== 0n);
        }

        function addToBytes(value) {
            if (i % 2 === 0) {
                cursor++;

                if (bytes.length <= cursor) {
                    // Оптимизация: амортизированный рост памяти
                    bytes.buffer.resize(bytes.length * 2);
                }

                bytes[cursor] = value;

            } else {
                bytes[cursor] |= value << 4;
            }

            i++;
        }

        this.#length = i;

        // В процессе расширения массива может образоваться "лишняя" память.
        // Поэтому, чтобы она не мешалась под ногами, создаем срез на исходные байты, но с правильной длиной.
        // Важный момент, что subarray не делает копирование данных.
        this.#bytes = this.#bytes.subarray(0, Math.ceil(i / 2));
    }

    toBigint() {
        const bytes = this.#bytes;

        let result = 0n;
        let range = 0n;

        for (let i = 0; i < bytes.length; i++) {
            result += BigInt(bytes[i] & 0b1111) * 10n ** range;
            range++;

            result += BigInt(bytes[i] >>> 4) * 10n ** range;
            range++;
        }

        return result;
    };

    toNumber() {
        const bytes = this.#bytes;

        let result = 0;
        let range = 0;

        for (let i = 0; i < bytes.length; i++) {
            result += (bytes[i] & 0b1111) * 10 ** range;
            range++;

            result += (bytes[i] >>> 4) * 10 ** range;
            range++;
        }

        return result;
    };

    toString() {
        const bytes = this.#bytes;

        let result = "";

        // Если хранимое число занимает не четное число полубайтов,
        // то первый символ нужно будет игнорировать
        let shouldIgnoreFirstChar = this.#length % 2 !== 0;

        for (let i = bytes.length; i--;) {
            if (!shouldIgnoreFirstChar) {
                result += bytes[i] >>> 4;
            }

            result += bytes[i] & 0b1111;
            shouldIgnoreFirstChar = false;
        }

        return result;
    };

    at(index) {
        const len = this.#length;

        let normalizedIndex = index < 0 ? len + index : index;

        if (normalizedIndex < 0 || normalizedIndex >= len) {
            return undefined;
        }

        // Инвертируем индекс, так как в хранилище цифры идут от младших к старшим,
        // а мы хотим получать от старших к младшим (как в строке)
        const reversedIndex = len - 1 - normalizedIndex;

        // Находим байт, где хранится нужная цифра
        const byteIndex = Math.floor(reversedIndex / 2);

        // Вычисляем правильный сдвиг внутри одного байта
        const shift =  (reversedIndex % 2) * 4;

        return (this.#bytes[byteIndex] >> shift) & 0b1111;
    }
}

const n = new BCD(65536);

console.log(n.toBigint()); // 65536n
console.log(n.toNumber()); // 65536n
console.log(n.toString()); // 65536

console.log(n.at(0)); // 6
console.log(n.at(1)); // 5

console.log(n.at(-1)); // 6
console.log(n.at(-2)); // 3
```
