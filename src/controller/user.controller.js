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
  createUser: async (req, res) => {
    const userData = req.body;
    const salt = genSaltSync(10);
    userData.password = hashSync(userData.password, salt);

    try {
      const result = await create(userData);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        data: err.message,
      });
    }
  },

  getUserByUserId: async (req, res) => {
    const id = req.params.id;

    try {
      const result = await getUserById(id);
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
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        data: error.message,
      });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const result = await getUsers();
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
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        data: err.message,
      });
    }
  },

  // getUserByUserEmail: async (req, res) => {
  //   const email = req.body.email;
  //   try {
  //     const result = await getUserByEmail(email);
  //     if (result.length === 0) {
  //       return res.status(404).json({
  //         success: false,
  //         data: "User Email is not found !",
  //       });
  //     }

  //     return res.status(200).json({
  //       success: true,
  //       data: result,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({
  //       success: false,
  //       data: error.message,
  //     });
  //   }
  // },

  updateUser: async (req, res) => {
    const userData = req.body;
    const salt = genSaltSync(10);
    userData.password = hashSync(userData.password, salt);
    try {
      const result = await update(userData);
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
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        data: error.message,
      });
    }
  },

  deleteUser: async (req, res) => {
    const id = req.params.id;
    try {
      const result = await deleteUser(id);
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
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        data: error.message,
      });
    }
  },

  login: async (req, res) => {
    const data = req.body;
    try {
      const results = await getUserByEmail(data.email);
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
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        data: error.message,
      });
    }
  },
};
