const {
  getAllKategori,
  getKategoriById,
  addKategori,
  updateKategoriById,
  deleteKategoriById,
} = require('../handlers/kategoriHandlers');
const { routesHelper } = require('../helpers/routesHelper');

const routesKategori = [
  routesHelper('GET', '/categories', getAllKategori),
  routesHelper('GET', '/categories/{id}', getKategoriById),
  routesHelper('PUT', '/categories', updateKategoriById),
  routesHelper('DELETE', '/categories', deleteKategoriById),
  routesHelper('POST', '/categories', addKategori),
];

module.exports = routesKategori;
