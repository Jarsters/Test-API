const {
  getUser,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  getImage,
} = require('../handlers/userHandlers');
const { routesHelper, routesHelperStream } = require('../helpers/routesHelper');

const routesUser = [
  routesHelper('GET', '/user', getUser),
  routesHelper('GET', '/user/{id}', getUserById),
  routesHelper('GET', '/user/image/{name}', getImage),
  routesHelperStream('PUT', '/user', updateUser),
  routesHelper('DELETE', '/user', deleteUser),
  routesHelperStream('POST', '/user', addUser),
];
module.exports = routesUser;
