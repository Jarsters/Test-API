const responseHelper = require('../helpers/responseHelper');

const getKategoriPost = async (request, h) => {
  const { prisma } = request.server.app;
  const kategoriPost = await prisma.kategoriPost.findMany({});
  return responseHelper(
    h,
    'success',
    'Data berhasil didapatkan',
    200,
    kategoriPost,
  );
};

const getKategoriPostById = async (request, h) => {
  const { prisma } = request.server.app;
  const { id } = request.params;

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal mendapatkan kategori post. Mohon isi id kategori post',
      400,
    );
  }

  const kategoriPostById = await prisma.kategoriPost.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (kategoriPostById) {
    return responseHelper(
      h,
      'success',
      'Data berhasil didapatkan',
      200,
      kategoriPostById,
    );
  }

  return responseHelper(
    h,
    'failed',
    'Gagal mendapatkan kategori post. Id tidak ditemukan.',
    404,
  );
};

const addKategoriPost = async (request, h) => {
  const { prisma } = request.server.app;
  const { postId, kategoriId } = request.payload;

  if (!postId) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan kategori post. Mohon isi id kategori post',
      400,
    );
  }

  if (!kategoriId) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan kategori post. Mohon isi id kategori',
      400,
    );
  }

  const createdKategoriPost = await prisma.kategoriPost.create({
    data: {
      postId,
      kategoriId,
    },
  });

  return responseHelper(
    h,
    'success',
    'Forum berhasil ditambahkan',
    201,
    createdKategoriPost,
  );
};

module.exports = { getKategoriPost, getKategoriPostById, addKategoriPost };
