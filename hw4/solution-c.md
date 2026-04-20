
Для кодирования взята кодировка с переменной длиной символа и модификатором для верхнего регистра.

```
Оригинал: Привет мир
Закодировано: Uint8Array(7) [
  255, 157, 67, 23,
  211, 200, 84
]
--------------------------------------------------------------------------------
Использовано байт с нашей кодовой таблицей: 7
Использовано байт в UTF-8: 19
Использовано байт в UTF-16: 20
--------------------------------------------------------------------------------
Декодировано: Привет мир
Успех: true
```

```js
// Кодовая таблица (символ -> код)
const charToCode = new Map([
    ["0", 0b000000], ["1", 0b000001], ["2", 0b000010], ["3", 0b000011],
    ["4", 0b000100], ["5", 0b000101], ["6", 0b000110], ["7", 0b000111],
    ["8", 0b001000], ["9", 0b001001],
    ["а", 0b001010], ["б", 0b001011], ["в", 0b001100], ["г", 0b001101],
    ["д", 0b001110], ["е", 0b001111], ["ё", 0b010000], ["ж", 0b010001],
    ["з", 0b010010], ["и", 0b010011], ["й", 0b010100], ["к", 0b010101],
    ["л", 0b010110], ["м", 0b010111], ["н", 0b011000], ["о", 0b011001],
    ["п", 0b011010], ["р", 0b011011], ["с", 0b011100], ["т", 0b011101],
    ["у", 0b011110], ["ф", 0b011111], ["х", 0b100000], ["ц", 0b100001],
    ["ч", 0b100010], ["ш", 0b100011], ["щ", 0b100100], ["ъ", 0b100101],
    ["ы", 0b100110], ["ь", 0b100111], ["э", 0b101000], ["ю", 0b101001],
    ["я", 0b101010],
    [".", 0b101011], [",", 0b101100], ["-", 0b101101], ["?", 0b101110],
    ["!", 0b101111], ['"', 0b110000], [":", 0b110001], [";", 0b110010],
    ["…", 0b110011], ["+", 0b110011], ["=", 0b110100], ["*", 0b110101],
    ["/", 0b110110], ["(", 0b110111], [")", 0b111000], ["%", 0b111001],
    [" ", 0b111011], ["\n", 0b111100], ["\t", 0b111101], ["\\u", 0b111110],
    ["\\U", 0b111111]
]);

// Обратная таблица (код -> символ)
const codeToChar = new Map();
for (const [char, code] of charToCode) {
    codeToChar.set(code, char);
}

/**
 * Кодирует строку в массив байт (32 байта на 5 символов)
 * @param {string} input - Входная строка
 * @returns {Uint8Array} - Массив байт
 */
function encode(input) {
    const bytes = [];

    let buffer = 0;
    let bitsInBuffer = 0;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];

        // Обработка специальных управляющих последовательностей
        if (char === "\\" && i + 1 < input.length) {
            const nextChar = input[i + 1];

            if (nextChar === "u") {
                // Обработка \u - следующий символ в верхнем регистре
                const code = charToCode.get("\\u");

                if (code !== undefined) {
                    buffer = (buffer << 6) | code;
                    bitsInBuffer += 6;
                    i++; // Пропускаем "u"

                    // Применяем эффект к следующему символу
                    if (i + 1 < input.length) {
                        const nextNextChar = input[i + 1];

                        let nextCode = charToCode.get(nextNextChar.toLowerCase());

                        if (nextCode !== undefined) {
                            buffer = (buffer << 6) | nextCode;
                            bitsInBuffer += 6;
                            i++; // Пропускаем обработанный символ
                        }
                    }
                }

                continue;
            }

            if (nextChar === "U") {
                // Обработка \U - все последующие в верхнем регистре
                const code = charToCode.get("\U");

                if (code !== undefined) {
                    buffer = (buffer << 6) | code;
                    bitsInBuffer += 6;
                    i++; // Пропускаем "U"

                    // Применяем эффект ко всем следующим символам до пробела или знака препинания
                    let j = i + 1;

                    while (j < input.length) {
                        const ch = input[j];

                        // Проверяем, является ли символ пробелом или знаком препинания
                        if (
                            ch === " " || ch === "." || ch === "," || ch === "!" ||
                            ch === "?" || ch === ";" || ch === ":" || ch === '"' ||
                            ch === "-" || ch === "(" || ch === ")" || ch === "\n" ||
                            ch === "\t"
                        ) {
                            break;
                        }

                        let chCode = charToCode.get(ch.toLowerCase());

                        if (chCode !== undefined) {
                            buffer = (buffer << 6) | chCode;
                            bitsInBuffer += 6;
                            j++;

                        } else {
                            break;
                        }
                    }
                    i = j - 1;
                }

                continue;
            }
        }

        const code = charToCode.get(char);
        if (code === undefined) {
            console.warn(`Символ "${char}" не найден в кодовой таблице, пропускаем`);
            continue;
        }

        buffer = (buffer << 6) | code;
        bitsInBuffer += 6;

        // Если накопилось 8 бит или больше, сохраняем байты
        while (bitsInBuffer >= 8) {
            bitsInBuffer -= 8;
            const byte = (buffer >>> bitsInBuffer) & 0xFF;
            bytes.push(byte);
        }
    }

    // Добавляем последний неполный байт если есть
    if (bitsInBuffer > 0) {
        const byte = (buffer << (8 - bitsInBuffer)) & 0xFF;
        bytes.push(byte);
    }

    return new Uint8Array(bytes);
}

/**
 * Декодирует массив байт обратно в строку
 * @param {Uint8Array} bytes - Массив байт
 * @returns {string} - Декодированная строка
 */
function decode(bytes) {
    let result = "";
    let buffer = 0;
    let bitsInBuffer = 0;
    let upperCaseMode = false;
    let upperCaseOnce = false;

    for (let i = 0; i < bytes.length; i++) {
        buffer = (buffer << 8) | bytes[i];
        bitsInBuffer += 8;

        // Извлекаем 6-битные коды
        while (bitsInBuffer >= 6) {
            bitsInBuffer -= 6;
            const code = (buffer >>> bitsInBuffer) & 0x3F; // 0x3F = 0b111111

            // Обработка специальных управляющих кодов
            if (upperCaseOnce) {
                upperCaseOnce = false;
                const char = codeToChar.get(code);
                if (char) {
                    result += char.toUpperCase();
                }

            } else if (upperCaseMode) {
                const char = codeToChar.get(code);
                if (char) {
                    // Проверяем, не является ли символ пробелом или знаком препинания
                    if (char === " " || char === "." || char === "," || char === "!" ||
                        char === "?" || char === ";" || char === ":" || char === '"' ||
                        char === "-" || char === "(" || char === ")" || char === "\n" ||
                        char === "\t") {
                        upperCaseMode = false;
                        result += char;

                    } else {
                        result += char.toUpperCase();
                    }
                }

            } else {
                const char = codeToChar.get(code);

                if (char === "\\u") {
                    upperCaseOnce = true;

                } else if (char === "\\U") {
                    upperCaseMode = true;

                } else {
                    result += char || "?";
                }
            }
        }
    }

    return result;
}

// Пример использования:
const text = "Привет мир!";
console.log("Исходный текст:", text);

const encoded = encode(text);
console.log("Закодировано (байты):", Array.from(encoded));

const decoded = decode(encoded);
console.log("Декодировано:", decoded);
```

