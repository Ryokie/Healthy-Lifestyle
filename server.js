const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Inisialisasi aplikasi
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Koneksi ke MongoDB
const mongoURL = 'mongodb://localhost:27017/frontend'; // Database "frontend"
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Berhasil terhubung ke database frontend'))
    .catch((err) => console.error('Gagal menghubungkan ke MongoDB:', err));

// Definisi model Mongoose (schema data)
const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
});

const Item = mongoose.model('Item', ItemSchema);

// Endpoint CRUD
// 1. Tambah data (Create)
app.post('/api/items', async (req, res) => {
    try {
        const newItem = new Item(req.body); // Data dari frontend
        const savedItem = await newItem.save(); // Simpan ke MongoDB
        res.status(201).json(savedItem); // Kirim respon
    } catch (err) {
        res.status(400).json({ message: 'Gagal menyimpan data', error: err.message });
    }
});

// 2. Ambil semua data (Read)
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find(); // Ambil semua data dari koleksi
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil data', error: err.message });
    }
});

// 3. Perbarui data (Update)
app.put('/api/items/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) return res.status(404).json({ message: 'Item tidak ditemukan' });
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: 'Gagal memperbarui data', error: err.message });
    }
});

// 4. Hapus data (Delete)
app.delete('/api/items/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: 'Item tidak ditemukan' });
        res.sendStatus(204);
    } catch (err) {
        res.status(400).json({ message: 'Gagal menghapus data', error: err.message });
    }
});

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
