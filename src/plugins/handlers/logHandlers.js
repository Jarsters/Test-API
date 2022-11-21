const responseHelper = require('../helpers/responseHelper');

const getAllLogOrderByIdDescending = async (request, h) => {
  const { prisma } = request.server.app;
  const log = await prisma.log.findMany({
    orderBy: {
      id: 'desc',
    },
  });
  return responseHelper(h, 'success', 'Data berhasil didapatkan', 200, log);
};

module.exports = {
  getAllLogOrderByIdDescending,
};
