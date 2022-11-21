const {
  getKomentarForum,
  getKomentarForumById,
  addKomentarForum,
  updateKomentarForum,
  deleteKomentarForum,
} = require('../handlers/komentarForumHandlers');
const { routesHelper } = require('../helpers/routesHelper');

const routesKomentarForum = [
  routesHelper('GET', '/komentar_forum', getKomentarForum),
  routesHelper('GET', '/komentar_forum/{id}', getKomentarForumById),
  routesHelper('PUT', '/komentar_forum', updateKomentarForum),
  routesHelper('DELETE', '/komentar_forum', deleteKomentarForum),
  routesHelper('POST', '/komentar_forum', addKomentarForum),
];

module.exports = routesKomentarForum;
