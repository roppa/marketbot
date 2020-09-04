const axios = require('axios')
const bot = require('..')
jest.useFakeTimers();

jest.mock('axios')

const response = module.exports = [
  [302, 1, 20
  ], [
    168.02, 1, 0.6
  ], [
    167.98, 1, 0.6
  ], [
    167.94, 1, 0.6
  ]]

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => { });
})

describe('bot balance', () => {
  test('should have a balance', () => {
    expect(bot.balance.eth).toEqual(10)
    expect(bot.balance.usd).toEqual(2000)
  })
})

describe('bot orderbook', () => {
  test('should retrieve eth-usd order', async () => {
    axios.get.mockImplementationOnce(async () => ({ data: response }))
    const order = await bot.order()
    expect(order).toEqual(response)
  })
})

describe('bot bid', () => {
  test('should bid 5 orders within 5% of bid price', async () => {
    axios.get.mockImplementationOnce(async () => ({ data: response }))
    const bids = await bot.bid()
    expect(bids.length).toEqual(response.length)
    expect(bids[0].length).toEqual(5)
    expect(bids[0][0] <= response[0][0] + response[0][0] * .05).toBeTruthy()
  })
})

describe('bot ask', () => {
  test('should ask 5 orders within 5% of ask price', async () => {
    axios.get.mockImplementationOnce(async () => ({ data: response }))
    const asks = await bot.ask()
    expect(asks.length).toEqual(response.length)
    expect(asks[0].length).toEqual(5)
    expect(asks[0][0] >= response[0][0] - response[0][0] * .05).toBeTruthy()
  })
})

describe('bot listen', () => {
  test('should loop', () => {
    axios.get.mockImplementation(async () => ({ data: response }))
    const run = jest.spyOn(bot, 'run')
    const bid = jest.spyOn(bot, 'bid')
    bot.start()
    expect(setInterval).toHaveBeenCalled();
    jest.runOnlyPendingTimers();
    expect(run).toHaveBeenCalledTimes(2);
    expect(bid).toHaveBeenCalled();
  })
})