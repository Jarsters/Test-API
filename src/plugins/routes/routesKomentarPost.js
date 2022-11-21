const {
  getKomentarPost,
  getKomentarPostById,
  addKomentarPost,
  deleteKomentarPost,
  updateKomentarPost,
} = require('../handlers/komentarPostHandlers');
const { routesHelper } = require('../helpers/routesHelper');

const routesKomentarPost = [
  routesHelper('GET', '/komentar_post', getKomentarPost),
  routesHelper('GET', '/komentar_post/{id}', getKomentarPostById),
  routesHelper('PUT', '/komentar_post', updateKomentarPost),
  routesHelper('DELETE', '/komentar_post', deleteKomentarPost),
  routesHelper('POST', '/komentar_post', addKomentarPost),
];

module.exports = routesKomentarPost;
