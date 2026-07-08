import express from "express"
const router = express.Router();

const {
    createUser,
    getUser,
    getUserById,
    updateUser,
    deleteUser
} = require("../controllers/userController");

router.post("/", createUser);
router.get("/", getUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router
