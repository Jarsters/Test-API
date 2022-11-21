const routesForum = require('./routes/routesForum');

const forumPlugin = {
  name: 'app/forum',
  dependecies: ['prisma'],
  register: async function (server) {
    server.route(routesForum);
  },
};

module.exports = forumPlugin;
