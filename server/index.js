require('dotenv').config(); // ⭐ ต้องอยู่บรรทัดแรกสุด!

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Rcon } = require('rcon-client');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

const app = express();

const Item = require('./model/item');
const User = require('./model/user');
const Ranks = require('./model/ranks');
const Productss = require('./fc/product');
const product = require('./model/product');
const Promotions = require('./model/promotions');
const Checkpromotions = require('./model/checkpromotions');
const Code = require('./model/code');
const News = require('./model/new');
const Shop = require('./fc/shop/shop');
const blacklist = [];
const bodyParser = require('body-parser');
const twApi = require('@opecgame/twapi');
const { Webhook, MessageBuilder } = require('discord-webhook-node');
const hook = new Webhook("https://discord.com/api/webhooks/1432209069829001318/z1LgnyZtU0fqYl55XahLrsvlQ9F24-A-pCbgHJe3AaClbkiYyERBRparw6NorUMFB_7d");
const promotions = require('./fc/Promotions');
const Backend = require('./model/backend');
const IsCode = require('./model/iscode');

// ตรวจสอบว่าโหลด env สำเร็จ
console.log('✅ IMAGEURL:', process.env.IMAGEURL);
console.log('✅ TEST:', process.env.TEST);

const { connect, sync } = require('./database');
const e = require('express');
async function initDB() {
    await connect();
    await sync();
}
initDB();


const corsOptions = {
    origin: "http://localhost:4000",
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));

app.get('/getcode', (req, res) => {
    Code.findAll().then(codes => {
        res.json(codes);
    }).catch(err => {
        res.status(500).json({ status: false, error: 'Server error' });
    });
}); 

app.post('/code', async (req, res) => {
  try {
    const { userId, equal } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "ไม่พบผู้ใช้" });
    }

    const code = await Code.findOne({ where: { equal } });
    if (!code) {
      return res.json({ status: false, message: "ไม่พบโค้ดในระบบ" });
    }


    const alreadyUsed = await IsCode.findOne({
      where: { username: user.username, equal },
    });
    if (alreadyUsed) {
      return res.json({ status: false, message: "คุณใช้โค้ดนี้ไปแล้ว" });
    }


    if (code.point > 0) {
      user.point += code.point;
      await user.save();

      await IsCode.create({ username: user.username, equal: code.equal });

      return res.json({
        status: true,
        message: "แลกโค้ดสำเร็จ",
        newPoint: user.point,
      });
    }

    try {
      const rcon = await Rcon.connect({
        host: process.env.RCON_HOST,
        port: Number(process.env.RCON_PORT),
        password: process.env.RCON_PASSWORD,
      });

      const rankCommand = code.command.replace(/%player%/g, user.username);

      await rcon.send(rankCommand);
      await rcon.end();

      await IsCode.create({ username: user.username, equal: code.equal });

      return res.json({ status: true, message: "แลกโค้ดสำเร็จ" });
    } catch (error) {
      console.error("RCON Error:", error);
      return res.status(500).json({
        status: false,
        message: "เชื่อมต่อ RCON ไม่ได้ (เซิร์ฟเวอร์อาจปิด)",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, error: "Server error" });
  }
});

app.put('/admin/code/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { command, point, equal } = req.body;

    const cod = await Code.findByPk(id);
    if (!cod) {
      return res.status(404).json({ status: false, message: 'Code not found' });
    }

    // ✅ อัปเดตข้อมูลในแถวนี้โดยตรง
    await cod.update({
      command,
      point,
      equal
    });

    res.json({ status: true, message: 'อัปเดตโค้ดสำเร็จ', data: cod });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' });
  }
});

app.post('/admin/code', async (req, res) => {
    try {
        const { command, point, equal } = req.body;

        const newCode = await Code.create({
            command,
            point,
            equal
        });

        res.json({ status: true, message: 'สร้างโค้ดสำเร็จ', data: newCode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' });
    }
});

app.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id','username', 'point', 'RP', 'realname']
        });
        res.json(users);
        console.log(process.env.TEST);
    } catch (error) {
        res.status(500).json({ status: false, error: 'Server error' });
    }
});

