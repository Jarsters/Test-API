const responseHelper = require('../helpers/responseHelper');

const getAllKategori = async (request, h) => {
  const { prisma } = request.server.app;
  const kategori = await prisma.kategori.findMany({});
  return responseHelper(
    h,
    'success',
    'Data berhasil didapatkan',
    200,
    kategori,
  );
};

const getKategoriById = async (request, h) => {
  const { prisma } = request.server.app;
  const id = parseInt(request.params.id, 10);

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal mendapatkan kategori. Mohon isi id kategori.',
      400,
    );
  }

  const kategoriById = await prisma.kategori.findUnique({
    where: {
      id,
    },
  });

  if (kategoriById) {
    return responseHelper(
      h,
      'success',
      'Data berhasil didapatkan',
      200,
      kategoriById,
    );
  }

  return responseHelper(
    h,
    'failed',
    'Gagal mendapatkan kategori. Id tidak ditemukan.',
    404,
  );
};

const updateKategoriById = async (request, h) => {
  const { prisma } = request.server.app;
  const id = parseInt(request.payload.id, 10);
  const { name, title } = request.payload;

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui kategori. Mohon isi id kategori.',
      400,
    );
  }

  if (!name) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui kategori. Mohon isi name kategori.',
      400,
    );
  }

  if (!title) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui kategori. Mohon isi title kategori.',
      400,
    );
  }

  const now = new Date(Date.now());

  let updatedKategori;
  try {
    updatedKategori = await prisma.kategori.update({
      where: {
        id,
      },
      data: {
        title,
        updatedAt: now,
        updatedBy: name,
      },
    });
  } catch (e) {
    return responseHelper(
      h,
      'failed',
      'Gagal menghapus kategori. Id tidak ditemukan.',
      404,
    );
  }

  return responseHelper(
    h,
    'success',
    'Data berhasil diperbarui',
    200,
    updatedKategori,
  );
};

const deleteKategoriById = async (request, h) => {
  const { prisma } = request.server.app;
  const id = parseInt(request.payload.id, 10);

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal menghapus kategori. Mohon isi id kategori.',
      400,
    );
  }

  let deletedKategori;
  try {
    deletedKategori = await prisma.kategori.delete({
      where: {
        id,
      },
    });
  } catch (e) {
    return responseHelper(
      h,
      'failed',
      'Gagal menghapus kategori. Id tidak ditemukan.',
      404,
    );
  }
  return responseHelper(
    h,
    'success',
    'Data berhasil dihapus',
    200,
    deletedKategori,
  );
};

const addKategori = async (request, h) => {
  const { prisma } = request.server.app;
  const { title, authorId, updatedBy } = request.payload;

  if (!authorId) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan kategori. Mohon isi authorId.',
      400,
    );
  }

  if (!title) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan kategori. Mohon isi title kategori.',
      400,
    );
  }

  if (!updatedBy) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan kategori. Mohon isi nama user.',
      400,
    );
  }

  const createdKategori = await prisma.kategori.create({
    data: {
      title,
      authorId,
      updatedBy,
    },
  });

  return responseHelper(
    h,
    'success',
    'Data berhasil ditambahkan',
    201,
    createdKategori,
  );
};

module.exports = {
  getAllKategori,
  getKategoriById,
  updateKategoriById,
  deleteKategoriById,
  addKategori,
};
