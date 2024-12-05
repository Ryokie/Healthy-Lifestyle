const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Buat folder 'assets' jika belum ada
const assetsFolder = path.join(__dirname, "assets");
if (!fs.existsSync(assetsFolder)) {
    fs.mkdirSync(assetsFolder);
    console.log("Folder 'assets' berhasil dibuat.");
} else {
    console.log("Folder 'assets' sudah ada.");
}

// Serve static files (images) from the 'assets' folder
app.use('/assets', express.static('assets'));

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/frontend", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Terhubung ke MongoDB.");
}).catch((err) => {
    console.error("Gagal terhubung ke MongoDB:", err.message);
});

// Journal Schema
const journalSchema = new mongoose.Schema({
    nama: { type: String, required: true },
    journal: { type: String, required: true },
    tanggal: { type: Date, default: Date.now },
});

const Journal = mongoose.model('Journal', journalSchema);


// Menu Schema
const menuSchema = new mongoose.Schema({
    namaMakanan: { type: String, required: true },
    lamaPembuatan: { type: Number, required: true },
    kkal: { type: Number, required: true },
    lemak: { type: Number, required: true },
    karbohidrat: { type: Number, required: true },
    protein: { type: Number, required: true },
    gambar: { type: String }, // Ganti kosong dengan tipe data String
    bahanBahan: { type: String, required: true },
    tahapPembuatan: { type: String, required: true },
});

const Menu = mongoose.model("Menu", menuSchema);

// User Schema for `users` collection
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// User Schema for `users1` collection
const user1Schema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User1 = mongoose.model("User1", user1Schema);

// File Upload Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderPath = path.join(__dirname, "assets");
        fs.access(folderPath, fs.constants.W_OK, (err) => {
            if (err) {
                console.error("Server tidak memiliki izin menulis di folder:", folderPath);
                return cb(new Error("Izin menulis ke folder 'assets' ditolak"));
            }
            cb(null, folderPath);
        });
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = (req, res, next) => {
    next(); // Bypass multer since we no longer need file handling
};

// Tambah journal baru
app.post('/api/journal', (req, res) => {
    const { nama, journal } = req.body;

    if (!nama || !journal) {
        return res.status(400).json({ message: 'Nama dan journal harus diisi!' });
    }

    const newJournal = new Journal({ nama, journal });

    newJournal.save()
        .then(() => res.status(201).json({ message: 'Journal berhasil ditambahkan!' }))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Ambil semua journal
app.get('/api/journal', (req, res) => {
    Journal.find()
        .then(journals => res.status(200).json(journals))
        .catch(err => res.status(500).json({ error: err.message }));
});


// Delete user berdasarkan username
app.delete("/api/user1", (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: "Username harus disediakan!" });
    }

    User1.findOneAndDelete({ username }) // Ganti User dengan User1
        .then((deletedUser) => {
            if (!deletedUser) {
                return res.status(404).json({ message: "User tidak ditemukan!" });
            }
            res.status(200).json({ message: "User berhasil dihapus!" });
        })
        .catch((err) => res.status(500).json({ error: err.message }));
});


app.get("/api/user1", (req, res) => {
    User1.find()
        .then((users) => res.status(200).json(users))
        .catch((err) => res.status(500).json({ error: err.message }));
});


// Update user berdasarkan username
app.put("/api/user1", (req, res) => {
    const { username, passwordBaru } = req.body;

    if (!username || !passwordBaru) {
        return res.status(400).json({ message: "Username dan password baru harus disediakan!" });
    }

    bcrypt.hash(passwordBaru, 10)
        .then((hashedPassword) => {
            return User.findOneAndUpdate(
                { username },
                { password: hashedPassword },
                { new: true }
            );
        })
        .then((updatedUser) => {
            if (!updatedUser) {
                return res.status(404).json({ message: "User tidak ditemukan!" });
            }
            res.status(200).json({ message: "User berhasil diperbarui!", data: updatedUser });
        })
        .catch((err) => res.status(500).json({ error: err.message }));
});


