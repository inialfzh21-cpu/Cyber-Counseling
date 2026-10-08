import React, { useState, useRef } from 'react';
import { 
  Database, 
  FileSpreadsheet, 
  Download, 
  Upload, 
  Hash, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Sparkles,
  Users,
  GraduationCap,
  CalendarClock,
  FolderKanban,
  FileText,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../lib/storage';
import { Breadcrumb } from '../common/Breadcrumb';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const DatabaseGoogleSheets: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [settings, setSettings] = useState(() => storage.getSettings());
  const [kodeInput, setKodeInput] = useState(settings.kodeDatabase);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // File input ref for backup JSON import
  const fileImportRef = useRef<HTMLInputElement | null>(null);

  if (!currentUser) return null;

  // Save Grouping Code (Admin Only)
  const handleSaveKodeDatabase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kodeInput.trim()) {
      showToast('Kode Database tidak boleh kosong.', 'warning');
      return;
    }

    const updated = storage.updateSettings({ kodeDatabase: kodeInput.trim().toUpperCase() });
    setSettings(updated);
    showToast(`Kode Database berhasil diperbarui menjadi: ${updated.kodeDatabase}`, 'success');
  };

  // Helper to trigger file download
  const triggerDownload = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Convert array of objects to CSV
  const convertToCSV = (data: any[], headers: string[], keys: string[]): string => {
    const headerRow = headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',');
    const rows = data.map(item => {
      return keys.map(k => {
        const val = item[k] !== undefined && item[k] !== null ? String(item[k]) : '';
        return `"${val.replace(/"/g, '""')}"`;
      }).join(',');
    });
    return [headerRow, ...rows].join('\r\n');
  };

  // Download Individual CSVs (Can be opened in Excel / Google Sheets without Google Cloud)
  const handleExportSiswaCSV = () => {
    const siswaList = storage.getUsers().filter(u => u.role === 'siswa');
    const csv = convertToCSV(
      siswaList,
      ['ID', 'Nama Siswa', 'Kelas', 'Jenis Kelamin', 'Email', 'Username', 'Kode Database'],
      ['id', 'nama', 'kelas', 'jenisKelamin', 'email', 'username', 'groupCode']
    );
    triggerDownload(`Data_Siswa_${settings.kodeDatabase}.csv`, csv, 'text/csv;charset=utf-8;');
    showToast('File CSV Data Siswa berhasil diunduh.', 'success');
  };

  const handleExportGuruCSV = () => {
    const guruList = storage.getUsers().filter(u => u.role === 'guru_bk');
    const csv = convertToCSV(
      guruList,
      ['ID', 'Nama Guru BK', 'NIP/NIK', 'Jenis Kelamin', 'Email', 'Username', 'Kode Database'],
      ['id', 'nama', 'nipNik', 'jenisKelamin', 'email', 'username', 'groupCode']
    );
    triggerDownload(`Data_Guru_BK_${settings.kodeDatabase}.csv`, csv, 'text/csv;charset=utf-8;');
    showToast('File CSV Data Guru BK berhasil diunduh.', 'success');
  };

  const handleExportAsesmenCSV = () => {
    const results = storage.getResults();
    const csv = convertToCSV(
      results,
      ['ID', 'Nama Siswa', 'Kelas', 'Jenis Asesmen', 'Aspek BK', 'Skor Total', 'Ringkasan', 'Tanggal Pengerjaan', 'Kode Database'],
      ['id', 'namaSiswa', 'kelasSiswa', 'jenisAsesmen', 'aspekBK', 'skorTotal', 'ringkasan', 'tanggalPengerjaan', 'groupCode']
    );
    triggerDownload(`Data_Hasil_Asesmen_${settings.kodeDatabase}.csv`, csv, 'text/csv;charset=utf-8;');
    showToast('File CSV Hasil Asesmen berhasil diunduh.', 'success');
  };

  const handleExportLayananCSV = () => {
    const services = storage.getServices();
    const csv = convertToCSV(
      services,
      ['ID', 'Nama Siswa', 'Guru BK', 'Tanggal', 'Jenis Layanan', 'Tujuan', 'Permasalahan', 'Tindakan', 'Hasil Layanan', 'Status', 'Kode Database'],
      ['id', 'namaSiswa', 'namaGuru', 'tanggal', 'jenisLayanan', 'tujuan', 'permasalahan', 'tindakan', 'hasilLayanan', 'status', 'groupCode']
    );
    triggerDownload(`Data_Catatan_Layanan_BK_${settings.kodeDatabase}.csv`, csv, 'text/csv;charset=utf-8;');
    showToast('File CSV Catatan Layanan BK berhasil diunduh.', 'success');
  };

  const handleExportJanjiCSV = () => {
    const appts = storage.getAppointments();
    const csv = convertToCSV(
      appts,
      ['ID', 'Nama Siswa', 'Guru BK', 'Tanggal', 'Waktu', 'Topik/Alasan', 'Status', 'Catatan Guru', 'Kode Database'],
      ['id', 'namaSiswa', 'namaGuru', 'tanggal', 'waktu', 'alasan', 'status', 'catatan', 'groupCode']
    );
    triggerDownload(`Data_Janji_Konseling_${settings.kodeDatabase}.csv`, csv, 'text/csv;charset=utf-8;');
    showToast('File CSV Janji Konseling berhasil diunduh.', 'success');
  };

  // Backup Full JSON System
  const handleExportFullJson = () => {
    const jsonStr = storage.exportDatabaseJson();
    triggerDownload(
      `Backup_Database_CYBER_COUNSELING_${settings.kodeDatabase}_${new Date().toISOString().slice(0, 10)}.json`,
      jsonStr,
      'application/json;charset=utf-8;'
    );
    showToast('Cadangan Database Lengkap (JSON) berhasil diunduh.', 'success');
  };

  // Restore JSON File
  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = storage.importDatabaseJson(content);
        if (ok) {
          setSettings(storage.getSettings());
          setKodeInput(storage.getSettings().kodeDatabase);
          showToast('Data cadangan berhasil dipulihkan secara utuh!', 'success');
        } else {
          showToast('Format file JSON cadangan tidak valid.', 'error');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Reset to default seed
  const handleConfirmReset = () => {
    storage.resetAllData();
    setSettings(storage.getSettings());
    setKodeInput(storage.getSettings().kodeDatabase);
    setResetModalOpen(false);
    showToast('Data sistem telah direset ke setelan awal pabrik.', 'info');
  };

  // Record counts
  const users = storage.getUsers();
  const siswaCount = users.filter(u => u.role === 'siswa').length;
  const guruCount = users.filter(u => u.role === 'guru_bk').length;
  const resultCount = storage.getResults().length;
  const apptCount = storage.getAppointments().length;
  const serviceCount = storage.getServices().length;
  const questionCount = storage.getQuestions().length;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Manajemen Database Mandiri' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#3E2718] dark:text-[#FAF3EB]">
            Manajemen Basis Data Mandiri (Bebas Biaya Cloud)
          </h1>
          <p className="text-xs sm:text-sm text-[#826146] dark:text-[#BCA087] mt-0.5">
            Sistem database lokal mandiri berkecepatan tinggi yang dapat diterbitkan secara gratis tanpa memerlukan akun Google Cloud berbayar.
          </p>
        </div>

        {/* 100% Free Publishing Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Gratis • Bebas Biaya Google Cloud</span>
        </div>
      </div>

      {/* Announcement Card: Free & Self-Contained */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#FAF5EE] to-[#EFE3D3] dark:from-[#251A13] dark:to-[#1C130D] border border-[#DECBB8] dark:border-[#422F20] shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-white dark:bg-[#342419] text-[#8C5D38] dark:text-[#E2C7B0] flex items-center justify-center border border-[#DECBB8] dark:border-[#4A3423] shrink-0">
            <Sparkles className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-sm sm:text-base text-[#3E2718] dark:text-[#FAF3EB]">
              Aplikasi Mandiri Siap Diterbitkan (Publish) Tanpa Biaya
            </h3>
            <p className="text-xs sm:text-sm text-[#70533C] dark:text-[#BCA088] leading-relaxed">
              Seluruh basis data disimpan dan dikelola secara mandiri menggunakan teknologi penyimpanan peramban berkinerja tinggi. Anda tidak perlu membuat akun penagihan Google Cloud Platform (GCP) ataupun Google Cloud Console. Anda dapat mengekspor seluruh tabel langsung ke format <strong>Spreadsheet (.CSV)</strong> yang dapat dibuka langsung di Microsoft Excel, Google Sheets, maupun software spreadsheet lainnya secara cuma-cuma.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: KODE PENGELOMPOKAN DATABASE SEKOLAH */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FAF5EE] dark:bg-[#342419] text-[#8B5E3C] flex items-center justify-center shrink-0 border border-[#E8DEC8]">
            <Hash className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div>
            <h2 className="font-bold text-base text-[#3E2718] dark:text-[#FAF3EB]">
              Kode Pengelompokan Database Sekolah
            </h2>
            <p className="text-xs text-[#826146] dark:text-[#BCA087]">
              Kunci pengelompokan basis data untuk memisahkan data antar angkatan atau sekolah (Hanya dapat diubah oleh Administrator).
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveKodeDatabase} className="flex flex-wrap items-center gap-3 pt-2">
          <div className="relative w-full sm:w-64">
            <Hash className="w-4 h-4 absolute left-3 top-3 text-[#A88C75]" />
            <input
              type="text"
              required
              value={kodeInput}
              onChange={(e) => setKodeInput(e.target.value.toUpperCase())}
              placeholder="Contoh: BK-2026"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#423122] text-sm font-mono font-bold text-[#8B5E3C] dark:text-[#E2C7B0] focus:ring-2 focus:ring-[#8C5D38]/50 outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#3A2416] hover:bg-[#523420] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#C5A059]" />
            <span>Simpan Kode Database</span>
          </button>

          <span className="text-xs text-[#8C6D53] dark:text-[#B1937B]">
            Kode aktif saat ini: <strong className="font-mono text-[#3E2718] dark:text-[#FAF3EB]">{settings.kodeDatabase}</strong>
          </span>
        </form>
      </div>

      {/* SECTION 2: EKSPOR SPREADSHEET (CSV / EXCEL) TANPA GOOGLE CLOUD */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DF] dark:border-[#35261C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF5EE] dark:bg-[#342419] text-[#8B5E3C] flex items-center justify-center shrink-0 border border-[#E8DEC8]">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[#3E2718] dark:text-[#FAF3EB]">
                Ekspor ke Format Spreadsheet (CSV / Excel)
              </h2>
              <p className="text-xs text-[#826146] dark:text-[#BCA087]">
                Unduh data tabel dalam format spreadsheet standar yang dapat dibuka di Google Sheets atau Microsoft Excel secara cuma-cuma.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {/* Ekspor Siswa */}
          <div className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#2B1D15] border border-[#EAE0D2] dark:border-[#3C291E] flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <Users className="w-4 h-4 text-[#C5A059]" />
              <span className="font-bold text-xs text-[#3E2718] dark:text-[#FAF3EB]">Data Siswa</span>
              <span className="ml-auto text-[11px] font-semibold text-[#8C6D53] dark:text-[#B1937B]">{siswaCount} baris</span>
            </div>
            <p className="text-[11px] text-[#7A5E47] dark:text-[#B69982] mb-3">
              Daftar seluruh siswa terdaftar, kelas, jenis kelamin, dan username.
            </p>
            <button
              onClick={handleExportSiswaCSV}
              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#36261C] hover:bg-[#FAF4EC] text-[#3E2718] dark:text-[#FAF3EB] text-xs font-bold border border-[#DECBB8] dark:border-[#483324] transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Unduh CSV Siswa</span>
            </button>
          </div>

          {/* Ekspor Guru BK */}
          <div className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#2B1D15] border border-[#EAE0D2] dark:border-[#3C291E] flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <GraduationCap className="w-4 h-4 text-[#C5A059]" />
              <span className="font-bold text-xs text-[#3E2718] dark:text-[#FAF3EB]">Data Guru BK</span>
              <span className="ml-auto text-[11px] font-semibold text-[#8C6D53] dark:text-[#B1937B]">{guruCount} baris</span>
            </div>
            <p className="text-[11px] text-[#7A5E47] dark:text-[#B69982] mb-3">
              Daftar guru konselor BK sekolah, NIP/NIK, dan alamat kontak.
            </p>
            <button
              onClick={handleExportGuruCSV}
              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#36261C] hover:bg-[#FAF4EC] text-[#3E2718] dark:text-[#FAF3EB] text-xs font-bold border border-[#DECBB8] dark:border-[#483324] transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Unduh CSV Guru BK</span>
            </button>
          </div>

          {/* Ekspor Hasil Asesmen */}
          <div className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#2B1D15] border border-[#EAE0D2] dark:border-[#3C291E] flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <FileCheck className="w-4 h-4 text-[#C5A059]" />
              <span className="font-bold text-xs text-[#3E2718] dark:text-[#FAF3EB]">Hasil Asesmen BK</span>
              <span className="ml-auto text-[11px] font-semibold text-[#8C6D53] dark:text-[#B1937B]">{resultCount} baris</span>
            </div>
            <p className="text-[11px] text-[#7A5E47] dark:text-[#B69982] mb-3">
              Rekapitulasi skor DCM, AUM, dan Sosiometri seluruh siswa.
            </p>
            <button
              onClick={handleExportAsesmenCSV}
              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#36261C] hover:bg-[#FAF4EC] text-[#3E2718] dark:text-[#FAF3EB] text-xs font-bold border border-[#DECBB8] dark:border-[#483324] transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Unduh CSV Asesmen</span>
            </button>
          </div>

          {/* Ekspor Catatan Layanan BK */}
          <div className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#2B1D15] border border-[#EAE0D2] dark:border-[#3C291E] flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <FolderKanban className="w-4 h-4 text-[#C5A059]" />
              <span className="font-bold text-xs text-[#3E2718] dark:text-[#FAF3EB]">Catatan Layanan BK</span>
              <span className="ml-auto text-[11px] font-semibold text-[#8C6D53] dark:text-[#B1937B]">{serviceCount} baris</span>
            </div>
            <p className="text-[11px] text-[#7A5E47] dark:text-[#B69982] mb-3">
              Arsip kegiatan bimbingan, tindakan, dan catatan tindak lanjut konseling.
            </p>
            <button
              onClick={handleExportLayananCSV}
              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#36261C] hover:bg-[#FAF4EC] text-[#3E2718] dark:text-[#FAF3EB] text-xs font-bold border border-[#DECBB8] dark:border-[#483324] transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Unduh CSV Layanan</span>
            </button>
          </div>

          {/* Ekspor Janji Konseling */}
          <div className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#2B1D15] border border-[#E8DEC8] dark:border-[#3C291E] flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <CalendarClock className="w-4 h-4 text-[#C5A059]" />
              <span className="font-bold text-xs text-[#3E2718] dark:text-[#FAF3EB]">Janji Konseling</span>
              <span className="ml-auto text-[11px] font-semibold text-[#8C6D53] dark:text-[#B1937B]">{apptCount} baris</span>
            </div>
            <p className="text-[11px] text-[#7A5E47] dark:text-[#B69982] mb-3">
              Jadwal konsultasi tatap muka, alasan janji, dan status konfirmasi.
            </p>
            <button
              onClick={handleExportJanjiCSV}
              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#36261C] hover:bg-[#FAF4EC] text-[#3E2718] dark:text-[#FAF3EB] text-xs font-bold border border-[#DECBB8] dark:border-[#483324] transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Unduh CSV Janji</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: CADANGAN & PEMULIHAN SISTEM (FULL BACKUP JSON) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FAF5EE] dark:bg-[#342419] text-[#8B5E3C] flex items-center justify-center shrink-0 border border-[#E8DEC8]">
            <Database className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div>
            <h2 className="font-bold text-base text-[#3E2718] dark:text-[#FAF3EB]">
              Cadangan (Backup) & Pemulihan (Restore) Lengkap
            </h2>
            <p className="text-xs text-[#826146] dark:text-[#BCA087]">
              Simpan seluruh database sekolah ke file JSON atau pulihkan data di komputer lain dengan satu klik.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Ekspor JSON */}
          <button
            onClick={handleExportFullJson}
            className="px-5 py-2.5 rounded-xl bg-[#3A2416] hover:bg-[#523420] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#C5A059]" />
            <span>Unduh Cadangan Penuh (JSON)</span>
          </button>

          {/* Impor JSON */}
          <input
            type="file"
            ref={fileImportRef}
            accept=".json,application/json"
            onChange={handleImportJsonFile}
            className="hidden"
          />
          <button
            onClick={() => fileImportRef.current?.click()}
            className="px-5 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] hover:bg-[#EFE4D3] text-[#3E2718] dark:text-[#FAF3EB] text-xs font-bold border border-[#DECBB8] dark:border-[#423122] transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-[#C5A059]" />
            <span>Pulihkan Cadangan (Restore JSON)</span>
          </button>

          {/* Reset Factory */}
          <button
            onClick={() => setResetModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-800 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-900 transition-all flex items-center gap-2 ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset ke Setelan Awal</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      <ConfirmationModal
        isOpen={resetModalOpen}
        title="Reset Seluruh Data Sistem"
        message="Tindakan ini akan mengembalikan seluruh data pengguna, asesmen, dan layanan ke contoh data awal bawaan. Apakah Anda yakin ingin melanjutkan?"
        confirmLabel="Ya, Reset Data"
        cancelLabel="Batal"
        isDanger={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setResetModalOpen(false)}
      />
    </div>
  );
};
