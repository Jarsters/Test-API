const routesKomentarPost = require('./routes/routesKomentarPost');

const komentarPostPlugin = {
  name: 'app/komentar_post',
  dependecies: ['prisma'],
  register: async function (server) {
    server.route(routesKomentarPost);
  },
};

module.exports = komentarPostPlugin;
