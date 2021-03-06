import {
  AddSurveyRepository
} from '~/data/protocols/db/survey/add-survey-repository'
import {
  LoadSurveyRepository
} from '~/data/protocols/db/survey/load-surveys-repository'
import { AddSurveyModelParams } from '~/domain/usecases/survey/add-survey'
import { MongoHelper } from '~/infra/db/mongodb/helpers/mongo-helper'
import { SurveyModel } from '~/domain/models/survey'
import {
  LoadSurveyByIdRepository
} from '~/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements
  AddSurveyRepository,
  LoadSurveyRepository,
  LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyModelParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()

    return MongoHelper.mapCollection(surveys)
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })

    return survey && MongoHelper.map(survey)
  }
}
