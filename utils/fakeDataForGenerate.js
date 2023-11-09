const dataSet = {
  report: {
    from: {
      city: 'Toulouse'
    },
    to: {
      city: 'Montauban',
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
        Bars: []
      }
    },
    waypoints: [
      {
        city: 'Grenade',
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
          ]
        }
      },
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
      last_name: 'MacQueen',
      first_name: 'Johnny'
    }
  }
};
export default dataSet;
