import connectDB from "../config/db.js";
import bcrypt from "bcrypt";

import Product from "../models/Product.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Order from "../models/Order.js";

import data from "../../artify/db.json" with { type: "json" };

const normalizeSeedData = () => ({
    products: (data.products || []).map((product) => ({
        ...product,
        id: Number(product.id),
        price: Number(product.price),
        stock: Number(product.stock),
    })),
    users: (data.users || []).map((user) => ({
        ...user,
        id: Number(user.id),
        cart: (user.cart || []).map((item) => ({
            productId: Number(item.productId),
            qty: Number(item.qty) || 1,
        })),
        wishlist: (user.wishlist || []).map((productId) => Number(productId)),
    })),
    admins: (data.admins || []).map((admin) => ({
        ...admin,
        id: Number(admin.id),
    })),
    orders: (data.orders || []).map((order) => ({
        ...order,
        id: Number(order.id),
        userId: Number(order.userId),
        total: Number(order.total),
        items: (order.items || []).map((item) => ({
            productId: Number(item.productId),
            qty: Number(item.qty) || 1,
        })),
    })),
});

const hashSeedPasswords = async (accounts) => Promise.all(
    accounts.map(async (account) => ({
        ...account,
        pass: await bcrypt.hash(account.pass, Number(process.env.SALT_ROUNDS) || 10),
    }))
);

const seedDatabase = async () => {

    try {

        await connectDB();
        const normalizedData = normalizeSeedData();
        normalizedData.users = await hashSeedPasswords(normalizedData.users);
        normalizedData.admins = await hashSeedPasswords(normalizedData.admins);

        // Optional: clear old data
        await Product.deleteMany();
        await User.deleteMany();
        await Admin.deleteMany();
        await Order.deleteMany();

        // Insert JSON data
        await Product.insertMany(normalizedData.products);

        await User.insertMany(normalizedData.users);

        await Admin.insertMany(normalizedData.admins);

        await Order.insertMany(normalizedData.orders);

        console.log("Database Seeded Successfully");

        process.exit();

    } catch (err) {

        console.log(err);

        process.exit(1);

    }

};

seedDatabase();
