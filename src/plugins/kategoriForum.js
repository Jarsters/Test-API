const routesKategoriForum = require('./routes/routesKategoriForum');

const kategoriForumPlugin = {
  name: 'app/kategori_forum',
  dependecies: ['prisma'],
  register: async function (server) {
    server.route(routesKategoriForum);
  },
};

module.exports = kategoriForumPlugin;
