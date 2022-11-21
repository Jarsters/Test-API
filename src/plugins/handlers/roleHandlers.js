const responseHelper = require('../helpers/responseHelper');

const getRole = async (request, h) => {
  const { prisma } = request.server.app;
  const role = await prisma.role.findMany({});
  return responseHelper(h, 'success', 'Data berhasil didapatkan', 200, role);
};

const getRoleById = async (request, h) => {
  const { prisma } = request.server.app;
  const { id } = request.params;

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal mendapatkan role. Mohon isi id role.',
      400,
    );
  }

  const roleById = await prisma.role.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!roleById) {
    return responseHelper(
      h,
      'fail',
      'Gagal mendapatkan data role. Id tidak ditemukan',
      404,
    );
  }

  return responseHelper(
    h,
    'success',
    'Data berhasil didapatkan',
    200,
    roleById,
  );
};

const addRole = async (request, h) => {
  const { prisma } = request.server.app;
  const { role } = request.payload;

  if (!role) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan role. Mohon isi nama role',
      400,
    );
  }

  const createdRole = await prisma.role.create({
    data: {
      role,
    },
  });

  return responseHelper(h, 'success', 'Forum berhasil ditambahkan', 201, {
    createdRole,
  });
};

module.exports = { getRole, getRoleById, addRole };
