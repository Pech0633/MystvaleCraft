const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ตั้งค่า multer สำหรับอัปโหลดไฟล์
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/products/');
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

// เพิ่มสินค้า (Create)
router.post('/post', upload.single('priceture'), async (req, res) => {
    try {
        const { name, price, command, Optionsquantity, type, rank_id, rank_set } = req.body;
        
        // ตรวจสอบข้อมูลที่จำเป็น
        if (!name || !price) {
            return res.status(400).json({ error: 'กรุณากรอกชื่อสินค้าและราคา' });
        }
        
        // ตรวจสอบว่ามีไฟล์อัปโหลดหรือไม่ (เฉพาะตอนสร้างใหม่)
        if (!req.file) {
            return res.status(400).json({ error: 'กรุณาอัปโหลดภาพ' });
        }
        
        // สร้าง URL สำหรับภาพ
        const imageUrl = `${process.env.IMAGEURL}/uploads/products/${req.file.filename}`;
        
        // บันทึกลงฐานข้อมูล
        const newProduct = await Product.create({
            name,
            price,
            command,
            Optionsquantity,
            type,
            rank_id,
            rank_set,
            priceture: imageUrl
        });
        
        res.json(newProduct);
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


// แก้ไขสินค้า (Update)
router.put('/put/:id', upload.single('priceture'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, command, Optionsquantity, type, rank_id, rank_set } = req.body;
        
        // ตรวจสอบข้อมูลที่จำเป็น
        if (!name || !price) {
            return res.status(400).json({ error: 'กรุณากรอกชื่อสินค้าและราคา' });
        }
        
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'ไม่พบสินค้านี้' });
        }
        
        let imageUrl = product.priceture; // ใช้ภาพเดิม
        
        // ถ้ามีไฟล์ใหม่อัปโหลด
        if (req.file) {
            // ลบไฟล์เก่า
            if (product.priceture && product.priceture.includes(process.env.IMAGEURL)) {
                const oldImagePath = product.priceture.replace(`${process.env.IMAGEURL}/`, '');
                const fullOldPath = path.join(__dirname, '../..', oldImagePath);
                if (fs.existsSync(fullOldPath)) {
                    fs.unlinkSync(fullOldPath);
                }
            }
            
            // สร้าง URL สำหรับภาพใหม่
            imageUrl = `${process.env.IMAGEURL}/uploads/products/${req.file.filename}`;
        }
        
        // อัปเดตข้อมูล
        await product.update({
            name,
            price,
            command,
            Optionsquantity,
            type,
            rank_id,
            rank_set,
            priceture: imageUrl
        });
        
        res.json({ message: 'Product updated', product });
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
router.get('/get/:type', async (req, res) => {
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

// ลบสินค้า (Delete)
router.delete('/del/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'ไม่พบสินค้านี้' });
        }
        
        // ลบไฟล์ภาพ
        if (product.priceture && product.priceture.includes(process.env.IMAGEURL)) {
            const imagePath = product.priceture.replace(`${process.env.IMAGEURL}/`, '');
            const fullImagePath = path.join(__dirname, '../..', imagePath);
            if (fs.existsSync(fullImagePath)) {
                fs.unlinkSync(fullImagePath);
            }
        }
        
        await Product.destroy({
            where: { id }
        });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
