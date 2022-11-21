const responseHelper = require('../helpers/responseHelper');
const {
  validateImageExtension,
  deleteSavedImage,
  saveImage,
} = require('../helpers/saveImageHelper');

const getAllAdmin = async (request, h) => {
  const { prisma } = request.server.app;
  const admin = await prisma.user.findMany({
    where: {
      roleId: 1,
    },
  });
  return responseHelper(h, 'success', 'Data berhasil didapatkan', 200, admin);
};

const getAdminById = async (request, h) => {
  const { prisma } = request.server.app;
  const id = parseInt(request.params.id, 10);

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal mendapatkan admin. Mohon isi id admin.',
      400,
    );
  }

  const admin = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (admin) {
    return responseHelper(h, 'success', 'Data berhasil didapatkan', 200, admin);
  }

  return responseHelper(
    h,
    'failed',
    'Gagal mendapatkan data admin. Id tidak ditemukan',
    404,
  );
};

const addAdmin = async (request, h) => {
  const { prisma } = request.server.app;
  const { name, email, image, role } = request.payload;

  let dataImage;

  if (!name) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan admin. Mohon isi nama admin',
      400,
    );
  }

  if (!email) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan admin. Mohon isi email admin',
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
      'Gagal menambahkan admin. Email admin sudah ada',
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

  if (role == '1' || role == 'admin') {
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        image_large: dataImage?.data.large,
        image_small: dataImage?.data.small,
        roleId: 1,
      },
    });

    return responseHelper(
      h,
      'success',
      'Admin berhasil ditambahkan',
      201,
      admin,
    );
  }

  return responseHelper(h, 'failed', 'Unauthorized, Invalid Role', 401);
};

const updateAdmin = async (request, h) => {
  const { prisma } = request.server.app;
  // Hidden input is email and oldImage
  const { name, email, oldImage, newImage, role } = request.payload;

  if (!name) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui admin. Mohon isi nama admin',
      400,
    );
  }

  if (!email) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui admin. Mohon isi email admin',
      400,
    );
  }

  const adminNow = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!adminNow) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui admin. Email tidak ditemukan',
      404,
    );
  }

  let image_large = adminNow.image_large;
  let image_small = adminNow.image_small;

  if (oldImage !== newImage.hapi.filename) {
    deleteSavedImage(image_large, image_small);

    const dataImage = saveImage(newImage, 'user');
    image_large = dataImage.data.large;
    image_small = dataImage.data.small;
  }

  if (role == '1' || role == 'admin') {
    const now = new Date(Date.now());

    const admin = await prisma.user.update({
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

    return responseHelper(
      h,
      'success',
      'Admin berhasil diperbarui',
      200,
      admin,
    );
  }

  return responseHelper(h, 'failed', 'Unauthorized, Invalid Role', 401);
};

const deleteAdmin = async (request, h) => {
  // Untuk liat response headersnya
  // request.headers.['content-type']

  const { prisma } = request.server.app;
  const { email, role } = request.payload;

  if (!email) {
    return responseHelper(
      h,
      'failed',
      'Gagal menghapus admin. Mohon berikan email admin',
      400,
    );
  }

  if (role == '1') {
    let admin;
    try {
      admin = await prisma.user.delete({
        where: {
          email,
        },
      });
    } catch (e) {
      return responseHelper(
        h,
        'failed',
        'Gagal menghapus admin. Email tidak ditemukan',
        404,
      );
    }

    return responseHelper(
      h,
      'success',
      'Berhasil menghapus data admin.',
      200,
      admin,
    );
  }
  return responseHelper(h, 'failed', 'Unauthorized, Invalid Role.', 401);
};

// For view image
const getImage = async (request, h) => {
  const { name } = request.params;
  return h.file(`./uploads/user/${name}`);
};

module.exports = {
  getAllAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  addAdmin,
  getImage,
};
