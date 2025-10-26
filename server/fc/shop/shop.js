const express = require('express');
const router = express.Router();
const Shop = require('../../model/shop');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ตั้งค่า multer สำหรับอัปโหลดไฟล์
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/shops/');
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


router.post('/post', upload.single('image'), async (req, res) => {
    try {
        const { name, href } = req.body;
        
        // ตรวจสอบข้อมูลที่จำเป็น
        if (!name || !href) {
            return res.status(400).json({ error: 'กรุณากรอกชื่อร้านค้าและลิงก์ปลายทาง' });
        }
        
        // ตรวจสอบว่ามีไฟล์อัปโหลดหรือไม่
        if (!req.file) {
            return res.status(400).json({ error: 'กรุณาอัปโหลดภาพ' });
        }
        
        // เก็บเฉพาะ path ของไฟล์
        const imagePath = `uploads/shops/${req.file.filename}`;
        
        // บันทึกลงฐานข้อมูล
        const newShop = await Shop.create({ 
            name, 
            image: imagePath, 
            href 
        });
        
        res.status(201).json(newShop);
    } catch (err) {
        // ลบไฟล์ที่อัปโหลดแล้วถ้าเกิดข้อผิดพลาด
        if (req.file) {
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting file:', unlinkErr);
            });
        }
        res.status(400).json({ error: 'ไม่สามารถเพิ่มร้านค้าได้', details: err.message });
    }
});

router.get('/get', async (req, res) => {
    const shops = await Shop.findAll();
    
    // แปลง path เป็น full URL เมื่อส่ง response
    const shopsWithFullUrl = shops.map(shop => {
        const shopData = shop.toJSON();
        if (shopData.image) {
            shopData.image = `${process.env.IMAGEURL}/${shopData.image}`;
        }
        return shopData;
    });
    
    res.json(shopsWithFullUrl);
});

router.put('/put/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, href } = req.body;
        
        // ตรวจสอบข้อมูลที่จำเป็น
        if (!name || !href) {
            return res.status(400).json({ error: 'กรุณากรอกชื่อร้านค้าและลิงก์ปลายทาง' });
        }
        
        const shop = await Shop.findByPk(id);
        if (!shop) {
            return res.status(404).json({ error: 'ไม่พบร้านค้านี้' });
        }
        
        let imagePath = shop.image; // ใช้ภาพเดิม
        
        // ถ้ามีไฟล์ใหม่อัปโหลด
        if (req.file) {
            // ลบไฟล์เก่า
            const oldImagePath = shop.image;
            const fullOldPath = path.join(__dirname, '../../', oldImagePath);
            if (fs.existsSync(fullOldPath)) {
                fs.unlinkSync(fullOldPath);
            }
            
            // เก็บเฉพาะ path ของไฟล์ใหม่
            imagePath = `uploads/shops/${req.file.filename}`;
        }
        
        // อัปเดตข้อมูล
        await shop.update({ name, image: imagePath, href });
        res.json(shop);
    } catch (err) {
        // ลบไฟล์ที่อัปโหลดแล้วถ้าเกิดข้อผิดพลาด
        if (req.file) {
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting file:', unlinkErr);
            });
        }
        res.status(400).json({ error: 'ไม่สามารถแก้ไขร้านค้าได้', details: err.message });
    }
});


router.delete('/del/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const shop = await Shop.findByPk(id);
        if (!shop) {
            return res.status(404).json({ error: 'ไม่พบร้านค้านี้' });
        }
        await shop.destroy();
        res.json({ message: 'ลบร้านค้าเรียบร้อยแล้ว' });
    } catch (err) {
        res.status(400).json({ error: 'ไม่สามารถลบร้านค้าได้', details: err.message });
    }
});

module.exports = router;