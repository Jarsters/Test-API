const {
  getKategoriForum,
  getKategoriForumById,
  addKategoriForum,
} = require('../handlers/kategoriForumHandlers');
const { routesHelper } = require('../helpers/routesHelper');

const routesKategoriForum = [
  routesHelper('GET', '/kategori_forum', getKategoriForum),
  routesHelper('GET', '/kategori_forum/{id}', getKategoriForumById),
  routesHelper('POST', '/kategori_forum', addKategoriForum),
];

module.exports = routesKategoriForum;
