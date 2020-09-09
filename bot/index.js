const axios = require('axios')
const params = {
  Symbol: 'tETHUSD',
  Precision: 'P0',
}

const order = () =>
  axios
  .get(
    `https://api.stg.deversifi.com/bfx/v2/book/${params.Symbol}/${params.Precision}`, {
      ...params,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  )
  .then((response) => response.data)

const getRandomPercent = (percent) => Math.floor(Math.random() * percent) / 100

const operatePercentOnOrders = (operation, percent, orders) =>
  orders.map((order) => {
    const result = []
    for (let i = 0; i < 5; i++) {
      result.push(operation(order[0], order[0] * getRandomPercent(percent)))
    }
    return result
  })

const add = (a, b) => a + b
const minus = (a, b) => a - b

const bid = operatePercentOnOrders.bind(null, add, 5)
const ask = operatePercentOnOrders.bind(null, minus, 5)

const logOrders = (orderType, orders) =>
  orders.map((amount) => console.log(`${orderType} @ ${amount}`))

const bot = {
  balance: {
    eth: 10,
    usd: 2000,
  },
  logOrders,
  order,
  bid,
  ask,
  run,
  start,
}

async function run() {
  const orders = await order()
  const bids = bot.bid(orders)
  const asks = bot.ask(orders)
  logOrders('PLACE BID', bids)
  logOrders('FILLED ASK', asks)
}

function start() {
  bot.run()
  const loop = setInterval(() => {
    bot.run()
  }, 30000)
}

module.exports = bot