app.get('/rank_set', async (req, res) => {
    try {
        const users = await product.findAll({
            attributes: ['rank_id']
        });
        // filter เฉพาะที่ไม่ใช่ 0 แล้ว map ให้ key เป็น id
        const result = users.filter(u => u.rank_id !== 0).map(u => ({ id: u.rank_id }));
        res.json(result);
        console.log(process.env.TEST);
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
            point: user.point,
            RP: user.RP
        }
    });
});
app.post('/code/dl/:id', async (req, res) => {
    const id = req.params.id;
    const cod = await Code.findByPk(id);
    if (cod) {
        await cod.destroy();  
    }
});

app.get('/user/:token', async (req, res) => {
    const token = req.params.token;
    jwt.verify(token, 'secret', async (err, decoded) => {
        if (err) return res.status(401).json({ status: false, error: 'Invalid token' });

        try {
            const user = await User.findOne({ where: { realname: decoded.realname } });
            if (!user) return res.status(404).json({ status: false, error: 'User not found' });

            const { id, username, realname, point, RP } = user;
            return res.status(200).json({ status: true, data: { id, username, realname, point, RP } });
        } catch (error) {
            return res.status(500).json({ status: false, error: 'Server error' });
        }
    });
});


app.post("/buy", async (req, res) => {
    const { Id, userId, quantity, idrank, rankup, type } = req.body;
    if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ status: false, message: "จำนวนต้องเป็นเลขจำนวนเต็มมากกว่า 0" });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ status: false, message: "User not found" });

    if (type === 'ยศ') {
        if (!Id) return res.status(400).json({ status: false, message: "Missing rank Id" });

        const rank = await product.findByPk(Id);
        if (!rank) return res.status(404).json({ status: false, message: "Rank not found" });

        const totalPrice = rank.price * quantity;
        if (user.point < totalPrice) {
            return res.json({ status: false, message: "คุณมี point ไม่พอ" });
        }

        // เงื่อนไข: ซื้อได้เฉพาะยศถัดไปทีละขั้น หรืออัปเกรดข้ามขั้นถ้า rankup > user.rank
        const shouldUpgrade = (idrank > 0 && idrank === user.rank + 1) || (idrank === 0 && rankup === user.rank);
        if (!shouldUpgrade) {
            return res.json({ status: false, message: "เกิดข้อผิดพลาดในการชำระเงิน (ซื้อได้เฉพาะยศถัดไปทีละขั้น หรืออัปเกรดข้ามขั้น)" });
        }

        try {
            const rcon = await Rcon.connect({ host: process.env.RCON_HOST, port: Number(process.env.RCON_PORT), password: process.env.RCON_PASSWORD });
            const rankCommand = rank.command.replace("%player%", user.realname).replace("%q%", quantity);
            await rcon.send(rankCommand);
            await rcon.end();

            user.point -= totalPrice;
            user.rank = idrank > 0 ? idrank : user.rank + 1;
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
            const rcon = await Rcon.connect({ host: process.env.RCON_HOST, port: Number(process.env.RCON_PORT), password: process.env.RCON_PASSWORD });
            const rankCommand = rank.command.replace("%player%", user.realname).replace("%q%", quantity);
            await rcon.send(itemCommand);
            rcon.end();

            user.point -= totalPrice;
            await user.save();

            return res.json({ status: true, message: "คุณซื้อสำเร็จ", newPoint: user.point });
        } catch (error) {
            console.error("RCON Error:", error);
            return res.status(500).json({ status: false, message: "เซิฟไม่ได้ออนไลน์" });
        }
    }
});

