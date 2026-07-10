/* eslint-disable no-unused-vars */
import React from 'react';

export default function SptPrint() {
  // Mock data (Nantinya data ini didapat dari API/Database berdasarkan ID di URL)
  const sptData = {
    nomor_surat: "000.1.2.3/1868/438.5.12/2026",
    tanggal_surat: "05 Februari 2026",
    dasar: "1. Nota Dinas Kepala Bidang PIAK Nomor: 400.12.4/434/438.5.12/2026 Tanggal: 4 Februari 2026 Perihal Monitoring Tower dan Jaringan Administrasi Kependudukan.\n2. Dokumen Pelaksanaan Anggaran Tahun Anggaran 2026.",
    tujuan: "Melaksanakan Monitoring Tower dan Jaringan Administrasi Kependudukan",
    waktu: "Tanggal 5 - 13 Februari 2026",
    tempat: "Di Seluruh Kecamatan se Kabupaten Sidoarjo dan Mall Pelayanan Publik Lingkar Timur",
    pegawai: [
      { nama: "BAMBANG PURNOMO, S.Kom., MH.", nip: "197003111989031002", pangkat: "Pembina (IV/a)", jabatan: "Kepala Bidang PIAK" },
      { nama: "ASAD RIDHADIN, S.Kom.", nip: "198104062010011093", pangkat: "Penata Muda Tk. I (III/b)", jabatan: "Pranata Komputer" }
    ]
  };

  return (
    <div style={{ background: '#eee', padding: '20px' }} className="no-print-bg">
      <div style={{ textAlign: 'center', marginBottom: '20px' }} className="no-print">
        <button onClick={() => window.print()} style={{ padding: '10px 20px', cursor: 'pointer', background: 'blue', color: 'white', border: 'none' }}>
          🖨️ Cetak PDF / Print
        </button>
      </div>

      {/* Area Kertas Cetak */}
      <div className="a4-paper">
        {/* Kop Surat */}
        <div className="kop-surat">
          <h3 style={{ margin: 0 }}>PEMERINTAH KABUPATEN SIDOARJO</h3>
          <h2 style={{ margin: '5px 0' }}>SEKRETARIAT DAERAH</h2>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Jalan Gubernur Suryo No. 1, Sidoarjo, Jawa Timur 61211<br/>
            Telepon (031) 8921946, 8921960, Laman www.sidoarjokab.go.id
          </p>
        </div>

        {/* Judul Surat */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h3 style={{ textDecoration: 'underline', margin: 0 }}>SURAT TUGAS</h3>
          <p style={{ margin: 0 }}>NOMOR {sptData.nomor_surat}</p>
        </div>

        {/* Isi Surat */}
        <table className="table-layout" style={{ width: '100%', fontSize: '15px' }}>
          <tbody>
            <tr>
              <td style={{ width: '15%' }}>Dasar</td>
              <td style={{ width: '2%' }}>:</td>
              <td style={{ whiteSpace: 'pre-line' }}>{sptData.dasar}</td>
            </tr>
            <tr><td colSpan="3"><br/></td></tr>
            
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', fontWeight: 'bold' }}>MEMERINTAHKAN:</td>
            </tr>
            <tr><td colSpan="3"><br/></td></tr>

            <tr>
              <td>Kepada</td>
              <td>:</td>
              <td>
                {sptData.pegawai.map((peg, index) => (
                  <div key={index} style={{ display: 'flex', marginBottom: '15px' }}>
                    <div style={{ width: '20px' }}>{index + 1}.</div>
                    <table className="table-layout" style={{ width: '100%' }}>
                      <tbody>
                        <tr><td style={{ width: '30%' }}>Nama</td><td>:</td><td><b>{peg.nama}</b></td></tr>
                        <tr><td>NIP</td><td>:</td><td>{peg.nip}</td></tr>
                        <tr><td>Pangkat/gol</td><td>:</td><td>{peg.pangkat}</td></tr>
                        <tr><td>Jabatan</td><td>:</td><td>{peg.jabatan}</td></tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </td>
            </tr>

            <tr>
              <td>Untuk</td>
              <td>:</td>
              <td>{sptData.tujuan} {sptData.waktu} {sptData.tempat}.</td>
            </tr>
          </tbody>
        </table>

        {/* Tanda Tangan */}
        <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'flex-end', fontSize: '15px' }}>
          <div style={{ width: '350px', textAlign: 'left' }}>
            <p style={{ margin: 0 }}>Sidoarjo, {sptData.tanggal_surat}</p>
            <p style={{ margin: 0 }}>a.n. Sekretaris Daerah</p>
            <p style={{ margin: 0 }}>Asisten Pemerintahan dan Kesejahteraan Rakyat,</p>
            <br/><br/><br/>
            <p style={{ margin: 0, textDecoration: 'underline', fontWeight: 'bold' }}>Ainun Amalia, S.Sos.</p>
            <p style={{ margin: 0 }}>Pembina Utama Muda/ IVc</p>
            <p style={{ margin: 0 }}>NIP. 197505131993112001</p>
          </div>
        </div>

        {/* Footer BSrE */}
        <div style={{ marginTop: '50px', fontSize: '10px', textAlign: 'center', color: '#555' }}>
          Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik<br/>
          yang diterbitkan oleh Balai Besar Sertifikasi Elektronik (BSrE), Badan Siber dan Sandi Negara.
        </div>
      </div>
    </div>
  );
}