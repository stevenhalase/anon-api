const hapi = require('hapi');

// swagger section
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Package = require('./package');

// routes
const BoardRoutes = require('./routes/Board');

const server = hapi.server({
  port: process.env.PORT || 3000,
  routes: {
    cors: true
  }
});

const init = async () => {

  await server.register([
		Inert,
		Vision,
		{
			plugin: HapiSwagger,
			options: {
				info: {
					title: 'Anon API Documentation',
					version: Package.version
				},
				grouping: 'tags'
			}
		}
  ]);
  
  server.route([
		{
			method: 'GET',
			path: '/',
			config: {
				handler: (req, reply) => {
					return reply.redirect('/documentation');
				}
			}
		},
		...BoardRoutes
	]);

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();