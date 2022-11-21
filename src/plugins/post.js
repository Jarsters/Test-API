const routesPost = require('./routes/routesPost');

const postPlugin = {
  name: 'app/post',
  dependecies: ['prisma'],
  register: async function (server) {
    server.route(routesPost);
  },
};

module.exports = postPlugin;
