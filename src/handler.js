const pool = require('./db');

const addExpenseHandler = async (request, h) => {
  const { category, uangMasuk, uangKeluar, uangAkhir, description, transaction_date } = request.payload;

  try {
    const [result] = await pool.execute(
      `INSERT INTO expenses (category, uangMasuk, uangKeluar, uangAkhir, description, transaction_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [category, uangMasuk, uangKeluar, uangAkhir, description, transaction_date]
    );
    return h.response({
      status: 'success',
      message: 'Expense berhasil ditambahkan',
      data: { expenseId: result.insertId },
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
    const [rows] = await pool.execute(`
      SELECT 
        expenseId,
        category,
        uangMasuk,
        uangKeluar,
        uangAkhir,
        description,
        DATE_FORMAT(transaction_date, '%Y-%m-%d') AS transaction_date
      FROM expenses
    `);
    
    return {
      status: 'success',
      data: { expenses: rows },
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
  const { expenseId } = request.params;
  try {
    const [rows] = await pool.execute(`
      SELECT 
        expenseId,
        category,
        uangMasuk,
        uangKeluar,
        uangAkhir,
        description,
        DATE_FORMAT(transaction_date, '%Y-%m-%d') AS transaction_date
      FROM expenses
      WHERE expenseId = ?
    `, [expenseId]);

    if (rows.length === 0) {
      return h.response({
        status: 'fail',
        message: 'Expense tidak ditemukan',
      }).code(404);
    }
    const expense = rows[0];
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
  const { expenseId } = request.params;
  const { category, uangMasuk, uangKeluar, uangAkhir, description, transaction_date } = request.payload;

  console.log('Updating expense with ID:', expenseId);

  try {
      const [result] = await pool.execute(
          `UPDATE expenses SET category = ?, uangMasuk = ?, uangKeluar = ?, uangAkhir = ?, description = ?, transaction_date = ? WHERE expenseId = ?`,
          [category, uangMasuk, uangKeluar, uangAkhir, description, transaction_date, expenseId]
      );

      console.log('Update result:', result);

      if (result.affectedRows === 0) {
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
  const { expenseId } = request.params;
  try {
    const [result] = await pool.execute(
      `DELETE FROM expenses WHERE expenseId = ?`,
      [expenseId]
    );

    if (result.affectedRows === 0) {
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
