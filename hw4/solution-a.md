


```js
// Биты отбрасываемые из-за переполнения слева дополняются справа
function cyclicLeftShift(value, shift) {
    // Приводим к 32-битному беззнаковому целому
    value = value >>> 0;
    shift = shift % 32;

    if (shift === 0) {
        return value;
    }

    // Сдвигаем влево и добавляем биты, которые "выпали" слева, справа
    return ((value << shift) | (value >>> (32 - shift))) >>> 0;
}

// Биты отбрасываемые из-за переполнения справа дополняются слева
function cyclicRightShift(value, shift) {
    // Приводим к 32-битному беззнаковому целому
    value = value >>> 0;
    shift = shift % 32;

    if (shift === 0) {
        return value;
    }

    // Сдвигаем вправо и добавляем биты, которые "выпали" справа, слева
    return ((value >>> shift) | (value << (32 - shift))) >>> 0;
}

// Примеры использования:
console.log(cyclicLeftShift(0b10000000_00000000_00000000_00000001, 1).toString(2).padStart(32, '0'));
// 00000000000000000000000000000011

console.log(cyclicRightShift(0b10000000_00000000_00000000_00000001, 2).toString(2).padStart(32, '0'));
// 01100000000000000000000000000000
```
