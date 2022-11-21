const {
  getAllPost,
  getPostWithCommentById,
  getAllPostWithOrderDate,
  getPostByCategories,
  updatePost,
  deletePostById,
  addPost,
  updateUpVote,
  updateDownVote,
  getPostById,
} = require('../handlers/postHandlers');
const { routesHelper, routesHelperStream } = require('../helpers/routesHelper');

const routesPost = [
  routesHelper('GET', '/posts', getAllPost),
  routesHelper('GET', '/posts/{id}', getPostById),
  routesHelper('GET', '/postsDates', getAllPostWithOrderDate),
  routesHelper('GET', '/postsCat/{id}', getPostByCategories),
  routesHelper('GET', '/postsCom/{id}', getPostWithCommentById),
  routesHelperStream('PUT', '/posts', updatePost),
  routesHelper('PUT', '/postsUpVote', updateUpVote),
  routesHelper('PUT', '/postsDownVote', updateDownVote),
  routesHelper('DELETE', '/posts', deletePostById),
  routesHelperStream('POST', '/posts', addPost),
];
module.exports = routesPost;
