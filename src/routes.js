const Joi = require('joi');
const {
  addExpenseHandler,
  getAllExpensesHandler,
  getExpenseByIdHandler,
  updateExpenseByIdHandler,
  deleteExpenseByIdHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/expenses',
    handler: addExpenseHandler,
    options: {
      cors: { origin: ['*'] },
      validate: {
        payload: Joi.object({
          category: Joi.string().required(),
          uangMasuk: Joi.number().precision(2).default(0.00),
          uangKeluar: Joi.number().precision(2).default(0.00),
          uangAkhir: Joi.number().precision(2).required(),
          description: Joi.string().allow(null, ''),
          transaction_date: Joi.date().required(),
        }),
        failAction: (request, h, error) => {
          const err = error.details[0];
          if (err.context && err.context.key === 'category') {
            return h.response({
              status: 'fail',
              message: 'Gagal menambahkan expense. Mohon isi kategori expense',
            }).code(400).takeover();
          }
          return h.response({
            status: 'fail',
            message: err.message,
          }).code(400).takeover();
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/expenses',
    handler: getAllExpensesHandler,
  },
  {
    method: 'GET',
    path: '/expenses/{expenseId}',
    handler: getExpenseByIdHandler,
    options: {
      validate: {
        params: Joi.object({
          expenseId: Joi.number().integer().required(),
        }),
        failAction: (request, h, error) => {
          const errMsg = error.details[0].message;
          if (errMsg.includes('must be a number')) {
            return h.response({
              status: 'fail',
              message: 'Expense tidak ditemukan',
            }).code(404).takeover();
          }
          return h.response({
            status: 'fail',
            message: errMsg,
          }).code(400).takeover();
        },
      },
    },
  },
  {
    method: 'PUT',
    path: '/expenses/{expenseId}',
    handler: updateExpenseByIdHandler,
    options: {
      validate: {
        params: Joi.object({
          expenseId: Joi.number().integer().required(),
        }),
        payload: Joi.object({
          category: Joi.string().required(),
          uangMasuk: Joi.number().precision(2).default(0.00),
          uangKeluar: Joi.number().precision(2).default(0.00),
          uangAkhir: Joi.number().precision(2).required(),
          description: Joi.string().allow(null, ''),
          transaction_date: Joi.date().required(),
        }),
        failAction: (request, h, error) => {
          const errMsg = error.details[0].message;
          if (errMsg.includes('must be a number')) {
            return h.response({
              status: 'fail',
              message: 'Gagal memperbarui expense. Id tidak ditemukan',
            }).code(404).takeover();
          }
          if (error.details[0].context && error.details[0].context.key === 'category') {
            return h.response({
              status: 'fail',
              message: 'Gagal memperbarui expense. Mohon isi kategori expense',
            }).code(400).takeover();
          }
          return h.response({
            status: 'fail',
            message: errMsg,
          }).code(400).takeover();
        },
      },
    },
  },
  {
    method: 'DELETE',
    path: '/expenses/{expenseId}',
    handler: deleteExpenseByIdHandler,
    options: {
      validate: {
        params: Joi.object({
          expenseId: Joi.number().integer().required(),
        }),
        failAction: (request, h, error) => {
          const errMsg = error.details[0].message;
          if (errMsg.includes('must be a number')) {
            return h.response({
              status: 'fail',
              message: 'Expense gagal dihapus. Id tidak ditemukan',
            }).code(404).takeover();
          }
          return h.response({
            status: 'fail',
            message: errMsg,
          }).code(400).takeover();
        },
      },
    },
  },
];

module.exports = routes;