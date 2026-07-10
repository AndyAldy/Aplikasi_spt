/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; 

export default function SptList() {
  const [sptData, setSptData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/spt');
        setSptData(response.data);
      } catch (error) {
        console.error("Gagal mengambil data dari database:", error);
      }
    };

    fetchData();
  }, []);

const handleDelete = async (id) => {
    if(window.confirm('Yakin ingin menghapus dokumen ini?')) {
      try {
        await axios.delete(`http://localhost:8000/api/spt/${id}`);
        setSptData(prevData => prevData.filter(spt => spt.id !== id));
        alert("Data SPT berhasil dihapus!");
      } catch (error) {
        console.error("Gagal saat menghapus:", error);
        alert("Gagal menghapus data. Pastikan backend sudah menyala.");
      }
    }
  };

  const formatTanggal = (tanggalString) => {
    if (!tanggalString) return '-';
    const tanggalPendek = tanggalString.split('T')[0];
    
    return tanggalPendek;
  };

  return (
    <div className="container" style={{ maxWidth: '98%', marginTop: '20px' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#1e293b' }}>Data Surat Perintah Tugas (SPT)</h2>
          <Link to="/create" style={{ textDecoration: 'none' }}>
            <button className="btn btn-primary">+ Buat SPT Baru</button>
          </Link>
        </div>
        
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '5%' }}>No</th>
                <th style={{ width: '25%' }}>Nomor Surat</th>
                <th style={{ width: '15%' }}>Tanggal</th>
                <th style={{ width: '35%' }}>Tujuan Tugas</th>
                <th style={{ width: '20%', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sptData.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>
                    Belum ada data SPT / Sedang memuat dari database...
                  </td>
                </tr>
              ) : (
                sptData.map((spt, index) => (
                  <tr key={spt.id}>
                    <td>{index + 1}</td>
                    <td><strong>{spt.nomor_surat_full}</strong></td>
                    
                    {/* Memanggil fungsi pemotong T dan Z di sini */}
                    <td>{formatTanggal(spt.tanggal_surat)}</td>
                    
                    <td>{spt.tujuan_tugas}</td>
                    <td>
                      <div className="action-buttons" style={{ justifyContent: 'center' }}>
                        <Link to={`/edit/${spt.id}`}>
                          <button className="btn btn-warning">Edit</button>
                        </Link>
                        <Link to={`/print/${spt.id}`}>
                          <button className="btn btn-success">Print</button>
                        </Link>
                        <button onClick={() => handleDelete(spt.id)} className="btn btn-danger">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}