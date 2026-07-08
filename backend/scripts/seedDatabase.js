import connectDB from "../config/db.js";

import Product from "../models/Product.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Order from "../models/Order.js";

import data from "../data/db.json" with { type: "json" };

const seedDatabase = async () => {

    try {

        await connectDB();

        // Optional: clear old data
        await Product.deleteMany();
        await User.deleteMany();
        await Admin.deleteMany();
        await Order.deleteMany();

        // Insert JSON data
        await Product.insertMany(data.products);

        await User.insertMany(data.users);

        await Admin.insertMany(data.admins);

        await Order.insertMany(data.orders);

        console.log("Database Seeded Successfully");

        process.exit();

    } catch (err) {

        console.log(err);

        process.exit(1);

    }

};

seedDatabase();