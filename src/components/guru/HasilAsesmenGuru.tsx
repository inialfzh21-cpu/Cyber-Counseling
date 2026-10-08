import React, { useState } from 'react';
import { 
  FileCheck2, 
  Search, 
  Filter, 
  Printer, 
  Download, 
  FileSpreadsheet, 
  Eye, 
  Calendar, 
  User, 
  GraduationCap, 
  BarChart3, 
  LayoutGrid, 
  Table as TableIcon,
  X,
  ShieldCheck,
  CheckCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../lib/storage';
import { AssessmentResult } from '../../types';
import { downloadIndividualAssessmentPdf, downloadRecapAssessmentPdf, downloadRecapAssessmentCsv } from '../../lib/pdfExport';
import { Breadcrumb } from '../common/Breadcrumb';

interface HasilAsesmenGuruProps {
  onOpenPrintIndividual: (result: AssessmentResult) => void;
  onOpenPrintRecap: (filteredResults: AssessmentResult[], filterDetails: any) => void;
}

export const HasilAsesmenGuru: React.FC<HasilAsesmenGuruProps> = ({
  onOpenPrintIndividual,
  onOpenPrintRecap
}) => {
  const { currentUser, role } = useAuth();
  const { showToast } = useToast();

  const allResults = storage.getResults();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJenis, setFilterJenis] = useState('Semua');
  const [filterAspek, setFilterAspek] = useState('Semua');
  const [filterKelas, setFilterKelas] = useState('Semua');
  const [viewMode, setViewMode] = useState<'tabel' | 'card' | 'grafik'>('tabel');

  // Detail Modal
  const [selectedResult, setSelectedResult] = useState<AssessmentResult | null>(null);

  // Filter Modal for Recap
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);
  const [recapPeriod, setRecapPeriod] = useState('Bulan Ini (Oktober 2026)');

  if (!currentUser) return null;

  // Filtered List
  const filteredResults = allResults.filter(r => {
    const matchesSearch = r.namaSiswa.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.kelasSiswa.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJenis = filterJenis === 'Semua' || r.jenisAsesmen === filterJenis;
    const matchesAspek = filterAspek === 'Semua' || r.aspekBK === filterAspek;
    const matchesKelas = filterKelas === 'Semua' || r.kelasSiswa === filterKelas;
    return matchesSearch && matchesJenis && matchesAspek && matchesKelas;
  });

  const kelasOptions = ['Semua', ...Array.from(new Set(allResults.map(r => r.kelasSiswa)))];

  // PRINT & DOWNLOAD HANDLERS (ENFORCING GURU BK ONLY)
  const handlePrintIndividual = (result: AssessmentResult) => {
    if (role !== 'guru_bk') {
      showToast('Akses Ditolak: Hanya Guru BK yang berhak mencetak hasil asesmen.', 'error');
      return;
    }
    onOpenPrintIndividual(result);
  };

  const handleDownloadIndividual = (result: AssessmentResult) => {
    if (role !== 'guru_bk') {
      showToast('Akses Ditolak: Hanya Guru BK yang berhak mengunduh hasil asesmen.', 'error');
      return;
    }
    try {
      downloadIndividualAssessmentPdf({
        result,
        guruNama: currentUser.nama,
        guruNip: currentUser.nipNik,
        role: role!
      });
      showToast(`Mengunduh PDF Hasil Asesmen ${result.namaSiswa}...`, 'success');
    } catch (e: any) {
      showToast(e.message || 'Gagal membuat dokumen PDF.', 'error');
    }
  };

  const handlePrintRecapAction = () => {
    if (role !== 'guru_bk') {
      showToast('Akses Ditolak: Hanya Guru BK yang berhak mencetak rekap.', 'error');
      return;
    }
    setIsRecapModalOpen(false);
    onOpenPrintRecap(filteredResults, {
      periode: recapPeriod,
      kelas: filterKelas,
      jenis: filterJenis
    });
  };

  const handleDownloadRecapPdfAction = () => {
    if (role !== 'guru_bk') {
      showToast('Akses Ditolak: Hanya Guru BK yang berhak mengunduh rekap.', 'error');
      return;
    }
    try {
      downloadRecapAssessmentPdf({
        results: filteredResults,
        guruNama: currentUser.nama,
        guruNip: currentUser.nipNik,
        periodeStr: recapPeriod,
        role: role!,
        filterKelas,
        filterJenis
      });
      setIsRecapModalOpen(false);
      showToast('Mengunduh PDF Rekap Hasil Asesmen BK...', 'success');
    } catch (e: any) {
      showToast(e.message || 'Gagal membuat rekap PDF.', 'error');
    }
  };

  const handleDownloadRecapCsvAction = () => {
    if (role !== 'guru_bk') {
      showToast('Akses Ditolak: Hanya Guru BK yang berhak mengunduh rekap.', 'error');
      return;
    }
    try {
      downloadRecapAssessmentCsv(filteredResults, role!);
      setIsRecapModalOpen(false);
      showToast('Mengunduh CSV Rekap Hasil Asesmen BK...', 'success');
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Hasil Asesmen' }]} />

      {/* Top Header with Print / Download Recap Action Buttons */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">
              Hasil Asesmen Bimbingan dan Konseling
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Khusus Guru BK
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#8A674A] dark:text-[#BA9B81] mt-0.5">
            Analisis kebutuhan, pencetakan formal A4, dan unduh laporan hasil asesmen siswa.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsRecapModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#FAF5EE] dark:bg-[#342419] hover:bg-[#F2E4D2] text-[#6A4728] dark:text-[#ECC9AC] border border-[#E8DCCB] dark:border-[#4B3728] text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4 text-[#8B5E3C]" />
            <span>🖨️ Cetak Rekap</span>
          </button>

          <button
            onClick={() => setIsRecapModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white text-xs font-bold shadow-md shadow-[#8B5E3C]/20 transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>⬇️ Download Rekap</span>
          </button>
        </div>
      </div>

      {/* Filters & View Switcher */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#9A7D66]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari siswa atau kelas..."
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-1 focus:ring-[#8B5E3C]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-[#4A3525] dark:text-[#F3E9DD] font-semibold"
          >
            <option value="Semua">Semua Instrumen</option>
            <option value="DCM">DCM</option>
            <option value="AUM">AUM</option>
            <option value="Sosiometri">Sosiometri</option>
          </select>

          <select
            value={filterAspek}
            onChange={(e) => setFilterAspek(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-[#4A3525] dark:text-[#F3E9DD] font-semibold"
          >
            <option value="Semua">Semua Aspek BK</option>
            <option value="Pribadi">Pribadi</option>
            <option value="Sosial">Sosial</option>
            <option value="Belajar">Belajar</option>
            <option value="Karier">Karier</option>
          </select>

          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-[#4A3525] dark:text-[#F3E9DD] font-semibold"
          >
            {kelasOptions.map(k => (
              <option key={k} value={k}>Kelas: {k}</option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-[#FAF5EE] dark:bg-[#342419] rounded-xl border border-[#E8DEC8] dark:border-[#3E2D20]">
          <button
            onClick={() => setViewMode('tabel')}
            className={`p-1.5 rounded-lg text-xs ${viewMode === 'tabel' ? 'bg-[#8B5E3C] text-white' : 'text-[#7D5C40] dark:text-[#C5A893]'}`}
            title="Tampilan Tabel"
          >
            <TableIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`p-1.5 rounded-lg text-xs ${viewMode === 'card' ? 'bg-[#8B5E3C] text-white' : 'text-[#7D5C40] dark:text-[#C5A893]'}`}
            title="Tampilan Card"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grafik')}
            className={`p-1.5 rounded-lg text-xs ${viewMode === 'grafik' ? 'bg-[#8B5E3C] text-white' : 'text-[#7D5C40] dark:text-[#C5A893]'}`}
            title="Tampilan Grafik"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: TABEL HASIL ASESMEN */}
      {viewMode === 'tabel' && (
        <div className="bg-white dark:bg-[#251B13] rounded-3xl border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF5EE] dark:bg-[#2E2017] border-b border-[#E8DEC8] dark:border-[#3E2D20] text-[#6A4728] dark:text-[#E2C7B0] font-bold">
                  <th className="p-4">No</th>
                  <th className="p-4">Nama Siswa</th>
                  <th className="p-4">Kelas</th>
                  <th className="p-4">Instrumen</th>
                  <th className="p-4">Aspek BK</th>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Ringkasan Masalah</th>
                  <th className="p-4 text-center">Aksi Guru BK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EAE0] dark:divide-[#3A2A1E]">
                {filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-stone-400">
                      Tidak ada hasil asesmen yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-[#FAF6F0] dark:hover:bg-[#2C1E15] transition-colors">
                      <td className="p-4 font-bold text-[#8C6D53]">{idx + 1}</td>
                      <td className="p-4 font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">
                        {item.namaSiswa}
                      </td>
                      <td className="p-4 font-bold text-[#5C3F28] dark:text-[#ECC9AC]">{item.kelasSiswa}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-[#EFE3D5] text-[#6A4728] dark:bg-[#342419] dark:text-[#ECC9AC] font-bold">
                          {item.jenisAsesmen}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-[#7A5B40] dark:text-[#C5A893]">{item.aspekBK}</td>
                      <td className="p-4 text-[#8C6D53]">
                        {new Date(item.tanggalPengerjaan).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                      </td>
                      <td className="p-4 max-w-xs truncate text-[#6F523B] dark:text-[#BA9B81]">
                        {item.ringkasan}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* 1. Lihat Detail */}
                          <button
                            onClick={() => setSelectedResult(item)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                            title="Lihat Detail"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* 2. Cetak Hasil */}
                          <button
                            onClick={() => handlePrintIndividual(item)}
                            className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                            title="🖨️ Cetak Hasil Individu"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* 3. Download Hasil (PDF) */}
                          <button
                            onClick={() => handleDownloadIndividual(item)}
                            className="p-1.5 rounded-lg bg-[#8B5E3C] hover:bg-[#724B2E] text-white"
                            title="⬇️ Download Hasil PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: CARD GRID */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResults.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EFE3D5] text-[#6A4728] dark:bg-[#342419] dark:text-[#ECC9AC]">
                    {item.jenisAsesmen} • {item.aspekBK}
                  </span>
                  <span className="text-[11px] text-[#8C6D53]">
                    {item.tanggalPengerjaan.slice(0, 10)}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="font-extrabold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                    {item.namaSiswa}
                  </h3>
                  <p className="text-xs text-[#8C6D53]">Kelas: {item.kelasSiswa} • Skor Total: {item.skorTotal}</p>
                </div>

                <p className="mt-2 text-xs text-[#6F523B] dark:text-[#C5A893] bg-[#FAF5EE] dark:bg-[#2E2017] p-3 rounded-xl border border-[#E8DCCB] dark:border-[#443122] line-clamp-3">
                  {item.ringkasan}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E8DEC8] dark:border-[#3E2D20]">
                <button
                  onClick={() => setSelectedResult(item)}
                  className="text-xs font-bold text-[#8B5E3C] hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Detail</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePrintIndividual(item)}
                    className="p-1.5 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold hover:bg-amber-200"
                    title="Cetak Hasil"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDownloadIndividual(item)}
                    className="p-1.5 rounded-lg bg-[#8B5E3C] text-white text-xs font-bold hover:bg-[#724B2E]"
                    title="Download PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODE 3: GRAFIK RINGKASAN */}
      {viewMode === 'grafik' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-[#4A3525] dark:text-[#F3E9DD]">
              Distribusi Asesmen Berdasarkan Aspek BK
            </h3>
            <div className="space-y-3">
              {(['Pribadi', 'Sosial', 'Belajar', 'Karier'] as const).map(asp => {
                const count = filteredResults.filter(r => r.aspekBK === asp).length;
                const pct = filteredResults.length > 0 ? (count / filteredResults.length) * 100 : 0;
                return (
                  <div key={asp} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#6A4728] dark:text-[#D1B8A5]">
                      <span>Aspek {asp}</span>
                      <span>{count} siswa ({Math.round(pct)}%)</span>
                    </div>
                    <div className="w-full bg-[#FAF5EE] dark:bg-[#342419] h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-[#8B5E3C] h-full rounded-full transition-all"
                        style={{ width: `${Math.max(pct, count > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-[#4A3525] dark:text-[#F3E9DD]">
              Distribusi Berdasarkan Jenis Instrumen
            </h3>
            <div className="space-y-3">
              {(['DCM', 'AUM', 'Sosiometri'] as const).map(inst => {
                const count = filteredResults.filter(r => r.jenisAsesmen === inst).length;
                const pct = filteredResults.length > 0 ? (count / filteredResults.length) * 100 : 0;
                return (
                  <div key={inst} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#6A4728] dark:text-[#D1B8A5]">
                      <span>{inst}</span>
                      <span>{count} berkas ({Math.round(pct)}%)</span>
                    </div>
                    <div className="w-full bg-[#FAF5EE] dark:bg-[#342419] h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-[#5C4033] h-full rounded-full transition-all"
                        style={{ width: `${Math.max(pct, count > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#251B13] rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-[#E8DEC8] dark:border-[#423122] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#38281B]">
              <h3 className="font-extrabold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                Detail Hasil Asesmen: {selectedResult.namaSiswa}
              </h3>
              <button onClick={() => setSelectedResult(null)} className="text-stone-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAF5EE] dark:bg-[#2E2017] p-4 rounded-2xl border border-[#E8DCCB]">
              <div>
                <p><strong>Nama:</strong> {selectedResult.namaSiswa}</p>
                <p><strong>Kelas:</strong> {selectedResult.kelasSiswa}</p>
                <p><strong>Jenis Kelamin:</strong> {selectedResult.jenisKelamin}</p>
              </div>
              <div>
                <p><strong>Instrumen:</strong> {selectedResult.jenisAsesmen}</p>
                <p><strong>Aspek:</strong> {selectedResult.aspekBK}</p>
                <p><strong>Tanggal:</strong> {new Date(selectedResult.tanggalPengerjaan).toLocaleString('id-ID')}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#8B5E3C] mb-1">
                Ringkasan Temuan:
              </h4>
              <p className="text-xs text-[#523C2B] dark:text-[#D5BCA9] bg-[#FAF5EE] dark:bg-[#2E2017] p-3 rounded-xl border border-[#E8DCCB]">
                {selectedResult.ringkasan}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#8B5E3C] mb-2">
                Rincian Indikator Kebutuhan:
              </h4>
              <div className="space-y-2 text-xs">
                {selectedResult.detailHasil.map((item, i) => (
                  <div key={i} className="p-3 rounded-xl border border-[#E8DEC8] bg-white dark:bg-[#251B13]">
                    <div className="flex justify-between font-bold text-[#4A3525] dark:text-[#F3E9DD]">
                      <span>{item.aspek} (Skor: {item.skor})</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        item.kategoriTingkat === 'Tinggi' ? 'bg-rose-100 text-rose-800' :
                        item.kategoriTingkat === 'Sedang' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        Tingkat {item.kategoriTingkat}
                      </span>
                    </div>
                    <p className="text-[#6F523B] dark:text-[#C5A893] mt-1">{item.keterangan}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Print & Download Buttons from Inside Detail Modal */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E8DEC8] dark:border-[#3E2D20]">
              <span className="text-[11px] text-stone-400">Otorisasi Guru BK</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handlePrintIndividual(selectedResult);
                    setSelectedResult(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>🖨️ Cetak Hasil</span>
                </button>

                <button
                  onClick={() => handleDownloadIndividual(selectedResult)}
                  className="px-4 py-2 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>⬇️ Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FILTER MODAL SEBELUM PRINT / DOWNLOAD REKAP (USER REQUIREMENT NO 23) */}
      {isRecapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#251B13] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8DEC8] dark:border-[#423122] animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#38281B]">
              <h3 className="font-extrabold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                Pengaturan Rekap Hasil Asesmen
              </h3>
              <button onClick={() => setIsRecapModalOpen(false)} className="text-stone-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#5C3F28] mb-1">Periode Tanggal</label>
                <select
                  value={recapPeriod}
                  onChange={(e) => setRecapPeriod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8]"
                >
                  <option value="Bulan Ini (Oktober 2026)">Bulan Ini (Oktober 2026)</option>
                  <option value="Semester Ganjil 2026/2027">Semester Ganjil 2026/2027</option>
                  <option value="Tahun Ajaran 2026/2027">Tahun Ajaran 2026/2027</option>
                  <option value="Semua Periode">Semua Periode</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#5C3F28] mb-1">Kelas</label>
                <select
                  value={filterKelas}
                  onChange={(e) => setFilterKelas(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8]"
                >
                  {kelasOptions.map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#5C3F28] mb-1">Jenis Asesmen</label>
                <select
                  value={filterJenis}
                  onChange={(e) => setFilterJenis(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8]"
                >
                  <option value="Semua">Semua Jenis Instrumen</option>
                  <option value="DCM">DCM (Daftar Cek Masalah)</option>
                  <option value="AUM">AUM (Alat Ungkap Masalah)</option>
                  <option value="Sosiometri">Sosiometri</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#5C3F28] mb-1">Aspek BK</label>
                <select
                  value={filterAspek}
                  onChange={(e) => setFilterAspek(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8]"
                >
                  <option value="Semua">Semua Aspek</option>
                  <option value="Pribadi">Pribadi</option>
                  <option value="Sosial">Sosial</option>
                  <option value="Belajar">Belajar</option>
                  <option value="Karier">Karier</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF5EE] dark:bg-[#2E2017] text-[#8C6D53] border border-[#E8DCCB]">
                Jumlah data tersaring: <strong>{filteredResults.length} berkas asesmen</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-[#E8DEC8]">
              <button
                type="button"
                onClick={handlePrintRecapAction}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>🖨️ Cetak Rekap</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadRecapPdfAction}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>⬇️ Unduh PDF</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadRecapCsvAction}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Unduh CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
