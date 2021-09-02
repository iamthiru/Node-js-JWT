const pool = require("../../config/db.config");

module.exports = {
  create: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `insert into user (id, name, email, password, phone) values (?, ?, ? ,? ,?)`,
        [data.id, data.name, data.email, data.password, data.phone],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve(result);
        }
      );
    });
  },

  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `select id,name,email,password,phone from user where id = ?`,
        [id],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve(result.map((user) => withoutPassword(user)));
        }
      );
    });
  },

  getUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `select * from user where email = ?`,
        [email],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  },

  getUsers: () => {
    return new Promise((resolve, reject) => {
      pool.query(`select * from user`, [], (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result.map((u) => withoutPassword(u)));
      });
    });
  },

  update: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `update user set name=?, email=?, password=?, phone=? where id = ?`,
        [data.name, data.email, data.password, data.phone, data.id],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve(result);
        }
      );
    });
  },

  deleteUser: (id) => {
    return new Promise((resolve, reject) => {
      pool.query(`delete from user where id = ?`, [id], (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  },
};
function withoutPassword(user) {
  const { password, ...remaining } = user;
  return remaining;
}
