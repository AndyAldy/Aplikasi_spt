import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SptList() {
  // Simulasi data tabel (Pada praktiknya nanti gunakan axios.get dari Database/Laravel)
  const [sptData, setSptData] = useState([
    { id: 1, no_surat: "000.1.2.3/1868/438.5.12/2026", tanggal: "2026-02-05", tujuan: "Monitoring Tower Administrasi Kependudukan" }
  ]);

  const handleDelete = (id) => {
    if(window.confirm('Yakin ingin menghapus dokumen ini?')) {
      setSptData(sptData.filter(item => item.id !== id));
    }
  };

  return (
    <div>
      <h2>Data Surat Perintah Tugas (SPT)</h2>
      <Link to="/create">
        <button className="btn btn-primary" style={{ marginBottom: '15px' }}>+ Buat SPT Baru</button>
      </Link>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nomor Surat</th>
            <th>Tanggal</th>
            <th>Tujuan Tugas</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {sptData.length === 0 ? (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Belum ada data SPT</td></tr>
          ) : (
            sptData.map((spt, index) => (
              <tr key={spt.id}>
                <td>{index + 1}</td>
                <td>{spt.no_surat}</td>
                <td>{spt.tanggal}</td>
                <td>{spt.tujuan}</td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`/edit/${spt.id}`}>
                    <button className="btn btn-warning">Edit</button>
                  </Link>
                  <Link to={`/print/${spt.id}`}>
                    <button className="btn btn-info">Print</button>
                  </Link>
                  <button onClick={() => handleDelete(spt.id)} className="btn btn-danger">Hapus</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}