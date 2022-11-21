const { getAllLogOrderByIdDescending } = require('../handlers/logHandlers');
const { routesHelper } = require('../helpers/routesHelper');

const routesLog = [routesHelper('GET', '/log', getAllLogOrderByIdDescending)];
module.exports = routesLog;
