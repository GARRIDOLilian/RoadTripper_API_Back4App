const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, DBURL } = process.env;

const dataURI = {
  dev: DBURL,
  production: DBURL
};
module.exports = {
  url: dataURI[process.env.NODE_ENV]
};
