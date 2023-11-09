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
const dataSet = {
  report: {
    from: {
      city: 'Toulouse',
      point: {
        lon: 1.444247,
        lat: 43.604462
      }
    },
    to: {
      city: 'Montauban',
      point: {
        lon: 1.354999,
        lat: 44.017584
      },
      activities: {
        Restaurants: [
          {
            name: 'Le monde des merveilles',
            dist: 35.61160726,
            point: {
              lon: 1.3545620441436768,
              lat: 44.01752853393555
            }
          }
        ],
        Events: [
          {
            name: 'Léal',
            dist: 35.61160726,
            point: {
              lon: 1.3545620441436768,
              lat: 44.01752853393555
            }
          }
        ],
        Accommodations: [],
        Transports: [],
        Bars: [],
        Culturals: [],
        Sports: []
      }
    },
    waypoints: [],
    start_date: '1 juillet 2022',
    end_date: '16 juillet 2022',
    user: {
      usename: 'Username'
    }
  }
};
let idTrip;

describe('TI - 4: Trip', () => {
  describe('TI - 4.1 : Post trip with token', () => {
    test('should respond with a 200 status code with object response', async () => {
      const response = await request(app).post('/register').send(userdata);
      expect(response.status).toBe(200);
      const responseLogin = await request(app).post('/login').send(userdata);
      expect(responseLogin.status).toBe(200);
      dataUser = JSON.parse(responseLogin.text);
      const responseTrip = await request(app)
        .post('/trip')
        .set('Authorization', `Bearer ${dataUser.token}`)
        .send({ report: { ...dataSet.report, user: dataUser.id } });

      expect(responseTrip.status).toBe(200);
    });
  });
  describe('TI - 4.2 : Post trip without token', () => {
    test('should respond with a 401 status code because no token', async () => {
      const responseTrip = await request(app)
        .post('/trip')

        .send({ report: { ...dataSet.report, user: dataUser.id } });
      //   const result = JSON.parse(responseTrip.text);
      expect(responseTrip.status).toBe(401);
    });
  });
  describe('TI - 4.3 : Get trips by user id', () => {
    test('should respond with a 200 status code with object response', async () => {
      const response = await request(app).post('/register').send(userdata);
      expect(response.status).toBe(200);
      const responseLogin = await request(app).post('/login').send(userdata);
      expect(responseLogin.status).toBe(200);
      dataUser = JSON.parse(responseLogin.text);
      console.log(dataUser);
      const responseTrip = await request(app)
        .post('/trip')
        .set('Authorization', `Bearer ${dataUser.token}`)
        .send({ report: { ...dataSet.report, user: dataUser.id } });

      expect(responseTrip.status).toBe(200);
      const res = await request(app)
        .get(`/trip/${dataUser.user.id}`)
        .set('Authorization', `Bearer ${dataUser.token}`);

      expect(res.status).toBe(200);
    });
  });
});
