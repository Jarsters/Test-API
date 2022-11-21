const responseHelper = require('../helpers/responseHelper');

const getKomentarForum = async (request, h) => {
  const { prisma } = request.server.app;
  const komentarForum = await prisma.komentarForum.findMany({});
  return responseHelper(
    h,
    'success',
    'Data berhasil didapatkan',
    200,
    komentarForum,
  );
};

const getKomentarForumById = async (request, h) => {
  const { prisma } = request.server.app;
  const { id } = request.params;

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal mendapatkan komentar forum. Mohon isi id komentar forum',
      400,
    );
  }

  const komentarForumById = await prisma.komentarForum.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (komentarForumById) {
    return responseHelper(
      h,
      'success',
      'Data berhasil didapatkan',
      200,
      komentarForumById,
    );
  }

  return responseHelper(
    h,
    'failed',
    'Gagal mendapatkan komentar forum. Id tidak ditemukan.',
    404,
  );
};

const updateKomentarForum = async (request, h) => {
  const { prisma } = request.server.app;
  const id = parseInt(request.payload.id, 10);
  const { content } = request.payload;

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui komentar forum. Mohon isi id komentar forum.',
      400,
    );
  }

  if (!content) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui komentar forum. Mohon isi konten komentar forum.',
      400,
    );
  }

  const now = new Date(Date.now());

  let updatedKomentarForum;

  try {
    updatedKomentarForum = await prisma.komentarForum.update({
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
      'Gagal menghapus komentar forum. Id tidak ditemukan.',
      404,
    );
  }

  return responseHelper(
    h,
    'success',
    'Data berhasil diperbarui',
    200,
    updatedKomentarForum,
  );
};

const deleteKomentarForum = async (request, h) => {
  const { prisma } = request.server.app;
  const id = parseInt(request.payload.id, 10);

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal menghapus komentar forum. Mohon isi id komentar forum.',
      400,
    );
  }

  let deletedKomentarForum;

  try {
    deletedKomentarForum = await prisma.komentarForum.delete({
      where: {
        id,
      },
    });
  } catch (e) {
    return responseHelper(
      h,
      'failed',
      'Gagal menghapus komentar forum. Id tidak ditemukan.',
      404,
    );
  }

  return responseHelper(
    h,
    'success',
    'Data berhasil dihapus',
    200,
    deletedKomentarForum,
  );
};

const addKomentarForum = async (request, h) => {
  const { prisma } = request.server.app;
  const { content, authorId, forumId } = request.payload;

  if (!authorId) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan komentar forum. Mohon isi authorId.',
      400,
    );
  }

  if (!content) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan komentar forum. Mohon isi konten komentar forum.',
      400,
    );
  }

  if (!forumId) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan komentar forum. Mohon isi forumId.',
      400,
    );
  }

  const createdKomentarForum = await prisma.komentarForum.create({
    data: {
      content,
      authorId,
      forumId,
    },
  });

  return responseHelper(
    h,
    'success',
    'Data berhasil ditambahkan',
    201,
    createdKomentarForum,
  );
};

module.exports = {
  getKomentarForum,
  getKomentarForumById,
  updateKomentarForum,
  deleteKomentarForum,
  addKomentarForum,
};
