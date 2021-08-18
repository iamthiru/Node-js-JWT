const {
  createUser,
  getUserByUserId,
  getAllUsers,
  getUserByUserEmail,
  updateUser,
  deleteUser,
  login
} = require("../controller/user.controller");

const {checkToken} = require("../../auth/valid-token");

const routes = require("express").Router();

routes.post("/create", checkToken, createUser);
routes.get("/get/:id", checkToken, getUserByUserId);
routes.get("/get-all-user", checkToken, getAllUsers);
routes.get("/get", checkToken, getUserByUserEmail);
routes.put("/update", checkToken, updateUser);
routes.delete("/delete/:id", checkToken, deleteUser);

routes.post("/login", login);

module.exports = routes;
