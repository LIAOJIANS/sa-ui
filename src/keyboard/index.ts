export enum KEY {
    'shift' = 'shift',
    'ctrl' = 'ctrl',
    'alt' = 'alt',
    'backspace' = 'backspace',
    'tab' = 'tab',
    'enter' = 'enter',
    'esc' = 'esc',
    'space' = 'space',
    'del' = 'del',
    'left' = 'left',
    'up' = 'up',
    'right' = 'right',
    'down' = 'down',
    'minus' = 'minus',
    'equal' = 'equal',
    'num_0' = 'num_0',
    'num_1' = 'num_1',
    'num_2' = 'num_2',
    'num_3' = 'num_3',
    'num_4' = 'num_4',
    'num_5' = 'num_5',
    'num_6' = 'num_6',
    'num_7' = 'num_7',
    'num_8' = 'num_8',
    'num_9' = 'num_9',
    'a' = 'a',
    'b' = 'b',
    'c' = 'c',
    'd' = 'd',
    'e' = 'e',
    'f' = 'f',
    'g' = 'g',
    'h' = 'h',
    'i' = 'i',
    'j' = 'j',
    'k' = 'k',
    'l' = 'l',
    'm' = 'm',
    'n' = 'n',
    'o' = 'o',
    'p' = 'p',
    'q' = 'q',
    'r' = 'r',
    's' = 's',
    't' = 't',
    'u' = 'u',
    'v' = 'v',
    'w' = 'w',
    'x' = 'x',
    'y' = 'y',
    'z' = 'z',
    'F1' = 'F1',
    'F2' = 'F2',
    'F3' = 'F3',
    'F4' = 'F4',
    'F5' = 'F5',
    'F6' = 'F6',
    'F7' = 'F7',
    'F8' = 'F8',
    'F9' = 'F9',
    'F10' = 'F10',
    'F11' = 'F11',
    'F12' = 'F12',
}

export const KeyBoardMap = {
    16: 'shift',
    17: 'ctrl',
    18: 'alt',

    8: 'backspace',
    9: 'tab',
    13: 'enter',
    27: 'esc',
    32: 'space',
    46: 'del',

    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',

    189: 'minus',
    187: 'equal',

    48: 'num_0',
    49: 'num_1',
    50: 'num_2',
    51: 'num_3',
    52: 'num_4',
    53: 'num_5',
    54: 'num_6',
    55: 'num_7',
    56: 'num_8',
    57: 'num_9',

    65: 'a',
    66: 'b',
    67: 'c',
    68: 'd',
    69: 'e',
    70: 'f',
    71: 'g',
    72: 'h',
    73: 'i',
    74: 'j',
    75: 'k',

    76: 'l',
    77: 'm',
    78: 'n',
    79: 'o',
    80: 'p',
    81: 'q',
    82: 'r',
    83: 's',
    84: 't',
    85: 'u',
    86: 'v',
    87: 'w',
    88: 'x',
    89: 'y',
    90: 'z',

    112: 'F1',
    113: 'F2',
    114: 'F3',
    115: 'F4',
    116: 'F5',
    117: 'F6',
    118: 'F7',
    119: 'F8',
    120: 'F9',
    121: 'F10',
    122: 'F11',
    123: 'F12',
}

export function getKey(e: KeyboardEvent): KEY | null {
    // @ts-ignore
    let key = KeyBoardMap[e.keyCode] as KEY
    if (!!KEY[key]) {
        return KEY[key]
    } else {
        /*if (e.keyCode !== 229) {
            console.warn(`Can't recognise key`, e)
        }*/
        return null
    }
}

export class KeyboardServiceOption {
    [key: string]: (e?: KeyboardEvent) => (void | undefined | boolean)
}

export const KeyboardService = {
    options: [] as KeyboardServiceOption[],
    /*订阅点击事件*/
    listen(option: KeyboardServiceOption) {
        if (!option) return () => {}
        this.options.push(option)
        return () => void KeyboardService.unbindListener(option)
    },
    /*取消订阅事件*/
    unbindListener(option: KeyboardServiceOption) {
        let index = this.options.indexOf(option)
        if (index > -1) {
            this.options.splice(index, 1)
        }
    },
    /*取消当前激活的元素*/
    cancelActiveElement() {
        const activeElement = document.activeElement as HTMLElement
        if (!!activeElement) activeElement.blur()
        return activeElement
    },
    /*处理window的点击事件*/
    _onkeydown(e: KeyboardEvent) {
        if (e.currentTarget !== e.target) return
        const names = [] as string[];
        (e.metaKey || e.ctrlKey) && names.push('ctrl')
        e.shiftKey && names.push('shift')
        e.altKey && names.push('alt')
        // @ts-ignore
        names.push(KeyBoardMap[e.keyCode])
        const compositionKeyName = names.join('+')

        const option = this.options[this.options.length - 1]
        if (!!option && !!option[compositionKeyName]) {
            const flag = option[compositionKeyName](e)
            /*默认阻止事件冒泡*/
            if (flag !== false) {
                e.stopPropagation()
                e.preventDefault()
            }
        }
    },
}

export function handleKeyboard(option: { [key in KEY]?: (e: KeyboardEvent) => any }) {
    return (e: KeyboardEvent) => {
        const key = getKey(e)
        if (!!key && !!option[key]) {
            return option[key]!(e)
        }
    }
}

document.body.addEventListener('keydown', e => KeyboardService._onkeydown(e))
