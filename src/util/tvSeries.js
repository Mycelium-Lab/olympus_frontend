export class TVValueTimeObject {
    constructor(value, time) {
        this.time = time
        this.value = value
    }
}

export class TVCandleObject {
    constructor(open, high, low, close, time) {
        this.open = open
        this.high = high
        this.low = low
        this.close = close
        this.time = time
    }
}