app.post("/api/menu", (req, res) => {
    const { namaMakanan, lamaPembuatan, kkal, lemak, karbohidrat, protein, bahanBahan, tahapPembuatan } = req.body;

    const newMenu = new Menu({
        namaMakanan,
        lamaPembuatan,
        kkal,
        lemak,
        karbohidrat,
        protein,
        bahanBahan,
        tahapPembuatan,
        jenisMakanan, // <-- Ini menyebabkan error karena 'jenisMakanan' tidak didefinisikan sebelumnya
    });


    newMenu
        .save()
        .then(() => res.status(201).json({ message: "Menu berhasil ditambahkan!" }))
        .catch((err) => res.status(500).json({ error: err.message }));
});




// Fetch all menu items
app.get("/api/recipes", (req, res) => {
    Menu.find()
        .then((menus) => res.status(200).json(menus))
        .catch((err) => res.status(500).json({ error: err.message }));
});

// Registration for `users` collection
app.post("/register/users", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username sudah terdaftar" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User berhasil terdaftar di users!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login for `users` collection
app.post("/login/users", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Username atau password salah" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Username atau password salah" });
        }

        res.status(200).json({ message: "Login berhasil di users!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Registration for `users1` collection
app.post("/register/users1", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User1.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username sudah terdaftar" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User1({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User berhasil terdaftar" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login for `users1` collection
app.post("/login/users1", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User1.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Username atau password salah" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Username atau password salah" });
        }

        res.status(200).json({ message: "Login berhasil" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Artikel Schema
const artikelSchema = new mongoose.Schema({
    judul: { type: String, required: true },
    deskripsi: { type: String, required: true },
    konten: { type: String, required: true },
    tanggal: { type: Date, default: Date.now },
});

// Artikel Model
const Artikel = mongoose.model("Artikel", artikelSchema);

// Endpoint untuk menambahkan artikel baru
app.post("/api/artikel", (req, res) => {
    const { judul, deskripsi, konten } = req.body;

    // Validasi sederhana sebelum menyimpan
    if (!judul || !deskripsi || !konten) {
        return res.status(400).json({ message: "Semua field harus diisi!" });
    }

    const newArtikel = new Artikel({
        judul,
        deskripsi,
        konten,
    });

    newArtikel
        .save()
        .then(() => res.status(201).json({ message: "Artikel berhasil ditambahkan!" }))
        .catch((err) => res.status(500).json({ error: err.message }));
});

// Endpoint untuk mendapatkan semua artikel
app.get("/api/artikel", (req, res) => {
    Artikel.find()
        .then((artikels) => res.status(200).json(artikels))
        .catch((err) => res.status(500).json({ error: err.message }));
});

app.put("/api/artikel", (req, res) => {
    const { judul, deskripsi, konten, judulBaru } = req.body;

    if (!judul || !deskripsi || !konten) {
        return res.status(400).json({ message: "Judul, deskripsi, dan konten harus diisi!" });
    }

    Artikel.findOneAndUpdate(
        { judul: judul },
        { judul: judulBaru || judul, deskripsi, konten },
        { new: true } // Mengembalikan artikel yang diperbarui
    )
        .then((updatedArtikel) => {
            if (!updatedArtikel) {
                return res.status(404).json({ message: "Artikel tidak ditemukan!" });
            }
            res.status(200).json({ message: "Artikel berhasil diperbarui!", data: updatedArtikel });
        })
        .catch((err) => res.status(500).json({ error: err.message }));
});


app.delete("/api/artikel", (req, res) => {
    const { judul } = req.body;

    if (!judul) {
        return res.status(400).json({ message: "Judul artikel harus disediakan!" });
    }

    Artikel.findOneAndDelete({ judul: judul })
        .then((deletedArtikel) => {
            if (!deletedArtikel) {
                return res.status(404).json({ message: "Artikel tidak ditemukan!" });
            }
            res.status(200).json({ message: "Artikel berhasil dihapus!" });
        })
        .catch((err) => res.status(500).json({ error: err.message }));
});



// Start Server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server berjalan pada http://localhost:${PORT}`);
});
