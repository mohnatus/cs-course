const instructions = {
    'SET A': 0,
    'PRINT A': 1,
    'IFN A': 2,
    'RET': 3,
    'DEC A': 4,
    'JMP': 5
};

function hasValue(instruction) {
    return instruction === instructions['SET A'] || instruction === instructions['RET'] || instruction === instructions['JMP']
}

function execute(program) {
    let a = 0;
    let i = 0;
    let skip = false

    while (i < program.length) {
        const instruction = program[i];
        let nextInstruction = hasValue(instruction) ? i + 2 : i + 1;
        const value = program[i + 1];

        if (skip) {
            skip = false
            i = nextInstruction;
            continue;
        }

        switch (instruction) {
            case instructions['SET A']:
                a = value;
                break;
            case instructions['PRINT A']:
                console.log(a);
                break;
            case instructions['IFN A']:
                if (a !== 0) {
                    skip = true
                }
                break;
            case instructions['RET']:
                return a;
            case instructions['JMP']:
                nextInstruction = value;
                break;
            case instructions['DEC A']:
                a -= 1;
                break;
        }

        i = nextInstruction;
    }
}

const program = [
    // Ставим значения аккумулятора
    instructions['SET A'],
    // В 10
    10,

    // Выводим значение на экран
    instructions['PRINT A'],

    // Если A равно 0
    instructions['IFN A'],

    // Программа завершается
    instructions['RET'],

    // И возвращает 0
    0,

    // Уменьшаем A на 1
    instructions['DEC A'],

    // Устанавливаем курсор выполняемой инструкции
    instructions['JMP'],

    // В значение 2
    2
];

// Выведет в консоль
// 10
// 9
// 8
// 7
// 6
// 5
// 4
// 3
// 2
// 1
// 0
// И вернет 0
execute(program);