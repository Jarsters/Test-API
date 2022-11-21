const Hapi = require('@hapi/hapi');
const plugins = require('./plugins/plugins');

BigInt.prototype.toJSON = function () {
  return parseInt(this);
};

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register(plugins);

  await server.start();

  process.on('unhandledRejection', async (err) => {
    await server.app.prisma.$disconnect();
    console.log(err);
    process.exit(1);
  });

  // eslint-disable-next-line no-console
  console.log('Server listening ...');
};

init();
