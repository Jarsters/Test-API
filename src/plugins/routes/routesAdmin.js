const {
  addAdmin,
  getAllAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getImage,
} = require('../handlers/adminHandlers');
const { routesHelper, routesHelperStream } = require('../helpers/routesHelper');

const routesAdmin = [
  routesHelper('GET', '/admin', getAllAdmin),
  routesHelper('GET', '/admin/{id}', getAdminById),
  routesHelper('GET', '/admin/image/{name}', getImage),
  routesHelperStream('PUT', '/admin', updateAdmin),
  routesHelper('DELETE', '/admin', deleteAdmin),
  routesHelperStream('POST', '/admin', addAdmin),
];
module.exports = routesAdmin;
