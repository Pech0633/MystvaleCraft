const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Rcon } = require('rcon-client');

const app = express();

const Item = require('./model/item');
const User = require('./model/user');
const Ranks = require('./model/ranks');
const Product = require('./model/product')
const Promotions = require('./model/promotions');
const News = require('./model/new');
const Shop = require('./model/shop');
const blacklist = [];

const { connect, sync } = require('./database');
const product = require('./model/product');
async function initDB() {
    await connect();
    await sync();
}
initDB();

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));

app.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['username', 'point']
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ status: false, error: 'Server error' });
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
        return res.status(404).json({ status: false, error: 'ไม่พบบัญชีผู้ใช้' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ status: false, error: 'รหัสผ่านไม่ถูกต้อง' });
    }

    const token = jwt.sign({ realname: user.realname }, 'secret', { expiresIn: '1d' });
    res.status(200).json({
        status: true,
        data: token,
        message: "เข้าสู่ระบบสำเร็จ",
        user: {
            token,
            id: user.id,
            username: user.username,
            realname: user.realname,
            point: user.point
        }
    });
});

app.get('/user/:token', async (req, res) => {
    const token = req.params.token;
    jwt.verify(token, 'secret', async (err, decoded) => {
        if (err) return res.status(401).json({ status: false, error: 'Invalid token' });

        try {
            const user = await User.findOne({ where: { realname: decoded.realname } });
            if (!user) return res.status(404).json({ status: false, error: 'User not found' });

            const { id, username, realname, point } = user;
            return res.status(200).json({ status: true, data: { id, username, realname, point } });
        } catch (error) {
            return res.status(500).json({ status: false, error: 'Server error' });
        }
    });
});

app.get('/logout/:token', async (req, res) => {
    const token = req.params.token;
    blacklist.push(token);
    res.status(200).json({ status: true, message: "Token ถูกเพิกถอนแล้ว" });
});

app.post("/buy", async (req, res) => {
    const { Id, userId, quantity, idrank, rankup, type } = req.body;

    // เช็ค quantity
    if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ status: false, message: "จำนวนต้องเป็นเลขจำนวนเต็มมากกว่า 0" });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ status: false, message: "User not found" });

    if (type === 'rank') {
        if (!Id) return res.status(400).json({ status: false, message: "Missing rank Id" });

        const rank = await product.findByPk(Id);
        if (!rank) return res.status(404).json({ status: false, message: "Rank not found" });

        const totalPrice = rank.price * quantity;
        if (user.point < totalPrice) {
            return res.json({ status: false, message: "คุณมี point ไม่พอ" });
        }

        const shouldUpgrade = (idrank > 0 && idrank === user.rank) || (idrank === 0 && rankup > user.rank);
        if (!shouldUpgrade) {
            return res.json({ status: false, message: "เกิดข้อผิดพลาดในการชำระเงิน" });
        }

        try {
            const rcon = await Rcon.connect({ host: "127.0.0.1", port: 25575, password: "preecha_0" });
            const rankCommand = rank.command.replace("%player%", user.username).replace("%quantity%", quantity);
            await rcon.send(rankCommand);
            await rcon.end();

            user.point -= totalPrice;
            user.rank = idrank > 0 ? user.rank + 1 : rankup;
            await user.save();

            return res.json({ status: true, message: "คุณซื้อสำเร็จ", newPoint: user.point });
        } catch (error) {
            console.error("RCON Error:", error);
            return res.status(500).json({ status: false, message: "เซิฟไม่ได้ออนไลน์" });
        }
    } else {
        // ซื้อไอเทมทั่วไป
        if (!Id) return res.status(400).json({ status: false, message: "Missing item Id" });

        const item = await product.findByPk(Id);
        if (!item) return res.status(404).json({ status: false, message: "Item not found" });

        const totalPrice = item.price * quantity;
        if (user.point < totalPrice) {
            return res.status(400).json({ status: false, message: "คุณมี point ไม่พอ" });
        }

        try {
            const rcon = await Rcon.connect({ host: "127.0.0.1", port: 25575, password: "preecha_0" });
            const itemCommand = item.command.replace("%player%", user.username).replace("%quantity%", quantity);
            await rcon.send(itemCommand);
            await rcon.end();

            user.point -= totalPrice;
            await user.save();

            return res.json({ status: true, message: "คุณซื้อสำเร็จ", newPoint: user.point });
        } catch (error) {
            console.error("RCON Error:", error);
            return res.status(500).json({ status: false, message: "เซิฟไม่ได้ออนไลน์" });
        }
    }
});



app.get('/product/:type', async (req, res) => {
    const type = req.params.type;

    try {
        const products = await Product.findAll({
            where: { type }
        });

        res.json(products);
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/promotions', async (req, res) => {
    const promotion = await Promotions.findAll();
    res.json(promotion);
});


app.get('/news', async (req, res) => {
    const news = await News.findAll();
    res.json(news);
});

app.get('/Item', async (req, res) => {
    const item = await Item.findAll();
    res.json(item);
});

app.get('/ranks', async (req, res) => {
    const rank = await Ranks.findAll();
    res.json(rank);
});

app.get('/shop', async (req, res) => {
    const shop = await Shop.findAll();
    res.json(shop);
});

app.use(express.json({ limit: '50mb' }));

app.listen(3001, () => {
    console.log("✅ Server is running: http://localhost:3001/");
});