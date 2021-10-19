import { LoadSurveysController } from './load-surveys-controller'
import { SurveyModel, LoadSurveys } from './load-surveys-protocols'
import MockDate from 'mockdate'

const makeFakeSurveys = (): SurveyModel[] => {
  return [{
    id: 'any_id',
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }, {
    id: 'other_id',
    question: 'other_question',
    answers: [{
      image: 'other_image',
      answer: 'other_answer'
    }],
    date: new Date()
  }]
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveys ', async () => {
    class LoadSurveyStub implements LoadSurveys {
      async load (): Promise<SurveyModel[]> {
        return await new Promise(resolve => resolve(makeFakeSurveys()))
      }
    }

    const loadSurveyStub = new LoadSurveyStub()
    const loadSpy = jest.spyOn(loadSurveyStub, 'load')

    const sut = new LoadSurveysController(loadSurveyStub)

    await sut.handle({})

    expect(loadSpy).toHaveBeenCalled()
  })
})