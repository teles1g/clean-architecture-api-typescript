import {
  Hasher,
  AddAccountModelParams,
  AccountModel,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import {
  throwError,
  mockAccountModel,
  mockAddAccountParams
} from '~/domain/test'
import { mockHasher, mockLoadAccountByEmailRepository } from '~/data/test'

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModelParams): Promise<AccountModel> {
      const fakeAccount = mockAccountModel()

      return await Promise.resolve(fakeAccount)
    }
  }

  return new AddAccountRepositoryStub()
}

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()

  jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValue(
    Promise.resolve(null)
  )

  const hasherStub = mockHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()

  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  )

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()

    const hashertSpy = jest.spyOn(hasherStub, 'hash')

    const accountData = mockAddAccountParams()

    await sut.add(accountData)

    expect(hashertSpy).toHaveBeenLastCalledWith('any_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()

    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(throwError)

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const accountData = mockAddAccountParams()

    await sut.add(accountData)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(throwError)

    const accountData = mockAddAccountParams()

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()

    const accountData = mockAddAccountParams()

    const account = await sut.add(accountData)

    expect(account).toEqual(mockAccountModel())
  })

  test('Should return null if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
      Promise.resolve(mockAccountModel())
    )

    const accountData = mockAddAccountParams()

    const account = await sut.add(accountData)

    expect(account).toBe(null)
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.add(mockAddAccountParams())

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
