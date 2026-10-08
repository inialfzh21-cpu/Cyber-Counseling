import React from 'react';
import { Printer, X } from 'lucide-react';
import { AssessmentResult } from '../../types';
import { storage } from '../../lib/storage';

interface PrintDocumentViewProps {
  type: 'individual' | 'recap';
  individualResult?: AssessmentResult;
  recapResults?: AssessmentResult[];
  recapFilterDetails?: {
    periode: string;
    kelas: string;
    jenis: string;
  };
  guruNama: string;
  guruNip?: string;
  onClose: () => void;
}

export const PrintDocumentView: React.FC<PrintDocumentViewProps> = ({
  type,
  individualResult,
  recapResults = [],
  recapFilterDetails,
  guruNama,
  guruNip = '-',
  onClose
}) => {
  const settings = storage.getSettings();
  const printDateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-xs flex flex-col items-center p-4 sm:p-6 print:p-0 print:bg-white print:overflow-visible">
      {/* Top Floating Action Bar (Hidden during native print) */}
      <div className="sticky top-4 z-50 bg-white dark:bg-[#251B13] p-3 px-6 rounded-2xl shadow-xl border border-[#E8DEC8] flex items-center justify-between gap-4 w-full max-w-4xl mb-4 print:hidden">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm text-[#4A3525] dark:text-[#F3E9DD]">
            Pratinjau Dokumen Cetak A4 Resmi
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
            Format Resmi BK
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white text-xs font-bold shadow-md flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen Sekarang</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Printable Sheet (Simulated A4 Paper: 210mm x 297mm proportions) */}
      <div className="relative bg-white text-[#1F1915] w-full max-w-4xl p-8 sm:p-12 shadow-2xl rounded-sm print:shadow-none print:p-8 print:w-full min-h-[297mm]">
        {/* Background Watermark (USER REQUIREMENT NO 18 & 21) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <div className="transform -rotate-30 text-stone-200/50 text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-widest text-center whitespace-nowrap">
            DOKUMEN TERBATAS – DATA LAYANAN BK
          </div>
        </div>

        {/* INDIVIDUAL ASSESSMENT PRINT */}
        {type === 'individual' && individualResult && (
          <div className="relative z-10 space-y-6 text-sm">
            {/* Header */}
            <div className="text-center pb-4 border-b-2 border-[#4A3525]">
              <h1 className="font-black text-xl tracking-tight text-[#4A3525]">
                CYBER-COUNSELING
              </h1>
              <p className="text-xs text-stone-600 font-medium">
                Media Pendukung Layanan Bimbingan dan Konseling
              </p>
              <p className="text-sm font-bold text-stone-800 uppercase tracking-wide mt-0.5">
                {settings.namaSekolah}
              </p>
              <div className="mt-3 py-1 bg-stone-100 rounded text-center">
                <h2 className="font-extrabold text-sm tracking-wider text-[#4A3525] uppercase">
                  HASIL ASESMEN BIMBINGAN DAN KONSELING
                </h2>
              </div>
            </div>

            {/* Identitas Siswa */}
            <div className="p-4 rounded-lg border border-stone-300 bg-stone-50/70 space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#4A3525] pb-1 border-b border-stone-200">
                IDENTITAS SISWA & INSTRUMEN
              </h3>
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-6 text-xs">
                <div className="flex">
                  <span className="w-32 text-stone-600">Nama Siswa</span>
                  <span className="font-bold text-stone-900">: {individualResult.namaSiswa}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-stone-600">Jenis Asesmen</span>
                  <span className="font-bold text-stone-900">: {individualResult.jenisAsesmen}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-stone-600">Jenis Kelamin</span>
                  <span>: {individualResult.jenisKelamin}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-stone-600">Aspek BK</span>
                  <span className="font-bold text-stone-900">: {individualResult.aspekBK}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-stone-600">Kelas</span>
                  <span className="font-bold">: {individualResult.kelasSiswa}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-stone-600">Tanggal Asesmen</span>
                  <span>: {new Date(individualResult.tanggalPengerjaan).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
                </div>
              </div>
            </div>

            {/* Hasil Asesmen & Ringkasan */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#4A3525]">
                HASIL ASESMEN & INDIKATOR KEBUTUHAN
              </h3>

              <div className="p-3.5 bg-white border border-stone-300 rounded text-xs leading-relaxed">
                <p><strong>Ringkasan Temuan:</strong> {individualResult.ringkasan}</p>
                <p className="mt-1 font-semibold text-stone-700">Skor Total Masalah: {individualResult.skorTotal}</p>
              </div>

              {/* Detail Table */}
              <table className="w-full text-left border-collapse border border-stone-300 text-xs">
                <thead>
                  <tr className="bg-stone-200/70 border-b border-stone-300 font-bold">
                    <th className="p-2 border-r border-stone-300">Aspek Pengamatan</th>
                    <th className="p-2 border-r border-stone-300 text-center">Skor</th>
                    <th className="p-2 border-r border-stone-300 text-center">Tingkat</th>
                    <th className="p-2">Keterangan / Indikator Masalah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {individualResult.detailHasil.map((item, i) => (
                    <tr key={i}>
                      <td className="p-2 border-r border-stone-300 font-medium">{item.aspek}</td>
                      <td className="p-2 border-r border-stone-300 text-center font-bold">{item.skor}</td>
                      <td className="p-2 border-r border-stone-300 text-center">{item.kategoriTingkat}</td>
                      <td className="p-2">{item.keterangan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Catatan Guru BK */}
            <div className="p-3.5 rounded border border-stone-300 bg-stone-50 text-xs space-y-1.5">
              <h3 className="font-bold uppercase tracking-wider text-[#4A3525]">
                CATATAN & REKOMENDASI GURU BK
              </h3>
              <p><strong>Catatan:</strong> {individualResult.catatanGuru || 'Siswa menunjukkan kesediaan terbuka dalam bimbingan layanan konseling.'}</p>
              <p><strong>Rekomendasi Layanan:</strong> {individualResult.rekomendasiGuru || 'Diberikan pendampingan bimbingan secara berkala sesuai kebutuhan perkembangan siswa.'}</p>
            </div>

            {/* Footer Signatures */}
            <div className="pt-6 flex justify-between items-end text-xs">
              <div className="text-[11px] text-stone-500 max-w-xs">
                <p>Dokumen ini dihasilkan secara resmi melalui sistem CYBER-COUNSELING dan bersifat RAHASIA.</p>
                <p className="mt-1">Dicetak pada: {printDateStr} | Ref: ALFZH</p>
              </div>

              <div className="text-center w-64">
                <p>Mengetahui,</p>
                <p className="font-medium">Guru Pembimbing Bimbingan & Konseling</p>
                <div className="h-16" />
                <p className="font-bold underline text-stone-900">{guruNama}</p>
                <p className="text-stone-600">NIP: {guruNip}</p>
              </div>
            </div>
          </div>
        )}

        {/* RECAP ASSESSMENT PRINT */}
        {type === 'recap' && (
          <div className="relative z-10 space-y-6 text-sm">
            {/* Header */}
            <div className="text-center pb-4 border-b-2 border-[#4A3525]">
              <h1 className="font-black text-xl tracking-tight text-[#4A3525]">
                CYBER-COUNSELING
              </h1>
              <p className="text-xs text-stone-600 font-medium">
                Media Pendukung Layanan Bimbingan dan Konseling
              </p>
              <p className="text-sm font-bold text-stone-800 uppercase tracking-wide mt-0.5">
                {settings.namaSekolah}
              </p>
              <div className="mt-3 py-1 bg-stone-100 rounded text-center">
                <h2 className="font-extrabold text-sm tracking-wider text-[#4A3525] uppercase">
                  REKAP HASIL ASESMEN BIMBINGAN DAN KONSELING
                </h2>
              </div>
              <p className="text-xs text-stone-600 mt-2">
                Periode: {recapFilterDetails?.periode || 'Semua'} | Kelas: {recapFilterDetails?.kelas || 'Semua'} | Tanggal Cetak: {printDateStr}
              </p>
            </div>

            {/* Table */}
            <table className="w-full text-left border-collapse border border-stone-300 text-xs">
              <thead>
                <tr className="bg-stone-200/70 border-b border-stone-300 font-bold">
                  <th className="p-2 border-r border-stone-300">No</th>
                  <th className="p-2 border-r border-stone-300">Nama Siswa</th>
                  <th className="p-2 border-r border-stone-300">Kelas</th>
                  <th className="p-2 border-r border-stone-300">Jenis Asesmen</th>
                  <th className="p-2 border-r border-stone-300">Aspek BK</th>
                  <th className="p-2 border-r border-stone-300">Tanggal</th>
                  <th className="p-2 border-r border-stone-300 text-center">Skor</th>
                  <th className="p-2">Ringkasan Temuan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {recapResults.map((r, i) => (
                  <tr key={r.id}>
                    <td className="p-2 border-r border-stone-300 font-bold text-center">{i + 1}</td>
                    <td className="p-2 border-r border-stone-300 font-semibold">{r.namaSiswa}</td>
                    <td className="p-2 border-r border-stone-300">{r.kelasSiswa}</td>
                    <td className="p-2 border-r border-stone-300">{r.jenisAsesmen}</td>
                    <td className="p-2 border-r border-stone-300">{r.aspekBK}</td>
                    <td className="p-2 border-r border-stone-300">{r.tanggalPengerjaan.slice(0, 10)}</td>
                    <td className="p-2 border-r border-stone-300 text-center font-bold">{r.skorTotal}</td>
                    <td className="p-2 text-stone-700">{r.ringkasan}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary Recap Box */}
            <div className="p-4 rounded border border-stone-300 bg-stone-50 text-xs space-y-1">
              <h3 className="font-bold uppercase tracking-wider text-[#4A3525]">
                RINGKASAN REKAPITULASI
              </h3>
              <p>Total Peserta: <strong>{new Set(recapResults.map(r => r.idSiswa)).size} Siswa</strong> | Total Asesmen: <strong>{recapResults.length}</strong></p>
              <p>Aspek Pribadi: <strong>{recapResults.filter(r => r.aspekBK === 'Pribadi').length}</strong> | Aspek Sosial: <strong>{recapResults.filter(r => r.aspekBK === 'Sosial').length}</strong></p>
              <p>Aspek Belajar: <strong>{recapResults.filter(r => r.aspekBK === 'Belajar').length}</strong> | Aspek Karier: <strong>{recapResults.filter(r => r.aspekBK === 'Karier').length}</strong></p>
            </div>

            {/* Signature Block */}
            <div className="pt-6 flex justify-between items-end text-xs">
              <div className="text-[11px] text-stone-500">
                <p>Dokumen ini merupakan rekapitulasi sah layanan Bimbingan dan Konseling.</p>
                <p>Ref: ALFZH</p>
              </div>

              <div className="text-center w-64">
                <p>Guru Bimbingan dan Konseling,</p>
                <div className="h-16" />
                <p className="font-bold underline text-stone-900">{guruNama}</p>
                <p className="text-stone-600">NIP: {guruNip}</p>
                <p className="text-stone-500 text-[11px]">Tanggal: {printDateStr}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
