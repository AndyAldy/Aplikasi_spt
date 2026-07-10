import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

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
app.post('/api/spt', async (req, res) => {
  const {
    tahun,
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
    pegawai_ids // Array berisi ID pegawai dari frontend (contoh: [1, 2, 3])
  } = req.body;

  const connection = await pool.getConnection();

  try {
    // Mulai Transaksi Database (Database Transaction)
    await connection.beginTransaction();

    // 1. Generate no_urut secara otomatis berdasarkan tahun berjalan
    const [urutRows] = await connection.query(
      'SELECT IFNULL(MAX(no_urut), 0) + 1 AS next_urut FROM spt WHERE tahun = ?',
      [tahun]
    );
    const no_urut = urutRows[0].next_urut;
    const nomor_surat_full = `000.1.2.3/${no_urut}/438.5.12/${tahun}`;

    // 2. Masukkan data ke tabel utama `spt`
    const insertSptQuery = `
      INSERT INTO spt (
        no_urut, tahun, nomor_surat_full, tanggal_surat, dasar_penugasan, 
        tujuan_tugas, tanggal_mulai, tanggal_selesai, tempat_tugas, kendaraan, 
        penandatangan_nama, penandatangan_nip, penandatangan_pangkat_gol, penandatangan_jabatan
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [sptResult] = await connection.query(insertSptQuery, [
      no_urut, tahun, nomor_surat_full, tanggal_surat, dasar_penugasan,
      tujuan_tugas, tanggal_mulai, tanggal_selesai, tempat_tugas, kendaraan,
      penandatangan_nama, penandatangan_nip, penandatangan_pangkat_gol, penandatangan_jabatan
    ]);

    const newSptId = sptResult.insertId;

    // 3. Masukkan data relasi ke tabel pivot `spt_pegawai`
    if (pegawai_ids && pegawai_ids.length > 0) {
      const pivotData = pegawai_ids.map(pegawai_id => [newSptId, pegawai_id]);
      await connection.query(
        'INSERT INTO spt_pegawai (spt_id, pegawai_id) VALUES ?',
        [pivotData]
      );
    }

    // Konfirmasi transaksi berhasil disimpan permanen (Commit)
    await connection.commit();
    res.json({ message: 'SPT Berhasil Disimpan!', spt_id: newSptId, nomor_surat_full });

  } catch (error) {
    // Batalkan seluruh transaksi jika terjadi error di tengah jalan (Rollback)
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    // Lepaskan koneksi kembali ke pool
    connection.release();
  }
});

// Jalankan server pada port 8000
app.listen(8000, () => {
  console.log('Backend Server berjalan di http://localhost:8000');
});