export default class MinerConfig {
    constructor(config) {
        config = config || {}

        this.minerId = config.minerId || 'kvDdLTQf'
        this.running = config.running || false
        this.power = config.power || 100
    }
}