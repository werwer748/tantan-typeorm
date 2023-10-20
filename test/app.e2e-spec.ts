import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('AppController (e2e)', () => {
  let app: INestApplication

  //? beforeEach: 테스트를 진행하기 전에 가장 먼저 실행되는 함수
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  /*
   * test, it은 동일한 함수이다. 무엇을 쓰든 상관없단 소리임.
   * expect(2 + 2).toBe(5) 면 에러 => Expected: 5, Received: 4
   */
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('typeorm in nest, just coding')
  })
  /*
    ? describe: 테스트를 그룹화하는 함수 다시 말해 describe 단위로 테스트가 진행된다!
    describe('설명', () => {
      여기서 테스트 진행
      예를 들어 아래처럼 진행할 때
      return request(app.getHttpServer())
      => httpServer에 대해 요청을 할껀데~

      .get('/')
      => GET / 로 요청을 보낼꺼다.
      .expect(200)
      => 해당하는 결과값이 200 상태 코드를 가질것을 기대하고,
      .expect('typeorm in nest, just coding')
      => 해당하는 결과바디가 'typeorm in nest, just coding'을 가질것을 기대한다.
    })

    요청을 수행해본 결과에 따라 결과를 반환하는 것.
  */
  describe('hello jest', () => {
    test('two plus two is four', () => {
      expect(2 + 2).toBe(4)
    })
  })

  describe('/users', () => {
    it('/users (GET)', async () => {
      const res = await request(app.getHttpServer()).get('/users') //.expect(401) 이렇게도 가능하고
      expect(res.statusCode).toBe(401) // 이렇게도 가능
    })

    it('/users (POST)', async () => {
      const res = await request(app.getHttpServer()).post('/users').send({
        // send는 body에 데이터
        email: 'test@test.com',
        password: '1205',
        username: 'test',
      })

      expect(res.statusCode).toBe(401)
      // console.log(res.body)
    })

    it('/users/login (POST)', async () => {
      const res = await request(app.getHttpServer()).post('/users/login').send({
        email: 'test@test.com',
        password: '1205',
      })

      expect(res.statusCode).toBe(200)
    })
  })

  // it('/users/login (POST)', async () => {
  //   const res = await request(app.getHttpServer()).post('/users/login').send({
  //     email: 'test@amamov.com',
  //     password: '1205',
  //   })
  //   expect(res.statusCode).toBe(200) // 201
  //   console.log(res.headers)
  // })
})
