const routesUser = require('./routes/routesUser');

const userPlugin = {
  name: 'app/user',
  dependecies: ['prisma'],
  register: async function (server) {
    server.route(routesUser);
  },
};

module.exports = userPlugin;
