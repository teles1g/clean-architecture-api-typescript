import { Collection, MongoClient } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as String,

  async connect (uri: string): Promise<void> {
    this.uri = uri

    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect (): Promise<void> {
    this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri)
    }

    return this.client.db().collection(name)
  },

  map: (collection: any): AccountModel => {
    const { _id, ...collectionWithoutId } = collection

    return Object.assign({}, collectionWithoutId, { id: _id })
  }
}
