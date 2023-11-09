const app = require('../../server.js');
const UserModel = require('../../models/user');
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

describe('TI - 2 : Users', () => {
  describe('TI - 2.1 : Create USERS only ADMIN', () => {
    test("should respond with a 401 status code because Unauthorized without admin's token", async () => {
      const response = await request(app).post('/users').send({
        email: 'username@gmail.com',
        password: 'password'
      });
      expect(response.status).toBe(401);
    });
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
        .set('Authorization', `Bearer ${dataUser.token}`)
        .send(userdata);
      expect(response.status).toBe(200);
    });
  });
  describe('TI - 2.2 : Get USERS only ADMIN', () => {
    test('should respond with a 200 status code with admin account', async () => {
      const responseAdmin = await request(app)
        .post('/register')
        .send(adminUser);
      expect(responseAdmin.status).toBe(200);

      const responseLogin = await request(app).post('/login').send(adminUser);
      expect(responseLogin.status).toBe(200);
      dataUser = JSON.parse(responseLogin.text);

      const responsePost = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${dataUser.token}`)
        .send(userdata);
      expect(responsePost.status).toBe(200); // à revoir

      const response = await request(app)
        .get(`/users`)
        .set('Authorization', `Bearer ${dataUser.token}`);
      expect(response.status).toBe(200); // à revoir
    });
  });
  describe('TI - 2.3 : Get USER', () => {
    test('should respond with a 200 status code with admin account', async () => {
      const responseAdmin = await request(app)
        .post('/register')
        .send(adminUser);
      expect(responseAdmin.status).toBe(200);

      const responseLogin = await request(app).post('/login').send(adminUser);
      expect(responseLogin.status).toBe(200);
      dataUser = JSON.parse(responseLogin.text);

      const responsePost = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${dataUser.token}`)
        .send(userdata);
      expect(responsePost.status).toBe(200);

      const parseID = JSON.parse(responsePost.text);

      const response = await request(app)
        .get(`/users/${parseID.id}`)
        .set('Authorization', `Bearer ${dataUser.token}`);
      expect(response.status).toBe(200); // à revoir
    });
  });

  describe('TI - 2.4 : Patch USERS', () => {
    test('should respond with a 404 status code because id is missing', async () => {
      const response = await request(app).patch('/users').send(userdata);
      expect(response.status).toBe(404);
    });
    test('should respond with a 200 status code with admin account', async () => {
      const responseAdmin = await request(app)
        .post('/register')
        .send(adminUser);
      expect(responseAdmin.status).toBe(200);

      const responseLogin = await request(app).post('/login').send(adminUser);
      expect(responseLogin.status).toBe(200);
      dataUser = JSON.parse(responseLogin.text);

      const responsePost = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${dataUser.token}`)
        .send(userdata);
      expect(responsePost.status).toBe(200);
      const parseID = JSON.parse(responsePost.text);

      const response = await request(app)
        .patch(`/users/${parseID.id}`)
        .set('Authorization', `Bearer ${dataUser.token}`)
        .send({ ...userdata, username: 'test' });
      expect(response.status).toBe(200); // à revoir
    });
  });
  describe('TI - 2.5 : Delete USERS only ADMIN', () => {
    test('should respond with a 404 status code because id is missing', async () => {
      const response = await request(app).patch('/users').send(userdata);
      expect(response.status).toBe(404);
    });
    test('should respond with a 200 status code with admin account', async () => {
      const responseAdmin = await request(app)
        .post('/register')
        .send(adminUser);
      expect(responseAdmin.status).toBe(200);

      const responseLogin = await request(app).post('/login').send(adminUser);
      expect(responseLogin.status).toBe(200);
      dataUser = JSON.parse(responseLogin.text);

      const responsePost = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${dataUser.token}`)
        .send(userdata);
      expect(responsePost.status).toBe(200);

      const parseID = JSON.parse(responsePost.text);

      const response = await request(app)
        .delete(`/users/${parseID.id}`)
        .set('Authorization', `Bearer ${dataUser.token}`)
        .send({ ...userdata, username: 'test' });
      expect(response.status).toBe(200); // à revoir
    });
  });
});
