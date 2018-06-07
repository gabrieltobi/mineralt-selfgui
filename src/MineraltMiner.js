export default class MineraltMiner {
    constructor(miner) {
        this.db = miner.db
        this.getlf = miner.getlf
        this.hps = miner.hps
        this.i = miner.i
        this.setcb = miner.setcb
        this.setlf = miner.setlf
        this.setsl = miner.setsl
        this.start = miner.start
        this.stop = miner.stop
        this.th = miner.th
    }
}

MineraltMiner.CONNECTED = 'c'
MineraltMiner.DISCONNECTED = 'd'