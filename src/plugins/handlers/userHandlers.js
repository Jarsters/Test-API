const responseHelper = require('../helpers/responseHelper');
const {
  validateImageExtension,
  deleteSavedImage,
  saveImage,
} = require('../helpers/saveImageHelper');

const getUser = async (request, h) => {
  const { prisma } = request.server.app;
  const user = await prisma.user.findMany({
    where: {
      roleId: 2,
    },
  });
  return responseHelper(h, 'success', 'Data berhasil didapatkan', 200, user);
};

const getUserById = async (request, h) => {
  const { prisma } = request.server.app;
  const { id } = request.params;

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal mendapatkan user. Mohon isi id user.',
      400,
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (user) {
    return responseHelper(h, 'success', 'Data berhasil didapatkan', 200, user);
  }

  return responseHelper(
    h,
    'failed',
    'Gagal mendapatkan data user. Id tidak ditemukan',
    404,
  );
};

const addUser = async (request, h) => {
  const { prisma } = request.server.app;
  const { name, email, image } = request.payload;

  let dataImage;

  if (!name) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan user. Mohon isi nama user',
      400,
    );
  }

  if (!email) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan user. Mohon isi email user',
      400,
    );
  }

  const check = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (check) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan user. Email user sudah ada',
      400,
    );
  }

  if (validateImageExtension(image)) {
    if (image.hapi.filename) {
      dataImage = await saveImage(image, 'user');
    }
  } else {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan gambar. Mohon memberikan gambar dengan ekstensi [jpg, jpeg, atau png]',
      400,
    );
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      image_large: dataImage?.data.large,
      image_small: dataImage?.data.small,
      roleId: 2,
    },
  });

  return responseHelper(h, 'success', 'User berhasil ditambahkan', 201, user);
};

const updateUser = async (request, h) => {
  const { prisma } = request.server.app;
  const { name, email, oldImage, newImage } = request.payload;

  if (!name) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui user. Mohon isi nama user',
      400,
    );
  }

  if (!email) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui user. Mohon isi email user',
      400,
    );
  }

  const userNow = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!userNow) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui user. Email tidak ditemukan',
      404,
    );
  }

  let image_large = userNow.image_large;
  let image_small = userNow.image_small;

  if (oldImage !== newImage.hapi.filename) {
    deleteSavedImage(image_large, image_small);

    const dataImage = saveImage(newImage, 'user');
    image_large = dataImage.data.large;
    image_small = dataImage.data.small;
  }

  const now = new Date(Date.now());

  const user = await prisma.user.update({
    where: {
      email,
    },
    data: {
      name,
      image_large,
      image_small,
      updatedAt: now,
    },
  });

  return responseHelper(h, 'success', 'User berhasil diperbarui', 200, user);
};

const deleteUser = async (request, h) => {
  const { prisma } = request.server.app;
  const { email } = request.payload;

  if (!email) {
    return responseHelper(
      h,
      'failed',
      'Gagal menghapus user. Mohon berikan email user',
      400,
    );
  }

  let user;

  try {
    user = await prisma.user.delete({
      where: {
        email,
      },
    });
  } catch (e) {
    return responseHelper(
      h,
      'failed',
      'Gagal menghapus user. Email tidak ditemukan',
      404,
    );
  }

  return responseHelper(
    h,
    'success',
    'Berhasil menghapus data user.',
    200,
    user,
  );
};

// For view image
const getImage = async (request, h) => {
  const { name } = request.params;
  return h.file(`./uploads/user/${name}`);
};

module.exports = {
  getUser,
  getUserById,
  updateUser,
  deleteUser,
  addUser,
  getImage,
};
