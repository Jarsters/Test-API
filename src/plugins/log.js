const routesLog = require('./routes/routesLog');

const logPlugin = {
  name: 'app/log',
  dependecies: ['prisma'],
  register: async function (server) {
    server.route(routesLog);
  },
};

module.exports = logPlugin;
