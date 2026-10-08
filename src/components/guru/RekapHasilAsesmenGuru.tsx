import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  PieChart, 
  BarChart3, 
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../lib/storage';
import { AssessmentResult } from '../../types';
import { downloadRecapAssessmentPdf, downloadRecapAssessmentCsv } from '../../lib/pdfExport';
import { Breadcrumb } from '../common/Breadcrumb';

interface RekapHasilAsesmenGuruProps {
  onOpenPrintRecap: (filteredResults: AssessmentResult[], filterDetails: any) => void;
}

export const RekapHasilAsesmenGuru: React.FC<RekapHasilAsesmenGuruProps> = ({
  onOpenPrintRecap
}) => {
  const { currentUser, role } = useAuth();
  const { showToast } = useToast();
  const allResults = storage.getResults();
  const allStudents = storage.getUsersByGroup().filter(u => u.role === 'siswa');

  const [searchStudent, setSearchStudent] = useState('');
  const [filterKelas, setFilterKelas] = useState('Semua');
  const [filterJenis, setFilterJenis] = useState('Semua');
  const [filterAspek, setFilterAspek] = useState('Semua');
  const [filterPeriode, setFilterPeriode] = useState('Bulan Ini (Oktober 2026)');

  if (!currentUser) return null;

  const kelasList = ['Semua', ...Array.from(new Set(allStudents.map(s => s.kelas || '-')))];

  const filteredResults = allResults.filter(r => {
    const matchSearch = r.namaSiswa.toLowerCase().includes(searchStudent.toLowerCase());
    const matchKelas = filterKelas === 'Semua' || r.kelasSiswa === filterKelas;
    const matchJenis = filterJenis === 'Semua' || r.jenisAsesmen === filterJenis;
    const matchAspek = filterAspek === 'Semua' || r.aspekBK === filterAspek;
    return matchSearch && matchKelas && matchJenis && matchAspek;
  });

  // Analytics
  const uniqueStudentsTested = new Set(filteredResults.map(r => r.idSiswa)).size;
  const countPribadi = filteredResults.filter(r => r.aspekBK === 'Pribadi').length;
  const countSosial = filteredResults.filter(r => r.aspekBK === 'Sosial').length;
  const countBelajar = filteredResults.filter(r => r.aspekBK === 'Belajar').length;
  const countKarier = filteredResults.filter(r => r.aspekBK === 'Karier').length;
  const participationRate = allStudents.length > 0 ? Math.round((uniqueStudentsTested / allStudents.length) * 100) : 0;

  const handlePrint = () => {
    if (role !== 'guru_bk') {
      showToast('Akses Ditolak: Hanya Guru BK yang berhak mencetak rekap.', 'error');
      return;
    }
    onOpenPrintRecap(filteredResults, {
      periode: filterPeriode,
      kelas: filterKelas,
      jenis: filterJenis
    });
  };

  const handleDownloadPdf = () => {
    if (role !== 'guru_bk') {
      showToast('Akses Ditolak: Hanya Guru BK yang berhak mengunduh rekap.', 'error');
      return;
    }
    try {
      downloadRecapAssessmentPdf({
        results: filteredResults,
        guruNama: currentUser.nama,
        guruNip: currentUser.nipNik,
        periodeStr: filterPeriode,
        role: role!,
        filterKelas,
        filterJenis
      });
      showToast('Mengunduh PDF Rekap Hasil Asesmen BK...', 'success');
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  const handleDownloadCsv = () => {
    if (role !== 'guru_bk') {
      showToast('Akses Ditolak: Hanya Guru BK yang berhak mengunduh rekap.', 'error');
      return;
    }
    try {
      downloadRecapAssessmentCsv(filteredResults, role!);
      showToast('Mengunduh CSV Rekap Hasil Asesmen BK...', 'success');
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Rekap Hasil Asesmen' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">
              Rekapitulasi Hasil Asesmen BK
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Khusus Guru BK
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#8A674A] dark:text-[#BA9B81] mt-0.5">
            Laporan komprehensif seluruh instrumen bimbingan untuk evaluasi berkala dan pelaporan resmi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4 text-amber-800" />
            <span>🖨️ Cetak Rekap (A4)</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2.5 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#8B5E3C]/20"
          >
            <Download className="w-4 h-4" />
            <span>⬇️ Unduh PDF</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            title="Download CSV / Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs">
          <span className="text-xs font-semibold text-[#8C6D53]">Siswa Mengikuti</span>
          <p className="text-2xl font-black text-[#4A3525] dark:text-[#F3E9DD] mt-1">
            {uniqueStudentsTested} Siswa
          </p>
          <p className="text-[11px] text-[#A08168]">Partisipasi: {participationRate}%</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs">
          <span className="text-xs font-semibold text-[#8C6D53]">Total Berkas Asesmen</span>
          <p className="text-2xl font-black text-[#4A3525] dark:text-[#F3E9DD] mt-1">
            {filteredResults.length}
          </p>
          <p className="text-[11px] text-[#A08168]">Hasil tersaring</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs">
          <span className="text-xs font-semibold text-[#8C6D53]">Aspek Belajar & Karier</span>
          <p className="text-2xl font-black text-[#8B5E3C] mt-1">
            {countBelajar + countKarier}
          </p>
          <p className="text-[11px] text-[#A08168]">Belajar: {countBelajar} | Karier: {countKarier}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs">
          <span className="text-xs font-semibold text-[#8C6D53]">Aspek Pribadi & Sosial</span>
          <p className="text-2xl font-black text-[#5C4033] mt-1">
            {countPribadi + countSosial}
          </p>
          <p className="text-[11px] text-[#A08168]">Pribadi: {countPribadi} | Sosial: {countSosial}</p>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
            placeholder="Cari nama siswa..."
            className="px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-[#4A3525] dark:text-[#F3E9DD] w-48"
          />

          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] font-semibold"
          >
            {kelasList.map(k => (
              <option key={k} value={k}>Kelas: {k}</option>
            ))}
          </select>

          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] font-semibold"
          >
            <option value="Semua">Semua Instrumen</option>
            <option value="DCM">DCM</option>
            <option value="AUM">AUM</option>
            <option value="Sosiometri">Sosiometri</option>
          </select>

          <select
            value={filterAspek}
            onChange={(e) => setFilterAspek(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] font-semibold"
          >
            <option value="Semua">Semua Aspek</option>
            <option value="Pribadi">Pribadi</option>
            <option value="Sosial">Sosial</option>
            <option value="Belajar">Belajar</option>
            <option value="Karier">Karier</option>
          </select>

          <select
            value={filterPeriode}
            onChange={(e) => setFilterPeriode(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] font-semibold"
          >
            <option value="Bulan Ini (Oktober 2026)">Bulan Ini (Oktober 2026)</option>
            <option value="Semester Ganjil 2026/2027">Semester Ganjil 2026/2027</option>
            <option value="Tahun Ajaran 2026/2027">Tahun Ajaran 2026/2027</option>
          </select>
        </div>

        <span className="font-bold text-[#8C6D53]">
          Menampilkan {filteredResults.length} data
        </span>
      </div>

      {/* Recap Table */}
      <div className="bg-white dark:bg-[#251B13] rounded-3xl border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF5EE] dark:bg-[#2E2017] border-b border-[#E8DEC8] dark:border-[#3E2D20] text-[#6A4728] dark:text-[#E2C7B0] font-bold">
                <th className="p-4">No</th>
                <th className="p-4">Nama Siswa</th>
                <th className="p-4">Kelas</th>
                <th className="p-4">Jenis Asesmen</th>
                <th className="p-4">Aspek BK</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Skor</th>
                <th className="p-4">Ringkasan Masalah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EAE0] dark:divide-[#3A2A1E]">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-400">
                    Tidak ada hasil asesmen dalam filter ini.
                  </td>
                </tr>
              ) : (
                filteredResults.map((r, i) => (
                  <tr key={r.id} className="hover:bg-[#FAF6F0] dark:hover:bg-[#2C1E15] transition-colors">
                    <td className="p-4 font-bold text-[#8C6D53]">{i + 1}</td>
                    <td className="p-4 font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">{r.namaSiswa}</td>
                    <td className="p-4 font-bold text-[#5C3F28] dark:text-[#ECC9AC]">{r.kelasSiswa}</td>
                    <td className="p-4 font-semibold text-[#8B5E3C]">{r.jenisAsesmen}</td>
                    <td className="p-4 text-[#7A5B40] dark:text-[#C5A893]">{r.aspekBK}</td>
                    <td className="p-4 text-[#8C6D53]">{r.tanggalPengerjaan.slice(0, 10)}</td>
                    <td className="p-4 font-black text-[#4A3525] dark:text-[#F3E9DD]">{r.skorTotal}</td>
                    <td className="p-4 max-w-sm truncate text-[#6F523B] dark:text-[#BA9B81]">{r.ringkasan}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
