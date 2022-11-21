const routesKategoriPost = require('./routes/routesKategoriPost');

const kategoriPostPlugin = {
  name: 'app/kategori_post',
  dependecies: ['prisma'],
  register: async function (server) {
    server.route(routesKategoriPost);
  },
};

module.exports = kategoriPostPlugin;
