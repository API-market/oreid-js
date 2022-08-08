import { Observable } from './observable'

test('Should create an object', () => {
  const observable = new Observable()
  expect(observable).toBeInstanceOf(Observable)
  expect(observable).toHaveProperty('_subscribers', [])
})

test('Should add a function do subscribers', () => {
  const observable = new Observable()
  const sub1 = jest.fn()
  const sub2 = jest.fn()

  expect(observable).toHaveProperty('_subscribers', [])

  observable.subscribe(sub1)
  expect(observable).toHaveProperty('_subscribers', [sub1])

  observable.subscribe(sub2)
  expect(observable).toHaveProperty('_subscribers', [sub1, sub2])
})

test('Should call the function that was subscribed', () => {
  const observable = new Observable()
  const sub1 = jest.fn()

  expect(sub1).not.toBeCalled()
  observable.subscribe(sub1)
  expect(sub1).toBeCalledTimes(1)
})

test('Add same function twice has no effect', () => {
  const observable = new Observable()
  const sub1 = jest.fn()

  expect(observable).toHaveProperty('_subscribers', [])
  expect(sub1).not.toBeCalled()

  observable.subscribe(sub1)
  expect(observable).toHaveProperty('_subscribers', [sub1])
  expect(sub1).toBeCalledTimes(1)

  observable.subscribe(sub1)
  expect(observable).toHaveProperty('_subscribers', [sub1])
  expect(sub1).toBeCalledTimes(1)
})

test('Should remove a function to subscribers', () => {
  const observable = new Observable()
  const sub1 = jest.fn()
  const sub2 = jest.fn()
  const sub3 = jest.fn()

  expect(observable).toHaveProperty('_subscribers', [])
  observable.subscribe(sub1)
  observable.subscribe(sub2)
  expect(observable).toHaveProperty('_subscribers', [sub1, sub2])

  observable.unsubscribe(sub1)
  expect(observable).toHaveProperty('_subscribers', [sub2])

  observable.unsubscribe(sub2)
  expect(observable).toHaveProperty('_subscribers', [])
})

test('Should call all current subscribes', () => {
  const observable = new Observable()
  const sub1 = jest.fn()
  const sub2 = jest.fn()

  expect(sub1).toBeCalledTimes(0)
  expect(sub1).toBeCalledTimes(0)
  expect(sub1).toBeCalledTimes(0)
  observable.subscribe(sub1)
  observable.subscribe(sub2)
  expect(observable).toHaveProperty('_subscribers', [sub1, sub2])

  // Showing that callSubscribers execute each function once
  expect(sub1).toBeCalledTimes(1)
  expect(sub2).toBeCalledTimes(1)

  observable.callSubscribers()
  expect(sub1).toBeCalledTimes(2)
  expect(sub2).toBeCalledTimes(2)

  // removing function "sub1"
  observable.unsubscribe(sub1)
  expect(observable).toHaveProperty('_subscribers', [sub2])

  // Showing that the removed function is no longer being called
  expect(sub1).toBeCalledTimes(2)
  expect(sub2).toBeCalledTimes(2)
  observable.callSubscribers()
  expect(sub1).toBeCalledTimes(2)
  expect(sub2).toBeCalledTimes(3)
})
