const {
  getAllForum,
  getForumById,
  addForum,
  getAllForumWithOrderDate,
  getForumByCategories,
  getForumWithDiscussionById,
  updateForum,
  updateUpVote,
  updateDownVote,
  deleteForumById,
} = require('../handlers/forumHandlers');
const { routesHelper, routesHelperStream } = require('../helpers/routesHelper');

const routesForum = [
  routesHelper('GET', '/forum', getAllForum),
  routesHelper('GET', '/forum/{id}', getForumById),
  routesHelper('GET', '/forumDates', getAllForumWithOrderDate),
  routesHelper('GET', '/forumCat/{id}', getForumByCategories),
  routesHelper('GET', '/forumDis/{id}', getForumWithDiscussionById),
  routesHelperStream('PUT', '/forum', updateForum),
  routesHelper('PUT', '/forumUpVote', updateUpVote),
  routesHelper('PUT', '/forumDownVote', updateDownVote),
  routesHelper('DELETE', '/forum', deleteForumById),
  routesHelperStream('POST', '/forum', addForum),
];

module.exports = routesForum;
