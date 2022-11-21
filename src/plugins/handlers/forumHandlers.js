const responseHelper = require('../helpers/responseHelper');
const {
  validateImageExtension,
  deleteSavedImage,
  saveImage,
} = require('../helpers/saveImageHelper');

const helper = (data) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].user) {
      data[i].author = data[i].user.name;
      delete data[i].user;
    }
    data[i].vote = data[i].thumbs_up - data[i].thumbs_down;

    delete data[i].thumbs_up;
    delete data[i].thumbs_down;
  }
};

const getAllForum = async (request, h) => {
  const { prisma } = request.server.app;
  const forum = await prisma.forum.findMany({
    orderBy: [
      {
        thumbs_up: 'desc',
      },
      {
        thumbs_down: 'asc',
      },
    ],
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  helper(forum);

  return responseHelper(h, 'success', 'Data berhasil didapatkan', 200, forum);
};

const getForumById = async (request, h) => {
  const { prisma } = request.server.app;
  const { id } = request.params;

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal mendapatkan forum. Mohon isi id forum.',
      400,
    );
  }

  const forumById = [
    await prisma.forum.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    }),
  ];

  if (!forumById) {
    return responseHelper(
      h,
      'failed',
      'Gagal mendapatkan data forum. Id tidak ditemukan',
      404,
    );
  }

  helper(forumById);

  return responseHelper(
    h,
    'success',
    'Data berhasil didapatkan',
    200,
    forumById[0],
  );
};

const getAllForumWithOrderDate = async (request, h) => {
  const { prisma } = request.server.app;
  const forumWithOrderDate = await prisma.forum.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  helper(forumWithOrderDate);

  return responseHelper(
    h,
    'success',
    'Data berhasil didapatkan',
    200,
    forumWithOrderDate,
  );
};

const getForumByCategories = async (request, h) => {
  const { prisma } = request.server.app;
  const id = parseInt(request.params.id, 10);

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal mendapatkan forum. Mohon isi id forum.',
      400,
    );
  }

  const forumByCategories = await prisma.forum.findMany({
    where: {
      kategori_forum: {
        some: {
          kategoriId: id,
        },
      },
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      kategori_forum: true,
    },
  });

  if (forumByCategories.length < 1) {
    return responseHelper(
      h,
      'failed',
      'Gagal mendapatkan data forum. Forum dengan id kategori tidak ditemukan',
      404,
    );
  }

  helper(forumByCategories);

  return responseHelper(
    h,
    'success',
    'Data berhasil didapatkan',
    200,
    forumByCategories,
  );
};

// Kayak getPostWithCommentById
const getForumWithDiscussionById = async (request, h) => {
  const { prisma } = request.server.app;
  const id = parseInt(request.params.id, 10);

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal mendapatkan forum. Mohon isi id forum.',
      400,
    );
  }

  const data = await prisma.forum.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!data) {
    return responseHelper(
      h,
      'failed',
      'Gagal mendapatkan data forum. Id tidak ditemukan',
      404,
    );
  }

  const forumWithKomentar = [data];

  const komentar = await prisma.komentarForum.findMany({
    where: {
      forumId: id,
    },
    orderBy: [
      {
        thumbs_up: 'desc',
      },
      {
        thumbs_down: 'asc',
      },
    ],
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  helper(forumWithKomentar);
  helper(komentar);

  forumWithKomentar[0].komentar = komentar;

  return responseHelper(
    h,
    'success',
    'Data berhasil didapatkan',
    200,
    forumWithKomentar[0],
  );
};

const updateForum = async (request, h) => {
  const { prisma } = request.server.app;
  const { id, title, authorId, oldImage, newImage } = request.payload;

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui forum. Mohon isi id forum',
      400,
    );
  }

  if (!title) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui forum. Mohon isi title forum',
      400,
    );
  }

  if (!authorId) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui forum. Mohon isi authorId forum',
      400,
    );
  }

  const forumNow = await prisma.forum.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      authorId: true,
      image_large: true,
      image_small: true,
    },
  });

  if (!forumNow) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui forum. Id tidak ditemukan',
      404,
    );
  }

  let image_large = forumNow.image_large;
  let image_small = forumNow.image_small;

  if (oldImage !== newImage.hapi.filename) {
    deleteSavedImage(image_large, image_small);

    const dataImage = saveImage(newImage, 'forum');
    image_large = dataImage.data.large;
    image_small = dataImage.data.small;
  }

  const authorFId = forumNow.authorId;

  if (authorFId == authorId) {
    const now = new Date(Date.now());
    const updatedForum = [
      await prisma.forum.update({
        where: {
          id: parseInt(id),
        },
        data: {
          title,
          image_large,
          image_small,
          updatedAt: now,
        },
      }),
    ];

    helper(updatedForum);

    return responseHelper(
      h,
      'success',
      'Berhasil memperbarui data forum',
      200,
      updatedForum[0],
    );
  }
  return responseHelper(h, 'failed', 'Unauthorized, Invalid Author', 401);
};

