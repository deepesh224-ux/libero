const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// ── MULTER STORAGE ──────────────────────────────────────────────────────────

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/images/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images only (jpg/png/webp)!'));
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// ── ENDPOINT ─────────────────────────────────────────────────────────────────

// POST /api/upload
router.post('/', protect, adminOnly, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
        imageUrl: `/images/${req.file.filename}`
    });
});

module.exports = router;
