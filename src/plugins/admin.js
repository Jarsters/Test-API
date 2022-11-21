const routesAdmin = require('./routes/routesAdmin');

const adminPlugin = {
  name: 'app/admin',
  dependecies: ['prisma'],
  register: async function (server) {
    server.route(routesAdmin);
  },
};

module.exports = adminPlugin;
