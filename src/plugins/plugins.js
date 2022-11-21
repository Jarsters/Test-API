const adminPlugin = require('./admin');
const forumPlugin = require('./forum');
const kategoriPlugin = require('./kategori');
const kategoriForumPlugin = require('./kategoriForum');
const kategoriPostPlugin = require('./kategoriPost');
const komentarForumPlugin = require('./komentarForum');
const komentarPostPlugin = require('./komentarPost');
const logPlugin = require('./log');
const postPlugin = require('./post');
const prismaPlugin = require('./prisma');
const rolePlugin = require('./role');
const userPlugin = require('./user');
const inert = require('@hapi/inert');

const plugins = [
  prismaPlugin,
  userPlugin, //user
  adminPlugin, //admin
  postPlugin, //forum
  rolePlugin, //roles
  forumPlugin, //forum
  kategoriPlugin, //categories
  kategoriForumPlugin, //kategori_forum
  kategoriPostPlugin, //kategori_post
  komentarForumPlugin, //komentar_forum
  komentarPostPlugin, //komentar_post
  logPlugin, //log
  inert, // Agar bisa load image
];

module.exports = plugins;
