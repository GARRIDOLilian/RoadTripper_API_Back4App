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

describe('TI - 1: Places', () => {
  describe('TI - 1.1 : Get places by name', () => {
    test('should respond with a 200 status code with object response', async () => {
      const response = await request(app)
        .post('/places')
        .send({ city: 'Paris' });
      const result = JSON.parse(response.text);
      expect(response.status).toBe(200);
      expect(typeof result.places).toBe('object');
    });
  });
  describe('TI - 1.2 : Get details place', () => {
    test('should respond with a 200 status code when search Paris like city', async () => {
      const response = await request(app)
        .post('/places/details')
        .send({ xid: 'N191031796' });
      const result = JSON.parse(response.text);
      expect(response.status).toBe(200);
      expect(result.details).toBeDefined();
    });
  });
  describe('TI - 1.3 : Get place coordinates', () => {
    test('should respond with a 200 status code when search Paris like city', async () => {
      const response = await request(app)
        .post('/places/coordinates')
        .send({
          points: [
            {
              coordinates: ['2.387216', '48.8513345']
            }
          ],

          filters:
            'restaurants,accomodations,transport,bars,amusements,cultural'
        });
      const result = JSON.parse(response.text);

      expect(response.status).toBe(200);
      expect(result.places).toBeDefined();
    });
  });
});
