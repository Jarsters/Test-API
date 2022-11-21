const responseHelper = require('../helpers/responseHelper');

const getKomentarPost = async (request, h) => {
  const { prisma } = request.server.app;
  const komentarPost = await prisma.komentarPost.findMany({});
  return responseHelper(
    h,
    'success',
    'Data berhasil didapatkan',
    200,
    komentarPost,
  );
};

const getKomentarPostById = async (request, h) => {
  const { prisma } = request.server.app;
  const { id } = request.params;

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal mendapatkan komentar post. Mohon isi id komentar post',
      400,
    );
  }

  const komentarPostById = await prisma.komentarPost.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (komentarPostById) {
    return responseHelper(
      h,
      'success',
      'Data berhasil didapatkan',
      200,
      komentarPostById,
    );
  }

  return responseHelper(
    h,
    'failed',
    'Gagal mendapatkan komentar post. Id tidak ditemukan.',
    404,
  );
};

const updateKomentarPost = async (request, h) => {
  const { prisma } = request.server.app;
  const id = parseInt(request.payload.id, 10);
  const { content } = request.payload;

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui komentar post. Mohon isi id komentar post.',
      400,
    );
  }

  if (!content) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui komentar post. Mohon isi konten komentar post.',
      400,
    );
  }

  const now = new Date(Date.now());

  let updatedKomentarPost;
  try {
    updatedKomentarPost = await prisma.komentarPost.update({
      where: {
        id,
      },
      data: {
        content,
        updatedAt: now,
      },
    });
  } catch (e) {
    return responseHelper(
      h,
      'failed',
      'Gagal menghapus komentar post. Id tidak ditemukan.',
      404,
    );
  }

  return responseHelper(
    h,
    'success',
    'Data berhasil diperbarui',
    200,
    updatedKomentarPost,
  );
};

const deleteKomentarPost = async (request, h) => {
  const { prisma } = request.server.app;
  const id = parseInt(request.payload.id, 10);

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal menghapus komentar post. Mohon isi id komentar post.',
      400,
    );
  }

  let deletedKomentarPost;
  try {
    deletedKomentarPost = await prisma.komentarPost.delete({
      where: {
        id,
      },
    });
  } catch (e) {
    return responseHelper(
      h,
      'failed',
      'Gagal menghapus komentar post. Id tidak ditemukan.',
      404,
    );
  }

  return responseHelper(
    h,
    'success',
    'Data berhasil dihapus',
    200,
    deletedKomentarPost,
  );
};

const addKomentarPost = async (request, h) => {
  const { prisma } = request.server.app;
  const { content, authorId, postId } = request.payload;

  if (!authorId) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan komentar post. Mohon isi authorId.',
      400,
    );
  }

  if (!content) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan komentar post. Mohon isi konten komentar post.',
      400,
    );
  }

  if (!postId) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan komentar post. Mohon isi postId.',
      400,
    );
  }

  const createdKomentarPost = await prisma.komentarPost.create({
    data: {
      content,
      authorId,
      postId,
    },
  });

  return responseHelper(
    h,
    'success',
    'Data berhasil ditambahkan',
    201,
    createdKomentarPost,
  );
};

module.exports = {
  getKomentarPost,
  getKomentarPostById,
  updateKomentarPost,
  deleteKomentarPost,
  addKomentarPost,
};
