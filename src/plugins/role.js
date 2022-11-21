const routesRole = require('./routes/routesRole');

const rolePlugin = {
  name: 'app/role',
  dependecies: ['prisma'],
  register: async function (server) {
    server.route(routesRole);
  },
};

module.exports = rolePlugin;
