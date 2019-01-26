const axios = require('axios');
const Joi = require('joi');

const CHANAPI = {
  BASE: 'https://a.4cdn.org/',
  ROUTES: {
    BOARDS: 'boards.json',
    BOARD: '{board}/{pageNumber}.json',
    THREAD: '{board}/thread/{threadNumber}.json'
  }
};

module.exports = [
  {
    method: 'GET',
    path: '/api/v1/board',
    config: {
      description: 'Get board.',
      tags: ['api', 'board'],
      handler: async (req, reply) => {
        const {
          board
        } = req.query;

        if (board) {
          const boardPromises = [];
          for (i = 1; i <= 10; i++) {
            const path = CHANAPI.ROUTES.BOARD.replace('{board}', board).replace('{pageNumber}', i);
            boardPromises.push(axios.get(`${CHANAPI.BASE}${path}`))
          }

          const responses = await Promise.all(boardPromises);
          const result = { threads: [] };
          for (const response of responses) {
            result.threads = result.threads.concat(response.data.threads);
          }
          return result;
        } else {
          const path = CHANAPI.ROUTES.BOARDS;
          const response = await axios.get(`${CHANAPI.BASE}${path}`);
          return response.data;
        }
      },
      validate: {
        query: {
          board: Joi.string()
            .description('Board abbreviation')
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/v1/thread',
    config: {
      description: 'Get thread.',
      tags: ['api', 'board'],
      handler: async (req, reply) => {
        const {
          board,
          threadNumber
        } = req.query;
        
        const path = CHANAPI.ROUTES.THREAD.replace('{board}', board).replace('{threadNumber}', threadNumber);
        const response = await axios.get(`${CHANAPI.BASE}${path}`);
        return response.data;
      },
      validate: {
        query: {
          board: Joi.string()
            .description('Board abbreviation'),
          threadNumber: Joi.number().integer()
            .description('Thread number')
        }
      }
    }
  }
]