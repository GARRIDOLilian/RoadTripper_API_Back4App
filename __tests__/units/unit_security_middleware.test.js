const app = require('../../server.js');
const request = require('supertest');

let dataUser;
const userdata = {
  email: 'username@gmail.com',
  username: 'username',
  password: 'password'
};
const adminUser = {
  email: 'admin@gmail.com',
  username: 'admin',
  password: 'admin',
  role: 'ADMIN'
};

const FakeToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzNDU2Nzg5LCJuYW1lIjoiSm9zZXBoIn0.OpOSSw7e485LOP5PrzScxHb7SR6sAOMRckfFwi4rp7o';
describe('TU - 2 : Security', () => {
  describe('TU - 2.1 : Get error on protected route with fake token', () => {
    test("should respond with a 200 status code because have the admin's token ", async () => {
      const responseAdmin = await request(app)
        .post('/register')
        .send(adminUser);
      expect(responseAdmin.status).toBe(200);

      const responseLogin = await request(app).post('/login').send(adminUser);
      expect(responseLogin.status).toBe(200);
      dataUser = JSON.parse(responseLogin.text);

      const response = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${FakeToken}`)
        .send(userdata);
      expect(response.status).toBe(401);
    });
  });
  describe('TU - 2.2 : Get error on protected route', () => {
    test('Should respond with a 401 because user connected is unauthorized because the token no correspond to id', async () => {
      const response = await request(app).post('/register').send(userdata);
      expect(response.status).toBe(200);

      const responseLogin = await request(app).post('/login').send(userdata);
      expect(responseLogin.status).toBe(200);
      dataUser = JSON.parse(responseLogin.text);
      const responseGetError = await request(app)
        .get(`/users`)
        .set('Authorization', `Bearer ${dataUser.token}`);
      expect(responseGetError.status).toBe(401);
    });
  });
  describe('TU - 2.3 : Get error on protected route', () => {
    test('should respond with a 404 status code because header request not set ', async () => {
      const response = await request(app)
        .get(`/users`)
        .set('Authorizati', `Bear ${dataUser.token}`);
      expect(response.status).toBe(401);
    });
  });
});
