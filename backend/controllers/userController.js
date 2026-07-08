const User = require("../models/User");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        res.status(201).json(user);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};

const getUser = async (req, res) => {
    try {
        const users = await User.find();

        if (users.length === 0) {
            return res.status(404).json({
                message: "No users found"
            });
        }

        res.status(200).json(users);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};

const updateUser = async (req, res) => {
    try {

        const updateData = { ...req.body };

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {

        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted successfully",
            deletedUser
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createUser,
    getUser,
    getUserById,
    updateUser,
    deleteUser
};
