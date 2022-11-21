const routesKomentarForum = require('./routes/routesKomentarForum');

const komentarForumPlugin = {
  name: 'app/komentar_forum',
  dependecies: ['prisma'],
  register: async function (server) {
    server.route(routesKomentarForum);
  },
};

module.exports = komentarForumPlugin;
