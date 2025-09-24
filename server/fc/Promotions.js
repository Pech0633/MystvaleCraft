const express = require('express');
const router = express.Router();
const Promotions = require('../model/promotions');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ตั้งค่า multer สำหรับอัปโหลดไฟล์
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // สร้างโฟลเดอร์ uploads/Promotions ถ้ายังไม่มี
        const uploadDir = 'uploads/Promotions/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // สร้างชื่อไฟล์ใหม่ด้วย timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // จำกัดขนาดไฟล์ 10MB
    },
    fileFilter: function (req, file, cb) {
        // ตรวจสอบประเภทไฟล์
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('รองรับเฉพาะไฟล์ภาพเท่านั้น'), false);
        }
    }
});

// เพิ่มโปรโมชั่น (Create)
router.post('/post', upload.single('img'), async (req, res) => {
    try {
        // ตรวจสอบว่ามีไฟล์อัปโหลดหรือไม่
        if (!req.file) {
            return res.status(400).json({ error: 'กรุณาอัปโหลดภาพ' });
        }
        
        const data = {
            ...req.body,
            img: `${process.env.IMAGEURL}/uploads/Promotions/${req.file.filename}`
        };
        const newPromotions = await Promotions.create(data);
        res.json(newPromotions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// แก้ไขโปรโมชั่น (Update)
router.put('/put/:id', upload.single('img'), async (req, res) => {
    try {
        const { id } = req.params;
        const data = { ...req.body };
        
        // ถ้ามีการอัปโหลดไฟล์ใหม่ ให้อัปเดต img
        if (req.file) {
            data.img = `${process.env.IMAGEURL}/uploads/Promotions/${req.file.filename}`;
        }
        
        const updated = await Promotions.update(data, {
            where: { id }
        });
        res.json({ message: 'Promotions updated', updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ดึงข้อมูลโปรโมชั่นทั้งหมด
router.get('/', async (req, res) => {
    try {
        const Promotionss = await Promotions.findAll();
        res.json(Promotionss);
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/get/:type', async (req, res) => {
    const type = req.params.type;

    try {
        const Promotionss = await Promotions.findAll({
            where: { type }
        });

        res.json(Promotionss);
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ลบสินค้า (Delete)
router.delete('/del/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Promotions.destroy({
            where: { id }
        });
        res.json({ message: 'Promotions deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
