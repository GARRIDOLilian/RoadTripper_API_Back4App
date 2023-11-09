const app = require('../../server.js');
const request = require('supertest');

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
    waypoints: [
      {
        city: 'Grenade',
        point: {
          lon: 1.4,
          lat: 44.3
        },
        activities: {
          Restaurants: [
            {
              name: 'Calispso',
              dist: 35.61160726,
              point: {
                lon: 1.3545620441436768,
                lat: 44.01752853393555
              }
            }
          ],
          Events: [
            {
              name: 'Desto',
              dist: 35.61160726,
              point: {
                lon: 1.3545620441436768,
                lat: 44.01752853393555
              }
            }
          ],
          Accommodations: [],
          Transports: [],
          Bars: [
            {
              name: 'Gariddo',
              dist: 35.61160726,
              point: {
                lon: 1.3545620441436768,
                lat: 44.01752853393555
              }
            }
          ],
          Culturals: [],
          Sports: []
        }
      },
      {
        city: 'Castelsarrazin',
        point: {
          lon: 1.25,
          lat: 44.5
        },
        activities: {
          Restaurants: [
            {
              name: 'Couille de loup',
              dist: 35.61160726,
              point: {
                lon: 1.3545620441436768,
                lat: 44.01752853393555
              }
            }
          ],
          Events: [],
          Accommodations: [],
          Transports: [
            {
              name: 'Poirier',
              dist: 35.61160726,
              point: {
                lon: 1.3545620441436768,
                lat: 44.01752853393555
              }
            }
          ],
          Bars: [
            {
              name: 'Thomas',
              dist: 35.61160726,
              point: {
                lon: 1.3545620441436768,
                lat: 44.01752853393555
              }
            }
          ],
          Culturals: [],
          Sports: []
        }
      }
    ],
    start_date: '1 juillet 2022',
    end_date: '16 juillet 2022',
    user: {
      usename: 'Username'
    }
  }
};

const dataSetError = {
  reports: {
    from: {
      city: 'Toulouse'
    },
    to: {
      city: 'Montauban'
    },
    waypoints: [
      {
        city: 'Castelsarrazin',
        activities: {
          Restaurants: [
            {
              name: 'Couille de loup',
              dist: 35.61160726,
              point: {
                lon: 1.3545620441436768,
                lat: 44.01752853393555
              }
            }
          ],
          Events: [],
          Accommodations: [],
          Transports: [
            {
              name: 'Poirier',
              dist: 35.61160726,
              point: {
                lon: 1.3545620441436768,
                lat: 44.01752853393555
              }
            }
          ],
          Bars: [
            {
              name: 'Thomas',
              dist: 35.61160726,
              point: {
                lon: 1.3545620441436768,
                lat: 44.01752853393555
              }
            }
          ]
        }
      }
    ],
    start_date: '1 juillet 2022',
    end_date: '16 juillet 2022',
    user: {
      usename: 'Username'
    }
  }
};
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

describe('TU - 1 : Generate', () => {
  describe('TU - 1.0 : Create USERS only ADMIN', () => {
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
  describe('TU - 1.1 : Generate report road trip', () => {
    test('Should respond with a 401 because no token existing', async () => {
      const response = await request(app).post('/generate').send(dataSet);
      expect(response.status).toBe(401);
    });
    test("should respond with a 200 status code because have the user's token ", async () => {
      const response = await request(app)
        .post('/generate')
        .set('Authorization', `Bearer ${dataUser.token}`)
        .send(dataSet);
      expect(response.status).toBe(200);
      expect(typeof response.text).toBe('string');
      expect(JSON.parse(response.text).type).toBe('Buffer');
    });
  });
  describe('TU - 1.2 : Get error when key report is not defined from road trip body', () => {
    test("Should respond with a 500 because body doesn't have ek key activities for 'to'", async () => {
      const response = await request(app)
        .post('/generate')
        .set('Authorization', `Bearer ${dataUser.token}`)
        .send({ reports: { ...dataSetError.project } });
      expect(response.status).toBe(500);
    });
  });
  describe('TU - 1.3 : Get error when key report is not defined on report road trip body', () => {
    test("should respond with a 500 status code because any value in key 'to' exists", async () => {
      const response = await request(app)
        .post('/generate')
        .set('Authorization', `Bearer ${dataUser.token}`)
        .send({ report: { ...dataSetError, to: {} } });
      expect(response.status).toBe(500);
    });
  });
});