app.post("/git", async (req, res) => {
    const { Id, userId, quantity, idrank, rankup, type, ppgive } = req.body;

    // เช็ค quantity
    if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ status: false, message: "จำนวนต้องเป็นเลขจำนวนเต็มมากกว่า 0" });
    }

    const user = await User.findByPk(userId);
    const pgive = await User.findByPk(ppgive);
    if (!user) return res.status(404).json({ status: false, message: "User not found" });

    if (type === 'ยศ') {
        if (!Id) return res.status(400).json({ status: false, message: "Missing rank Id" });

        const rank = await product.findByPk(Id);
        if (!rank) return res.status(404).json({ status: false, message: "Rank not found" });

        const totalPrice = rank.price * quantity;
        if (pgive.point < totalPrice) {
            return res.json({ status: false, message: "คุณมี point ไม่พอ" });
        }

        // เงื่อนไข: ซื้อได้เฉพาะยศถัดไปทีละขั้น หรืออัปเกรดข้ามขั้นถ้า rankup > pgive.rank
        const shouldUpgrade = (idrank > 0 && idrank === user.rank + 1) || (idrank === 0 && rankup === user.rank);
        if (!shouldUpgrade) {
            return res.json({ status: false, message: "เกิดข้อผิดพลาดในการชำระเงิน (ซื้อได้เฉพาะยศถัดไปทีละขั้น หรืออัปเกรดข้ามขั้น)" });
        }

        try {
            const rcon = await Rcon.connect({ host: process.env.RCON_HOST, port: Number(process.env.RCON_PORT), password: process.env.RCON_PASSWORD });
            const rankCommand = rank.command.replace("%player%", user.username).replace("%q%", quantity);
            await rcon.send(rankCommand);
            await rcon.end();

            pgive.point -= totalPrice;
            user.rank = idrank > 0 ? idrank : user.rank + 1;
            await user.save();
            await pgive.save();

            return res.json({ status: true, message: "คุณซื้อสำเร็จ", newPoint: pgive.point });
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
        if (pgive.point < totalPrice) {
            return res.status(400).json({ status: false, message: "คุณมี point ไม่พอ" });
        }

        try {
            const rcon = await Rcon.connect({ host: process.env.RCON_HOST, port: Number(process.env.RCON_PORT), password: process.env.RCON_PASSWORD });
            const itemCommand = item.command.replace("%player%", user.username).replace("%q%", quantity);
            await rcon.send(itemCommand);
            await rcon.end();

            pgive.point -= totalPrice;
            await pgive.save();

            return res.json({ status: true, message: "คุณซื้อสำเร็จ", newPoint: pgive.point });
        } catch (error) {
            console.error("RCON Error:", error);
            return res.status(500).json({ status: false, message: "เซิฟไม่ได้ออนไลน์" });
        }
    }
});

app.post("/getpromotion", async (req, res) => {
    const { promotionsid, userId } = req.body;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ status: false, message: "User not found" });

    const promotion = await Promotions.findByPk(promotionsid);
    if (!promotion) return res.status(404).json({ status: false, message: "Promotion not found" });

    if (user.RP < promotion.rplimited) {
        return res.status(400).json({ status: false, message: "คุณมี RP ไม่พอ" });
    }

    // เช็กว่ารับไปแล้วหรือยัง
    const already = await Checkpromotions.findOne({
        where: { name: user.username, promotionsid }
    });
    if (already) {
        return res.status(400).json({ status: false, message: "คุณรับโปรโมชั่นนี้ไปแล้ว" });
    }
    const rcon = await Rcon.connect({ host: process.env.RCON_HOST, port: Number(process.env.RCON_PORT), password: process.env.RCON_PASSWORD });
    const promotionCommand = promotion.command.replace("%player%", user.username);
    await rcon.send(promotionCommand);
    await rcon.end();
    // สร้าง record ใหม่
    await Checkpromotions.create({
        name: user.username,
        promotionsid: promotionsid,
    });

    return res.json({ status: true, message: "คุณรับสิทธิ์สำเร็จ" });
});

