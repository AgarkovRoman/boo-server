import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { AuthDto } from '../src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();
const notExistProductId = new Types.ObjectId().toHexString();
const testReviewDto: CreateReviewDto = {
  name: 'Test',
  title: 'Заголовок',
  description: 'Описание',
  rating: 5,
  productId,
};

const loginDto: AuthDto = {
  login: 'test@re.ru',
  password: 'Test!123',
};

describe('ReviewController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('auth/login')
      .send(loginDto);
    // console.log('access: ', body);
    token = body.access_token;
  });

  afterAll(() => {
    disconnect();
  });

  it('/review/create (POST) - fail', () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send({ ...testReviewDto, rating: 6 })
      .expect(400);
  });

  it('/review/create (POST) - success', async (done) => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send(testReviewDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
        done();
      });
  });

  it('/review/byProduct/:productId (GET) - success', async (done) => {
    return request(app.getHttpServer())
      .get('/review/byProduct/' + productId)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body).toHaveLength(1);
        done();
      });
  });

  it('/review/byProduct/:productId (GET) - fail', async (done) => {
    return request(app.getHttpServer())
      .get('/review/byProduct/' + notExistProductId)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body).toHaveLength(0);
        done();
      });
  });

  it('/review/:id (DELETE) - success', async (done) => {
    return (
      request(app.getHttpServer())
        .delete('/review/' + createdId)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then(({ body }: request.Response) => {
          expect(body._id).toBeDefined();
          done();
        })
    );
  });

  it('/review/:id (DELETE) - fail', async () => {
    return (
      request(app.getHttpServer())
        .delete('/review/' + notExistProductId)
        .set('Authorization', 'Bearer ' + token)
        .expect(404, {
          statusCode: 404,
          message: REVIEW_NOT_FOUND,
        })
    );
  });
});
