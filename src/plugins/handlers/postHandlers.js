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

const getAllPost = async (request, h) => {
  const { prisma } = request.server.app;
  const post = await prisma.post.findMany({
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

  helper(post);

  return responseHelper(h, 'success', 'Data berhasil didapatkan', 200, post);
};

const getPostById = async (request, h) => {
  const { prisma } = request.server.app;
  const { id } = request.params;

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal mendapatkan post. Mohon isi id post.',
      400,
    );
  }

  const postById = [
    await prisma.post.findUnique({
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

  if (!postById) {
    return responseHelper(
      h,
      'failed',
      'Gagal mendapatkan data post. Id tidak ditemukan',
      404,
    );
  }

  helper(postById);

  return responseHelper(
    h,
    'success',
    'Data berhasil didapatkan',
    200,
    postById[0],
  );
};

const getPostWithCommentById = async (request, h) => {
  const { prisma } = request.server.app;
  const id = parseInt(request.params.id, 10);

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal mendapatkan post. Mohon isi id post.',
      400,
    );
  }

  const data = await prisma.post.findUnique({
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
  });

  if (!data) {
    return responseHelper(
      h,
      'failed',
      'Gagal mendapatkan data post. Id tidak ditemukan',
      404,
    );
  }

  const postCommentById = [data];

  const komentar_post = await prisma.komentarPost.findMany({
    where: {
      postId: id,
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

  helper(postCommentById);
  helper(komentar_post);

  postCommentById[0].komentar = komentar_post;

  return responseHelper(
    h,
    'success',
    'Data berhasil didapatkan',
    200,
    postCommentById[0],
  );
};

const getAllPostWithOrderDate = async (request, h) => {
  const { prisma } = request.server.app;
  const postWithOrderDate = await prisma.post.findMany({
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

  helper(postWithOrderDate);

  return responseHelper(
    h,
    'success',
    'Data berhasil didapatkan',
    200,
    postWithOrderDate,
  );
};

const getPostByCategories = async (request, h) => {
  const { prisma } = request.server.app;
  const id = parseInt(request.params.id, 10);

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal mendapatkan post. Mohon isi id post.',
      400,
    );
  }

  const postByCategories = await prisma.post.findMany({
    where: {
      kategori_post: {
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
    },
  });

  if (postByCategories.length < 1) {
    return responseHelper(
      h,
      'failed',
      'Gagal mendapatkan data post. Post dengan id kategori tidak ditemukan',
      404,
    );
  }

  helper(postByCategories);

  return responseHelper(
    h,
    'success',
    'Data berhasil didapatkan',
    200,
    postByCategories,
  );
};

const updatePost = async (request, h) => {
  const { prisma } = request.server.app;
  const { id, title, content, authorId, oldImage, newImage } = request.payload;

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui post. Mohon isi id post',
      400,
    );
  }

  if (!title) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui post. Mohon isi title post',
      400,
    );
  }

  if (!content) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui post. Mohon isi content post',
      400,
    );
  }

  if (!authorId) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui post. Mohon isi authorId post',
      400,
    );
  }

  const postNow = await prisma.post.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      authorId: true,
      image_large: true,
      image_small: true,
    },
  });

  if (!postNow) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui post. Id tidak ditemukan',
      404,
    );
  }

  let image_large = postNow.image_large;
  let image_small = postNow.image_small;

  if (oldImage !== newImage.hapi.filename) {
    deleteSavedImage(image_large, image_small);

    const dataImage = saveImage(newImage, 'post');
    image_large = dataImage.data.large;
    image_small = dataImage.data.small;
  }

  const authorPId = postNow.authorId;

  if (authorPId == authorId) {
    const now = new Date(Date.now());
    const updatedPost = [
      await prisma.post.update({
        where: {
          id: parseInt(id),
        },
        data: {
          title,
          content,
          image_large,
          image_small,
          updatedAt: now,
        },
      }),
    ];

    helper(updatedPost);

    return responseHelper(
      h,
      'success',
      'Berhasil memperbarui data post',
      200,
      updatedPost[0],
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
      'Gagal memperbarui up vote post. Mohon isi id post',
      400,
    );
  }

  let { thumbs_up } = await prisma.post.findUnique({
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

  const post = await prisma.post.update({
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
    'Berhasil memperbarui up vote post',
    200,
    post,
  );
};

const updateDownVote = async (request, h) => {
  const { prisma } = request.server.app;
  const id = parseInt(request.payload.id, 10);

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal memperbarui down vote post. Mohon isi id post',
      400,
    );
  }

  let { thumbs_down } = await prisma.post.findUnique({
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

  const post = await prisma.post.update({
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
    'Berhasil memperbarui down vote post',
    200,
    post,
  );
};

const deletePostById = async (request, h) => {
  const { prisma } = request.server.app;
  const id = parseInt(request.payload.id, 10);

  if (!id) {
    return responseHelper(
      h,
      'failed',
      'Gagal menghapus post. Mohon isi id post',
      400,
    );
  }

  let deletedPost;
  try {
    deletedPost = await prisma.post.delete({
      where: {
        id,
      },
    });
  } catch (e) {
    return responseHelper(
      h,
      'failed',
      'Gagal menghapus post. Id tidak ditemukan',
      404,
    );
  }

  return responseHelper(
    h,
    'success',
    'Berhasil menghapus data post.',
    200,
    deletedPost,
  );
};

const addPost = async (request, h) => {
  const { prisma } = request.server.app;
  const { title, content, image, authorId } = request.payload;

  let dataImage;

  if (!title) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan post. Mohon isi title post',
      400,
    );
  }

  if (!content) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan post. Mohon isi content post',
      400,
    );
  }

  if (!authorId) {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan post. Mohon isi authorId post',
      400,
    );
  }

  if (validateImageExtension(image)) {
    if (image.hapi.filename) {
      dataImage = await saveImage(image, 'post');
    }
  } else {
    return responseHelper(
      h,
      'failed',
      'Gagal menambahkan gambar. Mohon memberikan gambar dengan ekstensi [jpg, jpeg, atau png]',
      400,
    );
  }

  const createdPost = await prisma.post.create({
    data: {
      title,
      content,
      authorId,
      image_large: dataImage?.data.large,
      image_small: dataImage?.data.small,
    },
  });

  return responseHelper(h, 'success', 'Post berhasil ditambahkan', 201, {
    createdPost,
  });
};

module.exports = {
  getAllPost,
  getPostById,
  getPostWithCommentById,
  getAllPostWithOrderDate,
  getPostByCategories,
  updatePost,
  updateUpVote,
  updateDownVote,
  deletePostById,
  addPost,
};