app.post("/editpassworld", async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    const saltRounds = 10;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: 'ไม่พบผู้ใช้' });
    }

    // ตรวจสอบรหัสผ่านเก่าให้ถูกต้อง (เทียบกับ hashed password)
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ status: false, message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    // รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเก่า
    if (oldPassword === newPassword) {
      return res.status(400).json({ status: false, message: 'รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม' });
    }

    // รหัสผ่านใหม่ต้องไม่เหมือนชื่อผู้ใช้
    if (newPassword === user.username) {
      return res.status(400).json({ status: false, message: 'รหัสผ่านใหม่ต้องไม่ตรงกับชื่อผู้ใช้' });
    }

    // เข้ารหัสรหัสผ่านใหม่และบันทึก
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();

    res.json({ status: true, message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' });
  }
});


app.get('/promotions/:username', async (req, res) => {
    const username = req.params.username;

    // 1. ดึง id โปรโมชั่นที่ username นี้เคยรับไปแล้ว
    const received = await Checkpromotions.findAll({
        where: { name: username },
        attributes: ['promotionsid']
    });
    // แปลงเป็น array ของ id
    const receivedIds = received.map(r => r.promotionsid);

    // 2. ดึงโปรโมชั่นทั้งหมดที่ยังไม่เคยรับ
    const promotionsList = await Promotions.findAll({
        where: {
            id: { [Op.notIn]: receivedIds }
        }
    });

    // 3. แปลง path เป็น full URL
    const promotionsWithFullUrl = promotionsList.map(promotion => {
        const promotionData = promotion.toJSON();
        if (promotionData.img) {
            promotionData.img = `${process.env.IMAGEURL}/${promotionData.img}`;
        }
        return promotionData;
    });

    res.json(promotionsWithFullUrl);
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

app.get('/backend', async (req, res) => {
    const backend = await Backend.findAll();
    res.json(backend);
});


app.use('/shop', Shop);

// เพิ่ม route สำหรับเข้าถึงไฟล์ภาพ
app.use('/uploads', express.static('uploads'));
app.use('/promotions', promotions);
app.use('/product', Productss);

app.use(express.json({ limit: '50mb' }));

async function getWallet(code) {
    try {
        const phoneNumber = process.env.phoneNumber;
        const tw = await twApi(code, phoneNumber);
        let result;
        switch (tw.status.code) {
            case "SUCCESS":
                result = { status: 'SUCCESS', amount: tw.data.my_ticket.amount_baht };
                break;
            case "CANNOT_GET_OWN_VOUCHER":
                result = { status: 'FAIL', reason: 'รับซองตัวเองไม่ได้' };
                break;
            case "TARGET_USER_NOT_FOUND":
                result = { status: 'FAIL', reason: 'ไม่พบเบอร์นี้ในระบบ' };
                break;
            case "INTERNAL_ERROR":
                result = { status: 'FAIL', reason: 'ไม่พบซองนี้ในระบบ หรือ URL ผิด' };
                break;
            case "VOUCHER_OUT_OF_STOCK":
                result = { status: 'FAIL', reason: 'มีคนรับไปแล้ว' };
                break;
            case "VOUCHER_NOT_FOUND":
                result = { status: 'FAIL', reason: 'ไม่พบซองในระบบ' };
                break;
            case "VOUCHER_EXPIRED":
                result = { status: 'FAIL', reason: 'ซองวอเลทนี้หมดอายุแล้ว' };
                break;
            default:
                result = { status: 'FAIL', reason: 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ' };
                break;
        }
        return result;
    } catch (error) {
        return { status: 'FAIL', reason: error.message || 'An unexpected error occurred' };
    }
}

function calculateDiamonds(amount) {
    return Math.floor(amount * process.env.rate);
}

app.post('/redeem', async (req, res) => {
    const { playerName, code, userId } = req.body;
    const user = await User.findByPk(userId);
    if (!playerName || !code || !userId) {
        return res.status(400).json({ 
            status: 'FAIL', 
            reason: 'Missing required fields',
        });
    }

    try {
        const result = await getWallet(code); 
        if (result.status === 'SUCCESS') {
            const points = calculateDiamonds(result.amount);
            user.point += points;
            user.RP += result.amount;
            await user.save();

            const embed = new MessageBuilder()
            .setTitle('ผู้เล่น ' + playerName)
            .setDescription('ได้เติมเงินจำนวน ' + result.amount + ' บาท ได้รับพอยท์จำนวน ' + points + ' พอยท์ ผ่านTrueWallet')
            .setTimestamp();
            
            hook.send(embed);
            
            res.json({ 
                status: 'SUCCESS', 
                message: 'เติมเงินสำเร็จ',
                amount: result.amount,
                points: points
            });
        } else {
            res.status(400).json({ 
                status: 'FAIL',
                reason: result.reason || 'Unknown error',
                errorDetails: result
            });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            status: 'FAIL', 
            reason: 'Internal Server Error',
            error: error.message
        });
    }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const SLIPOK_JSON_PATH = path.join(__dirname, 'slipok.json');

// ฟังก์ชันอ่าน slipok.json
function readSlipokJson() {
  try {
    if (!fs.existsSync(SLIPOK_JSON_PATH)) return [];
    const data = fs.readFileSync(SLIPOK_JSON_PATH, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

// ฟังก์ชันเขียน slipok.json
function writeSlipokJson(data) {
  fs.writeFileSync(SLIPOK_JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
}

app.post('/slipok', upload.single('files'), async (req, res) => {
  const file = req.file;
  const { playerName = '-', userId } = req.body;
  
  if (!userId) return res.status(400).json({ status: 'FAIL', reason: 'Missing userId' });
  
  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ status: 'FAIL', reason: 'User not found' });

  const formData = new FormData();
  formData.append('files', file.buffer, file.originalname);

  try {
    const response = await axios.post('https://api.slipok.com/api/line/apikey/55189', formData, { 
      headers: { ...formData.getHeaders(), 'x-authorization': 'SLIPOK85EENAL' } 
    });
    
    const slipData = response.data;
    console.log('Slipok Full Response:', JSON.stringify(slipData, null, 2)); // Debug log
    
    // ตรวจสอบว่าเป็น object หรือ string
    let transRef, amount, sender, receiver, dateTime;
    
    if (typeof slipData === 'string') {
      // ถ้าเป็น string (เช่น "202510273svz0gRRfxWJB4I1T")
      transRef = slipData;
      amount = 0; // ไม่มีข้อมูล amount ต้องให้ user กรอกเอง
      return res.status(400).json({
        status: 'FAIL',
        reason: 'ไม่สามารถอ่านข้อมูลจำนวนเงินจากสลิปได้ กรุณาใช้ช่องทางอื่น',
        transRef
      });
    } else if (slipData && typeof slipData === 'object') {
      // ถ้าเป็น object ปกติ
      transRef = slipData.transRef || slipData.data?.transRef || slipData.ref || null;
      amount = Number(slipData.amount || slipData.data?.amount || 0);
      sender = slipData.data?.sender?.displayName || slipData.sender || null;
      receiver = slipData.data?.receiver?.displayName || slipData.receiver || null;
      dateTime = slipData.data?.sendingDateTime || slipData.data?.transDateTime || slipData.date || null;
    } else {
      return res.status(400).json({
        status: 'FAIL',
        reason: 'ไม่สามารถอ่านข้อมูลจากสลิปได้',
        rawData: slipData
      });
    }
    
    // ตรวจสอบว่ามีข้อมูลครบไหม
    if (!transRef) {
      return res.status(400).json({
        status: 'FAIL',
        reason: 'ไม่พบหมายเลขอ้างอิงจากสลิป',
        slipData
      });
    }
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        status: 'FAIL',
        reason: 'ไม่สามารถอ่านจำนวนเงินจากสลิปได้',
        transRef,
        slipData
      });
    }
    
    // สร้าง unique key
    const uniqueKey = `${transRef}_${amount}_${dateTime || ''}`;
    const uploaded = readSlipokJson();
    
    // ตรวจสอบซ้ำ
    const isDuplicate = uploaded.find(it => 
      it.transRef === transRef || 
      it.uniqueKey === uniqueKey
    );
    
    if (isDuplicate) {
      return res.status(400).json({ 
        status: 'FAIL', 
        reason: 'สลิปนี้ถูกใช้งานไปแล้ว', 
        transRef,
        uploadedAt: isDuplicate.uploadedAt,
        uploadedBy: isDuplicate.playerName
      });
    }

    // คำนวณแต้ม
    const points = calculateDiamonds(amount);
    
    // เพิ่มแต้มให้ผู้ใช้
    user.point += points;
    user.RP += amount;
    await user.save();

    // บันทึกข้อมูลสลิป
    uploaded.push({ 
      transRef,
      uniqueKey,
      amount,
      sender,
      receiver,
      dateTime,
      userId,
      playerName,
      uploadedAt: new Date().toISOString(), 
      slipData 
    });
    writeSlipokJson(uploaded);

    // Discord Webhook
    const embed = new MessageBuilder()
        .setTitle('ผู้เล่น ' + playerName)
        .setDescription(`ได้เติมเงินจำนวน ${amount} บาท ${points} แต้ม ผ่านธนาคาร`)
        .setTimestamp();
    hook.send(embed);

    res.json({ 
      status: 'SUCCESS', 
      message: 'เติมเงินสำเร็จ', 
      transRef,
      amountBaht: amount, 
      points, 
      newPoint: user.point 
    });
    
  } catch (error) {
    console.error('Slipok Error:', error.response?.data || error.message);
    res.status(500).json({ 
      status: 'FAIL', 
      reason: 'เกิดข้อผิดพลาดในการตรวจสอบสลิป',
      detail: error.response?.data || error.message 
    });
  }
});

// ================= ADMIN: แก้ไข user + เปลี่ยนรหัสผ่าน =================
app.put('/admin/user/:id', async (req, res) => {
  const { id } = req.params;
  const { username, point, RP, realname, newPassword, confirmPassword } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ status: false, message: 'User not found' });
    if (username !== undefined) user.username = username;
    if (point !== undefined) user.point = point;
    if (RP !== undefined) user.RP = RP;
    if (realname !== undefined) user.realname = realname;
    if (newPassword || confirmPassword) {
      if (!newPassword || !confirmPassword) {
        return res.status(400).json({ status: false, message: 'กรุณากรอกรหัสผ่านใหม่และยืนยันรหัสผ่าน' });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ status: false, message: 'รหัสผ่านใหม่ไม่ตรงกัน' });
      }
      if (newPassword === user.username) {
        return res.status(400).json({ status: false, message: 'รหัสผ่านใหม่ต้องไม่ตรงกับชื่อผู้ใช้' });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedPassword;
    }
    await user.save();
    res.json({ status: true, message: 'User updated (admin)' });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Server error', error: error.message });
  }
});

app.put('/user/:id', async (req, res) => {
  const { id } = req.params;
  const { username, point, RP, realname } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ status: false, message: 'User not found' });
    if (username !== undefined) user.username = username;
    if (point !== undefined) user.point = point;
    if (RP !== undefined) user.RP = RP;
    if (realname !== undefined) user.realname = realname;
    await user.save();
    res.json({ status: true, message: 'User updated' });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Server error', error: error.message });
  }
});



app.listen(3001, () => {
    console.log("✅ Server is running: http://localhost:3001/");
});