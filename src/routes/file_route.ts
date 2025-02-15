import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
const router = express.Router();

const base = process.env.DOMAIN_BASE + "/";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/')
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.')
            .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
            .slice(1)
            .join('.')
        cb(null, Date.now() + "." + ext)
    }
})
const upload = multer({ storage: storage });
router.post('/', upload.single("file"), function (req, res) {
    console.log("router.post(/file: " + base + req.file?.path)
    res.status(200).send({ url: base + req.file?.path })
});




router.get('/:filename', function (req, res) {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '../../storage', filename);

    try{
    fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }
        res.sendFile(filepath);
    });
} catch (err) {
    res.status(404).send('File not found');
}
});

export = router;