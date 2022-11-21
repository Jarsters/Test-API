const routesKategori = require('./routes/routesKategori');

const kategoriPlugin = {
  name: 'app/kategori',
  dependecies: ['prisma'],
  register: async function (server) {
    server.route(routesKategori);
  },
};

module.exports = kategoriPlugin;
