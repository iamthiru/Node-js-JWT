const pool = require("../../config/db.config");

module.exports = {
  create: (data, callback) => {
    pool.query(
      `insert into user (id, name, email, password, phone) values (?, ?, ? ,? ,?)`,
      [data.id, data.name, data.email, data.password, data.phone],
      (err, result) => {
        if (err) {
          callback(err);
        }
        return callback(null, result);
      }
    );
  },

  getUserById: (id, callback) => {
    pool.query(
      `select id,name,email,password,phone from user where id = ?`,
      [id],
      (err, result) => {
        if (err) {
          return callback(err);
        }
        return callback(null, result);
      }
    );
  },

  getUserByEmail: (email, callback) => {
    pool.query(
      `select * from user where email = ?`,
      [email],
      (err, results) => {
        if (err) {
          return callback(err);
        }
        return callback(null, results);
      }
    );
  },

  getUsers: (callback) => {
    pool.query(`select * from user`, [], (err, result) => {
      if (err) {
        callback(err);
      }
      return callback(null, result);
    });
  },

  update: (data, callback) => {
    pool.query(
      `update user set name=?, email=?, password=?, phone=? where id = ?`,
      [data.name, data.email, data.password, data.phone, data.id],
      (err, result) => {
        if (err) {
          callback(err);
        }
        return callback(null, result);
      }
    );
  },

  deleteUser: (id, callback) => {
    pool.query(`delete from user where id = ?`, [id], (err, result) => {
      if (err) {
        callback(err);
      }
      return callback(null, result);
    });
  },
};
