
const { pool} = require("./mysql")

async function createOrder(userId, cartItems) {
    const [orderResult] = await pool.query(
        "INSERT INTO orders (user_id, created_at) VALUES (?, NOW())",
        [userId]
    );
    const orderId = orderResult.insertId;

    const itemCounts = {};
    for (const productId of cartItems) {
        itemCounts[productId] = (itemCounts[productId] || 0) + 1;
    }
    for (const [productId, quantity] of Object.entries(itemCounts)) {
        await pool.query(
            "INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)",
            [orderId, productId, quantity]
        );
    }
    return orderId;
}
module.exports = {createOrder};