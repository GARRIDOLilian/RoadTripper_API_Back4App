const app = require('../../server.js');
const UserModel = require('../../models/user');
const request = require('supertest');

let dataUser;
const userdata = {
  email: 'username@gmail.com',
  username: 'username',
  password: 'password'
};

describe('TI -3 : Register / Login', () => {
  describe('TI – 3.1 : Register when the data is missing ', () => {
    test('should respond with a 400 status code because username is missing', async () => {
      const response = await request(app).post('/register').send({
        email: 'username@gmail.com',
        password: 'password'
      });
      expect(response.status).toBe(400);
    });
    test('should respond with a 400 status code because email is missing', async () => {
      const response = await request(app).post('/register').send({
        username: 'username',
        password: 'password'
      });
      expect(response.status).toBe(400);
    });
    test('should respond with a 400 status code because password is missing', async () => {
      const response = await request(app).post('/register').send({
        username: 'username',
        email: 'username@gmail.com'
      });
      expect(response.status).toBe(400);
    });
  });

  describe('TI – 3.2 : Register by given all data', () => {
    test('should respond with a 200 status code', async () => {
      const response = await request(app).post('/register').send(userdata);
      expect(response.status).toBe(200);
    });
    test('should respond with a 409 status code because user email is already exist', async () => {
      const regResponse = await request(app).post('/register').send(userdata);
      expect(regResponse.status).toBe(200);
      const response = await request(app).post('/register').send(userdata);
      expect(response.status).toBe(409);
    });
  });
  describe('TI – 3.3 : Login user after register', () => {
    test('should respond with a 200 status code ', async () => {
      const resgisterResponse = await request(app)
        .post('/register')
        .send(userdata);
      expect(resgisterResponse.status).toBe(200);
      const response = await request(app).post('/login').send({
        email: userdata.email,
        password: userdata.password
      });
      expect(response.text).toBeDefined();
      dataUser = JSON.parse(response.text);
      expect(response.status).toBe(200);
    });
  });

  describe('TI – 3.4 : Delete user after login but without token', () => {
    test('should respond with a 401 status code ', async () => {
      const resgisterResponse = await request(app)
        .post('/register')
        .send(userdata);
      expect(resgisterResponse.status).toBe(200);
      const loginResponse = await request(app).post('/login').send({
        email: userdata.email,
        password: userdata.password
      });
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.text).toBeDefined();
      dataUser = JSON.parse(loginResponse.text);
      expect(loginResponse.status).toBe(200);
      const response = await request(app).delete(`/users/${dataUser.user.id}`);
      expect(response.status).toBe(401);
    });
  });
  describe('TI – 3.5 : Delete user after login and get token', () => {
    test('should respond with a 200 status code ', async () => {
      const resgisterResponse = await request(app)
        .post('/register')
        .send(userdata);
      expect(resgisterResponse.status).toBe(200);
      const loginResponse = await request(app).post('/login').send({
        email: userdata.email,
        password: userdata.password
      });
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.text).toBeDefined();
      dataUser = JSON.parse(loginResponse.text);
      expect(loginResponse.status).toBe(200);
      const response = await request(app)
        .delete(`/users/${dataUser.user.id}`)
        .set('Authorization', `Bearer ${dataUser.token}`);
      expect(response.status).toBe(200);
    });
  });
});