const updateUpVote = async (request, h) => {
  const { prisma } = request.server.app;
  const id = parseInt(request.payload.id, 10);

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui up vote forum. Mohon isi id forum',
      400,
    );
  }

  let { thumbs_up } = await prisma.forum.findUnique({
    where: {
      id,
    },
  });

  if (!thumbs_up) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui thumbs up. Id tidak ditemukan',
      404,
    );
  }

  const forum = await prisma.forum.update({
    where: {
      id,
    },
    data: {
      thumbs_up: thumbs_up + 1,
    },
  });

  return responseHelper(
    h,
    'success',
    'Berhasil memperbarui up vote forum',
    200,
    forum,
  );
};

const updateDownVote = async (request, h) => {
  const { prisma } = request.server.app;
  const id = parseInt(request.payload.id, 10);

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui down vote forum. Mohon isi id forum',
      400,
    );
  }

  let { thumbs_down } = await prisma.forum.findUnique({
    where: {
      id,
    },
  });

  if (!thumbs_down) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui thumbs down. Id tidak ditemukan',
      404,
    );
  }

  const forum = await prisma.forum.update({
    where: {
      id,
    },
    data: {
      thumbs_down: thumbs_down + 1,
    },
  });

  return responseHelper(
    h,
    'success',
    'Berhasil memperbarui down vote forum',
    200,
    forum,
  );
};

const deleteForumById = async (request, h) => {
  const { prisma } = request.server.app;
  const id = parseInt(request.payload.id, 10);

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal menghapus forum. Mohon isi id forum',
      400,
    );
  }

  let deletedForum;

  try {
    deletedForum = await prisma.forum.delete({
      where: {
        id,
      },
    });
  } catch (e) {
    return responseHelper(
      h,
      'failed',
      'Gagal menghapus forum. Id tidak ditemukan',
      404,
    );
  }

  return responseHelper(
    h,
    'success',
    'Berhasil menghapus data forum.',
    200,
    deletedForum,
  );
};

const addForum = async (request, h) => {
  const { prisma } = request.server.app;
  const { title, authorId, image } = request.payload;

  let dataImage;

  if (!title) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan forum. Mohon isi title forum',
      400,
    );
  }

  if (!authorId) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan forum. Mohon isi authorId forum',
      400,
    );
  }

  if (validateImageExtension(image)) {
    if (image.hapi.filename) {
      dataImage = await saveImage(image, 'forum');
    }
  } else {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan gambar. Mohon memberikan gambar dengan ekstensi [jpg, jpeg, atau png]',
      400,
    );
  }

  const createdForum = await prisma.forum.create({
    data: {
      title,
      authorId,
      image_large: dataImage?.data.large,
      image_small: dataImage?.data.small,
    },
  });

  return responseHelper(h, 'success', 'Forum berhasil ditambahkan', 201, {
    createdForum,
  });
};

module.exports = {
  getAllForum,
  getForumById,
  getAllForumWithOrderDate,
  getForumByCategories,
  getForumWithDiscussionById,
  updateForum,
  updateUpVote,
  updateDownVote,
  deleteForumById,
  addForum,
};
