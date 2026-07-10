/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function SptForm() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const [formData, setFormData] = useState({
    nomor_surat: '',
    tanggal_surat: '',
    dasar_penugasan: '',
    tujuan_tugas: '',
    tempat_tugas: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    kendaraan: 'Kendaraan Dinas', 
    penandatangan_nama: 'Ainun Amalia, S.Sos.',
    penandatangan_nip: '197505131993112001',
    penandatangan_pangkat_gol: 'Pembina Utama Muda/ IVc',
    penandatangan_jabatan: 'Asisten Pemerintahan'
  });

  const [pegawaiTugas, setPegawaiTugas] = useState([
    { nama: '', nip: '', pangkat: '', jabatan: '' }
  ]);

  useEffect(() => {
    const fetchSptDetail = async () => {
      if (id) {
        try {
          await new Promise(resolve => setTimeout(resolve, 100));
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
        } catch (error) {
          console.error("Gagal mengambil data:", error);
        }
      }
    };
    fetchSptDetail();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payloadData = { ...formData, pegawai: pegawaiTugas };
    console.log("Data siap dikirim:", payloadData);
    alert('SPT Berhasil Disimpan!');
    navigate('/');
try {
      const response = await axios.post('http://localhost:8000/api/spt', payloadData);
      alert(response.data.message);
      navigate('/');
    } catch (error) {
      // INI YANG AKAN MEMUNCULKAN PESAN "NOMOR SURAT SUDAH ADA" DARI BACKEND
      alert(error.response?.data?.error || "Data sudah ada");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ marginBottom: '25px', color: '#1e293b' }}>
          {id ? 'Edit Surat Perintah Tugas' : 'Buat Surat Perintah Tugas Baru'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          
          <h3 className="section-title">Informasi Surat</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Nomor Surat</label>
              <input type="text" className="form-control" name="nomor_surat" value={formData.nomor_surat} onChange={handleChange} placeholder="Otomatis di-generate jika kosong"/>
            </div>
            
            <div className="form-group">
              <label>Tanggal Surat</label>
              <input type="date" className="form-control" name="tanggal_surat" value={formData.tanggal_surat} onChange={handleChange} required />
            </div>

            <div className="form-group full-width">
              <label>Dasar Penugasan</label>
              <textarea className="form-control" name="dasar_penugasan" value={formData.dasar_penugasan} onChange={handleChange} rows="3" placeholder="Masukkan dasar penugasan..." required></textarea>
            </div>
          </div>
          
          <h3 className="section-title" style={{ marginTop: '20px' }}>Daftar Pegawai Yang Ditugaskan</h3>
          <div>
            {pegawaiTugas.map((pegawai, index) => (
              <div key={index} className="pegawai-row">
                <input type="text" className="form-control" placeholder="Nama Lengkap" name="nama" value={pegawai.nama} onChange={(e) => handlePegawaiChange(index, e)} required />
                <input type="text" className="form-control" placeholder="NIP" name="nip" value={pegawai.nip} onChange={(e) => handlePegawaiChange(index, e)} required />
                <input type="text" className="form-control" placeholder="Pangkat/Gol" name="pangkat" value={pegawai.pangkat} onChange={(e) => handlePegawaiChange(index, e)} required />
                <input type="text" className="form-control" placeholder="Jabatan" name="jabatan" value={pegawai.jabatan} onChange={(e) => handlePegawaiChange(index, e)} required />
                
                {pegawaiTugas.length > 1 ? (
                  <button type="button" className="btn btn-danger" onClick={() => removePegawai(index)} title="Hapus Baris">X</button>
                ) : (
                  <div style={{ width: '42px' }}></div> /* Spacer agar grid tidak berantakan kalau tombol hapus hilang */
                )}
              </div>
            ))}
            <button type="button" className="btn btn-success" onClick={addPegawai} style={{ marginTop: '10px' }}>
              + Tambah Pegawai
            </button>
          </div>

<h3 className="section-title" style={{ marginTop: '35px' }}>Detail Penugasan</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Tujuan Tugas</label>
              <input type="text" className="form-control" name="tujuan_tugas" value={formData.tujuan_tugas} onChange={handleChange} placeholder="Contoh: Melaksanakan Monitoring" required />
            </div>

            <div className="form-group">
              <label>Tempat Tugas</label>
              <input type="text" className="form-control" name="tempat_tugas" value={formData.tempat_tugas} onChange={handleChange} placeholder="Contoh: Kecamatan Sidoarjo" required />
            </div>

            {/* TAMBAHKAN DUA KOTAK INPUT INI */}
            <div className="form-group">
              <label>Tanggal Mulai</label>
              <input type="date" className="form-control" name="tanggal_mulai" value={formData.tanggal_mulai} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Tanggal Selesai</label>
              <input type="date" className="form-control" name="tanggal_selesai" value={formData.tanggal_selesai} onChange={handleChange} required />
            </div>
          </div>

          <div className="actions-footer">
            <button type="button" className="btn btn-warning" onClick={() => navigate('/')}>Batalkan</button>
            <button type="submit" className="btn btn-primary">Simpan Data SPT</button>
          </div>
        </form>
      </div>
    </div>
  );
}