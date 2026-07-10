import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function SptForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Jika ada ID di URL, berarti form ini dipakai untuk Edit
  
  // State untuk Data Utama Surat
  const [formData, setFormData] = useState({
    nomor_surat: '',
    tanggal_surat: '',
    dasar_penugasan: '',
    tujuan_tugas: '',
    tempat_tugas: '',
  });

  // State Dinamis untuk daftar pegawai (Bisa nambah lebih dari 1 baris)
  const [pegawaiTugas, setPegawaiTugas] = useState([
    { nama: '', nip: '', pangkat: '', jabatan: '' }
  ]);

  // Simulasi Ambil Data saat Mode Edit
  useEffect(() => {
    if (id) {
      setFormData({
        nomor_surat: '000.1.2.3/1868/438.5.12/2026',
        tanggal_surat: '2026-02-05',
        dasar_penugasan: 'Nota Dinas Kepala Bidang PIAK Nomor: 400.12.4/434...',
        tujuan_tugas: 'Melaksanakan Monitoring Tower',
        tempat_tugas: 'Kecamatan Sidoarjo',
      });
      setPegawaiTugas([
        { nama: "BAMBANG PURNOMO", nip: "19700311", pangkat: "Pembina", jabatan: "Kabid PIAK" }
      ]);
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePegawaiChange = (index, e) => {
    const updated = [...pegawaiTugas];
    updated[index][e.target.name] = e.target.value;
    setPegawaiTugas(updated);
  };

  const addPegawai = () => {
    setPegawaiTugas([...pegawaiTugas, { nama: '', nip: '', pangkat: '', jabatan: '' }]);
  };

  const removePegawai = (index) => {
    setPegawaiTugas(pegawaiTugas.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payloadData = { ...formData, pegawai: pegawaiTugas };
    console.log("Data siap dikirim ke Database:", payloadData);
    alert('SPT Berhasil Disimpan!');
    navigate('/'); // Redirect kembali ke tabel
  };

  return (
    <div className="form-container">
      <h2>{id ? 'Edit Surat Perintah Tugas' : 'Buat Surat Perintah Tugas Baru'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nomor Surat</label>
          <input type="text" className="form-control" name="nomor_surat" value={formData.nomor_surat} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label>Tanggal Surat</label>
          <input type="date" className="form-control" name="tanggal_surat" value={formData.tanggal_surat} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Dasar Penugasan</label>
          <textarea className="form-control" name="dasar_penugasan" value={formData.dasar_penugasan} onChange={handleChange} rows="4" required></textarea>
        </div>
        
        <hr style={{ margin: '30px 0' }} />
        
        <h3 style={{ marginTop: 0 }}>Daftar Pegawai Yang Ditugaskan</h3>
        {pegawaiTugas.map((pegawai, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
            <input type="text" className="form-control" placeholder="Nama Lengkap" name="nama" value={pegawai.nama} onChange={(e) => handlePegawaiChange(index, e)} required />
            <input type="text" className="form-control" placeholder="NIP" name="nip" value={pegawai.nip} onChange={(e) => handlePegawaiChange(index, e)} required />
            <input type="text" className="form-control" placeholder="Pangkat/Gol" name="pangkat" value={pegawai.pangkat} onChange={(e) => handlePegawaiChange(index, e)} required />
            <input type="text" className="form-control" placeholder="Jabatan" name="jabatan" value={pegawai.jabatan} onChange={(e) => handlePegawaiChange(index, e)} required />
            
            {/* Tombol Hapus Baris (Muncul Jika baris pegawai > 1) */}
            {pegawaiTugas.length > 1 && (
              <button type="button" className="btn btn-danger" onClick={() => removePegawai(index)}>X</button>
            )}
          </div>
        ))}
        <button type="button" className="btn btn-success" onClick={addPegawai}>+ Tambah Pegawai</button>

        <hr style={{ margin: '30px 0' }} />

        <div className="form-group">
          <label>Tujuan Tugas</label>
          <input type="text" className="form-control" name="tujuan_tugas" value={formData.tujuan_tugas} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Tempat Tugas</label>
          <input type="text" className="form-control" name="tempat_tugas" value={formData.tempat_tugas} onChange={handleChange} required />
        </div>

        <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn btn-primary">Simpan SPT</button>
          <button type="button" className="btn btn-warning" onClick={() => navigate('/')}>Batal</button>
        </div>
      </form>
    </div>
  );
}