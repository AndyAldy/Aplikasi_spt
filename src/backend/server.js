import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();
app.use(cors());
app.use(express.json());

// Konfigurasi Koneksi Database berdasarkan db_spt.sql
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_spt',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Tes Koneksi ke Database
pool.getConnection()
  .then(conn => {
    console.log('Berhasil terhubung ke database db_spt!');
    conn.release();
  })
  .catch(err => {
    console.error('Error koneksi database:', err);
  });

// ==========================================
// API UNTUK AUTENTIKASI (LOGIN & REGISTER)
// ==========================================

// 1. REGISTER
app.post('/api/register', async (req, res) => {
  const { nama_lengkap, username, password } = req.body;
  try {
    // Cek apakah username sudah dipakai
    const [existing] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username sudah digunakan!' });
    }

    // Enkripsi (Hash) password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    await pool.query(
      'INSERT INTO users (nama_lengkap, username, password) VALUES (?, ?, ?)',
      [nama_lengkap, username, hashedPassword]
    );

    res.json({ message: 'Registrasi berhasil! Silakan login.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. LOGIN
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Cari user berdasarkan username
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Username tidak ditemukan!' });
    }

    const user = users[0];
    
    // Bandingkan password input dengan password di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Password salah!' });
    }

    // Jika berhasil, kirim data user (tanpa password) ke frontend
    res.json({ 
      message: 'Login berhasil!', 
      user: { id: user.id, nama_lengkap: user.nama_lengkap, username: user.username } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// API UNTUK PEGAWAI (MASTER DATA)
// ==========================================

app.get('/api/pegawai', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pegawai ORDER BY nama ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Menambah pegawai baru
app.post('/api/pegawai', async (req, res) => {
  const { nip, nama, pangkat_gol, jabatan } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO pegawai (nip, nama, pangkat_gol, jabatan) VALUES (?, ?, ?, ?)',
      [nip, nama, pangkat_gol, jabatan]
    );
    res.json({ message: 'Pegawai berhasil ditambahkan!', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==========================================
// API UNTUK SPT (SURAT PERINTAH TUGAS)
// ==========================================

// Mengambil semua daftar SPT
app.get('/api/spt', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM spt ORDER BY tanggal_surat DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Membuat SPT baru beserta pegawainya
// Cipta (Create) SPT baru beserta pegawainya
app.post('/api/spt', async (req, res) => {
  const {
    nomor_surat, // Tangkap input nomor surat dari form (bisa kosong)
    tanggal_surat,
    dasar_penugasan,
    tujuan_tugas,
    tanggal_mulai,
    tanggal_selesai,
    tempat_tugas,
    kendaraan,
    penandatangan_nama,
    penandatangan_nip,
    penandatangan_pangkat_gol,
    penandatangan_jabatan,
    pegawai_ids
  } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Ekstrak Tahun dari tanggal_surat (format YYYY-MM-DD)
    const tahun = tanggal_surat.substring(0, 4);
    
    let finalNomorSurat = nomor_surat;
    let no_urut = 0;

    // 2. LOGIKA PENENTUAN NOMOR SURAT
    if (!finalNomorSurat || finalNomorSurat.trim() === '') {
      // JIKA KOSONG: Generate no_urut otomatis
      const [urutRows] = await connection.query(
        'SELECT IFNULL(MAX(no_urut), 0) + 1 AS next_urut FROM spt WHERE tahun = ?',
        [tahun]
      );
      no_urut = urutRows[0].next_urut;
      finalNomorSurat = `000.1.2.3/${no_urut}/438.5.12/${tahun}`;
    } else {
      // JIKA DIISI MANUAL: Cek apakah nomor tersebut sudah dipakai di database
      const [existing] = await connection.query(
        'SELECT * FROM spt WHERE nomor_surat_full = ?', 
        [finalNomorSurat]
      );
      
      if (existing.length > 0) {
        // Jika duplikat, BATALKAN transaksi dan kirim pesan error ke React!
        await connection.rollback();
        return res.status(400).json({ error: 'Nomor surat sudah ada! Silakan ganti atau kosongkan agar dibuat otomatis.' });
      }

      // Opsional: Coba ambil angka urutan jika formatnya standar (contoh: .../123/...)
      const parts = finalNomorSurat.split('/');
      if (parts.length > 1 && !isNaN(parts[1])) {
        no_urut = parseInt(parts[1]);
      }
    }

    // 3. Masukkan data ke tabel utama `spt` (Gunakan finalNomorSurat)
    const insertSptQuery = `
      INSERT INTO spt (
        no_urut, tahun, nomor_surat_full, tanggal_surat, dasar_penugasan, 
        tujuan_tugas, tanggal_mulai, tanggal_selesai, tempat_tugas, kendaraan, 
        penandatangan_nama, penandatangan_nip, penandatangan_pangkat_gol, penandatangan_jabatan
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [sptResult] = await connection.query(insertSptQuery, [
      no_urut, tahun, finalNomorSurat, tanggal_surat, dasar_penugasan,
      tujuan_tugas, tanggal_mulai, tanggal_selesai, tempat_tugas, kendaraan, // pastikan kolom ini ada di form kamu atau beri default string kosong
      penandatangan_nama, penandatangan_nip, penandatangan_pangkat_gol, penandatangan_jabatan
    ]);

    const newSptId = sptResult.insertId;

    // 4. Masukkan data relasi ke tabel pivot `spt_pegawai`
    if (pegawai_ids && pegawai_ids.length > 0) {
      const pivotData = pegawai_ids.map(pegawai_id => [newSptId, pegawai_id]);
      await connection.query(
        'INSERT INTO spt_pegawai (spt_id, pegawai_id) VALUES ?',
        [pivotData]
      );
    }

    // Konfirmasi transaksi
    await connection.commit();
    res.json({ message: 'SPT Berhasil Disimpan!', spt_id: newSptId, nomor_surat_full: finalNomorSurat });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

// Menghapus data SPT berdasarkan ID
app.delete('/api/spt/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Karena di database kamu sudah menggunakan ON DELETE CASCADE untuk tabel spt_pegawai,
    // menghapus data di tabel 'spt' akan otomatis menghapus data relasinya juga!
    const [result] = await pool.query('DELETE FROM spt WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Data tidak ditemukan!' });
    }
    
    res.json({ message: 'Data SPT berhasil dihapus!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Jalankan server pada port 8000
app.listen(8000, () => {
  console.log('Backend Server berjalan di http://localhost:8000');
});