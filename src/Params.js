export default class Params {
    constructor(params) {
        params = params || {}

        this.key = params.key
        this.power = params.power
        this.noControl = params.noControl
        this.autoStart = params.autoStart
    }
}