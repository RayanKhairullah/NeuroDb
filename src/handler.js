const pool = require('./dbPostgreesql');

const addExpenseHandler = async (request, h) => {
  const { category, uangMasuk, uangKeluar, uangAkhir, description, transaction_date } = request.payload;

  try {
    const query = `
      INSERT INTO expenses (category, uangmasuk, uangkeluar, uangakhir, description, transaction_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING expenseid
    `;
    const values = [category, uangMasuk, uangKeluar, uangAkhir, description, transaction_date];
    const result = await pool.query(query, values);

    return h.response({
      status: 'success',
      message: 'Expense berhasil ditambahkan',
      data: { expenseid: result.rows[0].expenseid },
    }).code(201);
  } catch (error) {
    console.error('Error adding expense: ', error);
    return h.response({
      status: 'error',
      message: 'Gagal menambahkan expense',
    }).code(500);
  }
};

const getAllExpensesHandler = async (request, h) => {
  try {
    const query = `
      SELECT 
        expenseid,
        category,
        uangmasuk,
        uangkeluar,
        uangakhir,
        description,
        TO_CHAR(transaction_date, 'YYYY-MM-DD') AS transaction_date
      FROM expenses
    `;
    const result = await pool.query(query);
    return {
      status: 'success',
      data: { expenses: result.rows },
    };
  } catch (error) {
    console.error('Error retrieving expenses: ', error);
    return h.response({
      status: 'error',
      message: 'Gagal mengambil data expenses',
    }).code(500);
  }
};

const getExpenseByIdHandler = async (request, h) => {
  const { expenseid } = request.params;
  try {
    const query = `
      SELECT 
        expenseid,
        category,
        uangmasuk,
        uangkeluar,
        uangakhir,
        description,
        TO_CHAR(transaction_date, 'YYYY-MM-DD') AS transaction_date
      FROM expenses
      WHERE expenseid = $1
    `;
    const result = await pool.query(query, [expenseid]);
    if (result.rowCount === 0) {
      return h.response({
        status: 'fail',
        message: 'Expense tidak ditemukan',
      }).code(404);
    }
    const expense = result.rows[0];
    return {
      status: 'success',
      data: { expense },
    };
  } catch (error) {
    console.error('Error retrieving expense by ID: ', error);
    return h.response({
      status: 'error',
      message: 'Gagal mengambil data expense',
    }).code(500);
  }
};

const updateExpenseByIdHandler = async (request, h) => {
  const { expenseid } = request.params;
  const { category, uangMasuk, uangKeluar, uangAkhir, description, transaction_date } = request.payload;

  console.log('Updating expense with ID:', expenseid);

  try {
    const query = `
      UPDATE expenses
      SET category = $1, uangmasuk = $2, uangkeluar = $3, uangakhir = $4, description = $5, transaction_date = $6
      WHERE expenseid = $7
    `;
    const values = [category, uangMasuk, uangKeluar, uangAkhir, description, transaction_date, expenseid];
    const result = await pool.query(query, values);
    console.log('Update result:', result);

    if (result.rowCount === 0) {
      return h.response({
        status: 'fail',
        message: 'Expense gagal diperbarui. Id tidak ditemukan',
      }).code(404);
    }

    return h.response({
      status: 'success',
      message: 'Expense berhasil diperbarui',
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    return h.response({
      status: 'error',
      message: 'Gagal memperbarui expense',
    }).code(500);
  }
};

const deleteExpenseByIdHandler = async (request, h) => {
  const { expenseid } = request.params;
  try {
    const query = `DELETE FROM expenses WHERE expenseid = $1`;
    const result = await pool.query(query, [expenseid]);

    if (result.rowCount === 0) {
      return h.response({
        status: 'fail',
        message: 'Expense gagal dihapus. Id tidak ditemukan',
      }).code(404);
    }

    return h.response({
      status: 'success',
      message: 'Expense berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting expense: ', error);
    return h.response({
      status: 'error',
      message: 'Gagal menghapus expense',
    }).code(500);
  }
};

module.exports = {
  addExpenseHandler,
  getAllExpensesHandler,
  getExpenseByIdHandler,
  updateExpenseByIdHandler,
  deleteExpenseByIdHandler,
};
