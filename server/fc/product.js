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
        
        // เก็บเฉพาะ path ของไฟล์
        const data = {
            ...req.body,
            img: `uploads/Promotions/${req.file.filename}`
        };
        const newPromotions = await Promotions.create(data);
        res.json(newPromotions);
    } catch (error) {
        // ลบไฟล์ที่อัปโหลดแล้วถ้าเกิดข้อผิดพลาด
        if (req.file) {
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting file:', unlinkErr);
            });
        }
        res.status(500).json({ error: error.message });
    }
});

// แก้ไขโปรโมชั่น (Update)
router.put('/put/:id', upload.single('img'), async (req, res) => {
    try {
        const { id } = req.params;
        
        const promotion = await Promotions.findByPk(id);
        if (!promotion) {
            return res.status(404).json({ error: 'ไม่พบโปรโมชั่นนี้' });
        }
        
        const data = { ...req.body };
        
        // ถ้ามีการอัปโหลดไฟล์ใหม่
        if (req.file) {
            // ลบไฟล์เก่า
            if (promotion.img) {
                const oldImagePath = promotion.img;
                const fullOldPath = path.join(__dirname, '../..', oldImagePath);
                if (fs.existsSync(fullOldPath)) {
                    fs.unlinkSync(fullOldPath);
                }
            }
            
            // ใช้ path ของไฟล์ใหม่
            data.img = `uploads/Promotions/${req.file.filename}`;
        }
        
        await promotion.update(data);
        res.json({ message: 'Promotions updated', promotion });
    } catch (error) {
        // ลบไฟล์ที่อัปโหลดแล้วถ้าเกิดข้อผิดพลาด
        if (req.file) {
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting file:', unlinkErr);
            });
        }
        res.status(500).json({ error: error.message });
    }
});

// ดึงข้อมูลโปรโมชั่นทั้งหมด
router.get('/', async (req, res) => {
    try {
        const promotions = await Promotions.findAll();
        
        // แปลง path เป็น full URL เมื่อส่ง response
        const promotionsWithFullUrl = promotions.map(promotion => {
            const promotionData = promotion.toJSON();
            if (promotionData.img) {
                promotionData.img = `${process.env.IMAGEURL}/${promotionData.img}`;
            }
            return promotionData;
        });
        
        res.json(promotionsWithFullUrl);
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ดึงข้อมูลโปรโมชั่นตาม type
router.get('/get/:type', async (req, res) => {
    const type = req.params.type;

    try {
        const promotions = await Promotions.findAll({
            where: { type }
        });

        // แปลง path เป็น full URL เมื่อส่ง response
        const promotionsWithFullUrl = promotions.map(promotion => {
            const promotionData = promotion.toJSON();
            if (promotionData.img) {
                promotionData.img = `${process.env.IMAGEURL}/${promotionData.img}`;
            }
            return promotionData;
        });

        res.json(promotionsWithFullUrl);
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ลบโปรโมชั่น (Delete)
router.delete('/del/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const promotion = await Promotions.findByPk(id);
        if (!promotion) {
            return res.status(404).json({ error: 'ไม่พบโปรโมชั่นนี้' });
        }
        
        // ลบไฟล์ภาพ
        if (promotion.img) {
            const imagePath = promotion.img;
            const fullImagePath = path.join(__dirname, '../..', imagePath);
            if (fs.existsSync(fullImagePath)) {
                fs.unlinkSync(fullImagePath);
            }
        }
        
        await Promotions.destroy({
            where: { id }
        });
        res.json({ message: 'Promotions deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;