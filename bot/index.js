const axios = require('axios')
const params = {
  Symbol: "tETHUSD",
  Precision: "P0",
};

const order = () => axios.get(`https://api.stg.deversifi.com/bfx/v2/book/${params.Symbol}/${params.Precision}`, {
  ...params,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  }
}).then(response => response.data)

const getPercent = (percent) => Math.floor(Math.random() * percent) / 100

const getPercentOfOrders = (percent, orders, operation) => orders.map(order => {
  const result = []
  for (let i = 0; i < 5; i++) {
    result.push(operation(order[0], (order[0] * getPercent(5))))
  }
  return result
})

const add = (a, b) => a + b
const minus = (a, b) => a - b

const bid = async () => getPercentOfOrders(5, await order(), add)

const ask = async () => getPercentOfOrders(5, await order(), minus)

const log = (orderType, amount) => console.log(`${orderType} @ ${amount}`)

const logOrders = (orderType, orders) => orders.map(order => log(orderType, order))

const bot = {
  balance: {
    eth: 10,
    usd: 2000
  },
  order,
  bid,
  ask,
  run,
  start
}

async function run() {
  const bids = await bot.bid()
  const asks = await bot.ask()
  logOrders('PLACE BID', bids)
  logOrders('FILLED ASK', asks)
}

async function start() {
  bot.run()
  const loop = setInterval(() => {
    bot.run()
  }, 30000)
}

module.exports = bot