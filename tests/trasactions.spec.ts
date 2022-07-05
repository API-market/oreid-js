import { getOreId, generateToken } from './utils'

describe('Create a transaction', () => {
  test('No erros', async () => {
    expect(1).toEqual(2)
  })

  test('with errors', async () => {
    expect(1).toEqual(2)
  })
})

describe('check if a transaction can be auto sign', () => {
  test('The transaction can be auto signed', async () => {
    expect(1).toEqual(2)
  })

  test('The transaction can not be auto signed', async () => {
    expect(1).toEqual(2)
  })
})

describe('Auto sign a transaction', () => {
  test('The transaction can be auto signed', async () => {
    expect(1).toEqual(2)
  })

  test('The transaction can not be auto signed', async () => {
    expect(1).toEqual(2)
  })
})

describe('singin a transaction with password', () => {
  test('Wrong password', async () => {
    expect(1).toEqual(2)
  })

  test('Valid password', async () => {
    expect(1).toEqual(2)
  })
})

describe('Sisign with external wallet', () => {
  test("Don't have a wallet app", async () => {
    expect(1).toEqual(2)
  })

  test('Cancel transaction in external app', async () => {
    expect(1).toEqual(2)
  })

  test('Transaction is signed by the wallet app', async () => {
    expect(1).toEqual(2)
  })
})
