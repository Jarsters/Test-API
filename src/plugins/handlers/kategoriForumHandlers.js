const responseHelper = require('../helpers/responseHelper');

const getKategoriForum = async (request, h) => {
  const { prisma } = request.server.app;
  const kategoriForum = await prisma.kategoriForum.findMany({});
  return responseHelper(
    h,
    'success',
    'Data berhasil didapatkan',
    200,
    kategoriForum,
  );
};

const getKategoriForumById = async (request, h) => {
  const { prisma } = request.server.app;
  const { id } = request.params;

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal mendapatkan kategori forum. Mohon isi id kategori forum',
      400,
    );
  }

  const kategoriForumById = await prisma.kategoriForum.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (kategoriForumById) {
    return responseHelper(
      h,
      'success',
      'Data berhasil didapatkan',
      200,
      kategoriForumById,
    );
  }

  return responseHelper(
    h,
    'failed',
    'Gagal mendapatkan kategori forum. Id tidak ditemukan.',
    404,
  );
};

const addKategoriForum = async (request, h) => {
  const { prisma } = request.server.app;
  const { forumId, kategoriId } = request.payload;

  if (!forumId) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan kategori forum. Mohon isi id kategori forum',
      400,
    );
  }

  if (!kategoriId) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan kategori forum. Mohon isi id kategori',
      400,
    );
  }

  const createdKategoriForum = await prisma.kategoriForum.create({
    data: {
      forumId,
      kategoriId,
    },
  });

  return responseHelper(
    h,
    'success',
    'Forum berhasil ditambahkan',
    201,
    createdKategoriForum,
  );
};

module.exports = { getKategoriForum, getKategoriForumById, addKategoriForum };
