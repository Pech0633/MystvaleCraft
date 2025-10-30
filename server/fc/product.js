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
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('รองรับเฉพาะไฟล์ภาพเท่านั้น'), false);
        }
    }
});

// ✅ เพิ่มสินค้า (Create)
router.post('/post', upload.single('priceture'), async (req, res) => {
    try {
        const { name, price, command, Optionsquantity, type, rank_id, rank_set } = req.body;
        
        if (!name || !price) {
            return res.status(400).json({ error: 'กรุณากรอกชื่อสินค้าและราคา' });
        }
        
        if (!req.file) {
            return res.status(400).json({ error: 'กรุณาอัปโหลดภาพ' });
        }

        // ✅ เก็บเฉพาะ path ไฟล์ (ไม่รวม host)
        const imagePath = `uploads/products/${req.file.filename}`;

        const newProduct = await Product.create({
            name,
            price,
            command,
            Optionsquantity,
            type,
            rank_id,
            rank_set,
            priceture: imagePath
        });

        res.status(201).json(newProduct);
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, err => {
                if (err) console.error('Error deleting file:', err);
            });
        }
        res.status(500).json({ error: error.message });
    }
});

// ✅ แก้ไขสินค้า (Update)
router.put('/put/:id', upload.single('priceture'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, command, Optionsquantity, type, rank_id, rank_set } = req.body;

        if (!name || !price) {
            return res.status(400).json({ error: 'กรุณากรอกชื่อสินค้าและราคา' });
        }

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'ไม่พบสินค้านี้' });
        }

        let imagePath = product.priceture;

        // ถ้ามีอัปโหลดไฟล์ใหม่
        if (req.file) {
            const oldImagePath = path.join(__dirname, '../..', product.priceture);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            imagePath = `uploads/products/${req.file.filename}`;
        }

        await product.update({
            name,
            price,
            command,
            Optionsquantity,
            type,
            rank_id,
            rank_set,
            priceture: imagePath
        });

        res.json(product);
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, err => {
                if (err) console.error('Error deleting file:', err);
            });
        }
        res.status(500).json({ error: error.message });
    }
});

// ✅ ดึงสินค้าทั้งหมดตาม type (Read)
router.get('/get/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const products = await Product.findAll({ where: { type } });

        // ✅ แปลง path ให้เป็น full URL
        const productsWithFullUrl = products.map(product => {
            const data = product.toJSON();
            if (data.priceture) {
                data.priceture = `${process.env.IMAGEURL}/${data.priceture}`;
            }
            return data;
        });

        res.json(productsWithFullUrl);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ ลบสินค้า (Delete)
router.delete('/del/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'ไม่พบสินค้านี้' });
        }

        // ✅ ลบไฟล์ภาพในเครื่อง
        const fullImagePath = path.join(__dirname, '../..', product.priceture);
        if (fs.existsSync(fullImagePath)) {
            fs.unlinkSync(fullImagePath);
        }

        await product.destroy();
        res.json({ message: 'ลบสินค้าเรียบร้อยแล้ว' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
