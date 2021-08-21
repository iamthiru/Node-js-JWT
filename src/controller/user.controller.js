const e = require("express");
const {
  create,
  getUserById,
  getUsers,
  getUserByEmail,
  update,
  deleteUser,
} = require("../service/user.service");

const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
  createUser: (req, res) => {
    const userData = req.body;
    const salt = genSaltSync(10);
    userData.password = hashSync(userData.password, salt);
    create(userData, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          data: err.message,
        });
      }
      return res.status(200).json({
        success: true,
        data: result,
      });
    });
  },

  getUserByUserId: (req, res) => {
    const id = req.params.id;
    getUserById(id, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          data: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          data: "User Id Not Found !",
        });
      }

      return res.status(200).json({
        success: true,
        data: result,
      });
    });
  },

  getAllUsers: (req, res) => {
    getUsers((err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          data: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          data: "User List is Empty !",
        });
      }

      return res.status(200).json({
        success: true,
        data: result,
      });
    });
  },

  getUserByUserEmail: (req, res) => {
    const email = req.body.email;
    getUserByEmail(email, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          data: err.message,
        });
      }
      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          data: "User Email is not found !",
        });
      }

      return res.status(200).json({
        success: true,
        data: result,
      });
    });
  },

  updateUser: (req, res) => {
    const userData = req.body;
    const salt = genSaltSync(10);
    userData.password = hashSync(userData.password, salt);
    update(userData, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          data: err.message,
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          data: "User Id is not Found!",
        });
      }
      return res.status(200).json({
        success: true,
        data: result,
      });
    });
  },

  deleteUser: (req, res) => {
    const id = req.params.id;

    deleteUser(id, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          data: err.message,
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          data: "User Id is not Found!",
        });
      }
      return res.status(200).json({
        success: true,
        data: result,
      });
    });
  },

  login: (req, res) => {
    const data = req.body;
    getUserByEmail(data.email, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          data: "Invalid username or password !",
        });
      }
      const result = compareSync(data.password, results[0].password);
      if (result) {
        results.password = undefined;
        const jsonwebtoken = sign({ result: results }, process.env.JWT_KEY, {
          expiresIn: "1h",
        });

        return res.status(200).json({
          success: true,
          data: "login successfully !",
          token: jsonwebtoken,
        });
      } else {
        return res.status(404).json({
          success: false,
          data: "Invalid email or password !",
        });
      }
    });
  },
};
