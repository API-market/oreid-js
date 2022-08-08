import LocalState from './localState'
import IStorage from '../core/IStorage'

const createMockStorage = (): IStorage => ({
  getItem: jest.fn(),
  removeItem: jest.fn(),
  setItem: jest.fn(),
})

test('Should create an object', () => {
  const storage = createMockStorage()
  const localState = new LocalState('my-appId', storage)
  expect(localState).toBeInstanceOf(LocalState)
  expect(localState).toHaveProperty('appId', 'my-appId')
  expect(localState).toHaveProperty('storage', storage)
})

test('Should load AccessToken from storage', () => {
  const storage = createMockStorage()
  const localState = new LocalState('my-appId', storage)

  expect(storage.getItem).not.toBeCalled()
  localState.loadAccessToken()
  expect(storage.getItem).toBeCalledWith('oreid.my-appId.accessToken')
})

test('Should save AccessToken on storage', () => {
  const storage = createMockStorage()
  const localState = new LocalState('my-appId', storage)

  expect(storage.setItem).not.toBeCalled()
  expect(localState).toHaveProperty('cachedaccessToken', null)
  localState.saveAccessToken('my-AccessToken')
  expect(storage.setItem).toBeCalledWith('oreid.my-appId.accessToken', 'my-AccessToken')
  expect(localState).toHaveProperty('cachedaccessToken', 'my-AccessToken')
})

test('Should clear when save an blank AccessToken', () => {
  const storage = createMockStorage()
  const localState = new LocalState('my-appId', storage)

  expect(storage.removeItem).not.toBeCalled()
  expect(localState).toHaveProperty('cachedaccessToken', null)
  localState.saveAccessToken('my-AccessToken')
  expect(localState).toHaveProperty('cachedaccessToken', 'my-AccessToken')
  expect(storage.removeItem).not.toBeCalled()

  localState.saveAccessToken('')
  expect(storage.removeItem).toBeCalledWith('oreid.my-appId.accessToken')
  expect(localState).toHaveProperty('cachedaccessToken', null)
})

test('Should clear my AccessToken', () => {
  const storage = createMockStorage()
  const localState = new LocalState('my-appId', storage)

  localState.saveAccessToken('my-AccessToken')
  expect(localState).toHaveProperty('cachedaccessToken', 'my-AccessToken')

  expect(storage.removeItem).not.toBeCalled()
  localState.clearAccessToken()
  expect(storage.removeItem).toBeCalledWith('oreid.my-appId.accessToken')
  expect(localState).toHaveProperty('cachedaccessToken', null)
})
