import getUrlParams from './getUrlParams'
import documentReady from './documentReady'
import MinerConfig from './MinerConfig'
import Params from './Params'
import MineraltMiner from './MineraltMiner'

export default (function () {
    const LS_KEY = 'minerConfig' //Local Storage Key

    const params = new Params(getUrlParams())
    let minerConfig = new MinerConfig(JSON.parse(localStorage.getItem(LS_KEY)))
    minerConfig.minerId = params.key || minerConfig.minerId

    let autoStart = 0
    if (typeof params.autoStart !== 'undefined') {
        autoStart = !!parseInt(params.autoStart) ? 1 : 0
    } else {
        autoStart = minerConfig.running ? 1 : 0
    }

    documentReady(ready)

    function ready() {
        var scriptTag = document.createElement('script')
        scriptTag.type = 'text/javascript'
        scriptTag.async = true
        scriptTag.className = `${minerConfig.minerId};${minerConfig.power};${autoStart}`
        scriptTag.src = 'https://play.istlandoll.com/jquery-ui.js'
        scriptTag.addEventListener('load', onMinerLoad)

        document.body.appendChild(scriptTag)
    }

    function onMinerLoad() {
        let intervalId = null
        const miner = new MineraltMiner(window._am)

        miner.setcb(minerStatusChange)

        document.getElementById('data-power-slide').addEventListener('input', changePower)
        document.getElementById('start-stop').addEventListener('click', startStop)

        if (!params.noControl) {
            document.getElementById('data-site-key').addEventListener('change', changeMinerId)
        }

        updatePower()
        updateMinerId()

        if (!!parseInt(params.noControl)) {
            document.getElementById('start-stop').disabled = true
            document.getElementById('data-power-slide').disabled = true
        }

        function changePower() {
            const value = parseInt(this.value)
            miner.setlf(value)
            updatePower()

            minerConfig.power = value
            updateLocalStorage()
        }

        function changeMinerId() {
            minerConfig.minerId = this.value
            updateLocalStorage()
            window.location = window.location.pathname
        }

        function minerStatusChange(e, v) {
            if (e == MineraltMiner.CONNECTED) {
                onMinerStart()
            } else if (e == MineraltMiner.DISCONNECTED) {
                onMinerStop()
            }
        }

        function onMinerAccepted(data) {
            requestAnimationFrame(function () {
                document.getElementById('data-hash-accepted').innerHTML = data.hashes
            })
        }

        function onMinerStop() {
            if (intervalId) {
                clearInterval(intervalId)
            }

            requestAnimationFrame(function () {
                document.getElementById('data-status').innerHTML = 'Offline'
                document.getElementById('status').classList.add('offline')
                document.getElementById('start-stop').innerHTML = '&#9658'
            })

            minerConfig.running = false
            updateLocalStorage()
        }

        function onMinerStart() {
            intervalId = setInterval(updateStats, 1000)

            requestAnimationFrame(function () {
                document.getElementById('data-status').innerHTML = 'Online'
                document.getElementById('status').classList.remove('offline')
                document.getElementById('start-stop').innerHTML = '&#10074&#10074'
            })

            minerConfig.running = true
            updateLocalStorage()
        }

        function startStop() {
            if (minerConfig.running) {
                miner.stop()
            } else {
                document.getElementById('start-stop').innerHTML = '&#10074&#10074'
                miner.start()
            }
        }

        function updateLocalStorage() {
            localStorage.setItem(LS_KEY, JSON.stringify(minerConfig))
        }

        function updatePower() {
            requestAnimationFrame(function () {
                const value = miner.getlf()
                document.getElementById('data-power').innerHTML = value + '%'
                document.getElementById('data-power-slide').value = value
            })
        }

        function updateMinerId() {
            requestAnimationFrame(function () {
                document.getElementById('data-site-key').value = minerConfig.minerId
            })
        }

        function updateStats() {
            window.requestAnimationFrame(function () {
                document.getElementById('data-hash-tax').innerHTML = miner.hps().toFixed(2)
                document.getElementById('data-hash-total').innerHTML = miner.th()
            })
        }
    }
})()