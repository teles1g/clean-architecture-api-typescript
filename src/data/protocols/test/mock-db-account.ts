import {
  AddAccountRepository
} from '~/data/protocols/db/account/add-account-repository'
import {
  LoadAccountByEmailRepository
} from '~/data/protocols/db/account/load-account-by-email-repository'
import {
  LoadAccountByTokenRepository
} from '~/data/protocols/db/account/load-account-by-token-repository'
import {
  UpdateAccessTokenRepository
} from '~/data/protocols/db/account/update-access-token-repository'
import { AddAccountModelParams } from '~/domain/usecases/account/add-account'
import { AccountModel } from '~/domain/models/account'
import { mockAccountModel } from '~/domain/test'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModelParams): Promise<AccountModel> {
      const fakeAccount = mockAccountModel()

      return await new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(mockAccountModel()))
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(mockAccountModel()))
    }
  }

  return new LoadAccountByTokenRepositoryStub()
}

export const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAcessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }

  return new UpdateAcessTokenRepositoryStub()
}
