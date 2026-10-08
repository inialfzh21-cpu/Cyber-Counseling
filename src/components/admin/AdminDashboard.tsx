import React from 'react';
import { 
  Users, 
  GraduationCap, 
  FileCheck2, 
  MessageSquare, 
  CalendarClock, 
  FolderKanban, 
  Database, 
  Settings, 
  ShieldAlert,
  ArrowRight,
  School,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../lib/storage';
import { Breadcrumb } from '../common/Breadcrumb';

interface AdminDashboardProps {
  onNavigate: (menu: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const settings = storage.getSettings();
  const allUsers = storage.getUsers();
  const guruList = allUsers.filter(u => u.role === 'guru_bk');
  const siswaList = allUsers.filter(u => u.role === 'siswa');
  const results = storage.getResults();
  const appointments = storage.getAppointments();
  const services = storage.getServices();
  const questions = storage.getQuestions();
  const gsheetsConfig = storage.getGoogleSheetsConfig();

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard Admin' }]} />

      {/* Admin Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E140D] via-[#362317] to-[#4F3322] border border-[#C5A059]/40 text-white p-6 sm:p-8 shadow-xl shadow-[#1E140D]/25">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src={currentUser.fotoProfil || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.nama}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#C5A059] shadow-lg shrink-0"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold mb-2 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-[#EAD0A0]" />
                <span className="text-[#F5E6CC]">Pusat Kendali Administrator Sistem</span>
              </div>
              <h1 className="font-editorial text-2xl sm:text-4xl font-bold tracking-tight text-[#FAF3EB]">
                Panel Administrator CYBER-COUNSELING
              </h1>
              <p className="text-xs sm:text-sm text-[#DFCFBE] mt-1">
                Lembaga: <span className="font-bold text-white">{settings.namaSekolah}</span> • Kode Database: <span className="font-mono bg-white/20 px-2 py-0.5 rounded font-bold text-[#EAD0A0]">{settings.kodeDatabase}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('Database & Google Sheets')}
              className="px-4 py-2.5 rounded-xl bg-white text-[#4A3525] font-bold text-xs sm:text-sm hover:bg-[#FAF4ED] transition-all shadow-md flex items-center gap-2"
            >
              <Database className="w-4 h-4 text-[#8B5E3C]" />
              <span>Manajemen Database</span>
            </button>
          </div>
        </div>

        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Admin Security Policy Card (USER REQUIREMENT NO 31) */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Peraturan Keamanan Akses:</strong> Administrator bertugas mengelola akun, instrumen soal, kode sekolah, dan basis data mandiri. Sesuai asas kerahasiaan konseling, fitur Cetak dan Unduh berkas asesmen individual hanya dapat diakses oleh Guru BK yang memiliki mandat konseling resmi.
        </div>
      </div>

      {/* 6 Statistics Cards for Admin */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div 
          onClick={() => onNavigate('Data Guru')}
          className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs hover:shadow-md cursor-pointer transition-all"
        >
          <span className="text-xs font-bold text-[#8A674A]">Jumlah Guru</span>
          <p className="text-2xl font-black text-[#4A3525] dark:text-[#F3E9DD] mt-2">{guruList.length}</p>
          <p className="text-[10px] text-[#A08168]">Guru BK aktif</p>
        </div>

        <div 
          onClick={() => onNavigate('Data Siswa')}
          className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs hover:shadow-md cursor-pointer transition-all"
        >
          <span className="text-xs font-bold text-[#8A674A]">Jumlah Siswa</span>
          <p className="text-2xl font-black text-[#4A3525] dark:text-[#F3E9DD] mt-2">{siswaList.length}</p>
          <p className="text-[10px] text-[#A08168]">Siswa terdaftar</p>
        </div>

        <div 
          onClick={() => onNavigate('Data Asesmen & Soal')}
          className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs hover:shadow-md cursor-pointer transition-all"
        >
          <span className="text-xs font-bold text-[#8A674A]">Bank Soal</span>
          <p className="text-2xl font-black text-[#4A3525] dark:text-[#F3E9DD] mt-2">{questions.length}</p>
          <p className="text-[10px] text-[#A08168]">Butir pernyataan</p>
        </div>

        <div 
          onClick={() => onNavigate('Database & Google Sheets')}
          className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs hover:shadow-md cursor-pointer transition-all"
        >
          <span className="text-xs font-bold text-[#8A674A]">Hasil Asesmen</span>
          <p className="text-2xl font-black text-[#4A3525] dark:text-[#F3E9DD] mt-2">{results.length}</p>
          <p className="text-[10px] text-[#A08168]">Tersimpan di DB</p>
        </div>

        <div 
          onClick={() => onNavigate('Database & Google Sheets')}
          className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs hover:shadow-md cursor-pointer transition-all"
        >
          <span className="text-xs font-bold text-[#8A674A]">Janji Konseling</span>
          <p className="text-2xl font-black text-[#4A3525] dark:text-[#F3E9DD] mt-2">{appointments.length}</p>
          <p className="text-[10px] text-[#A08168]">Sesi diajukan</p>
        </div>

        <div 
          onClick={() => onNavigate('Database & Google Sheets')}
          className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs hover:shadow-md cursor-pointer transition-all"
        >
          <span className="text-xs font-bold text-[#8A674A]">Layanan BK</span>
          <p className="text-2xl font-black text-[#4A3525] dark:text-[#F3E9DD] mt-2">{services.length}</p>
          <p className="text-[10px] text-[#A08168]">Kasus tercatat</p>
        </div>
      </div>

      {/* Admin Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Standalone Database Card (Free from Google Cloud) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-[#8B5E3C]" />
              <h3 className="font-extrabold text-sm sm:text-base text-[#4A3525] dark:text-[#F3E9DD]">
                Basis Data Mandiri & Bebas Cloud
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              Bebas Biaya Cloud
            </span>
          </div>

          <p className="text-xs text-[#73553D] dark:text-[#B6967E] leading-relaxed">
            Aplikasi berjalan mandiri tanpa ketergantungan Google Cloud berbayar. Anda dapat mengekspor seluruh tabel ke format spreadsheet (CSV/Excel), mencadangkan file JSON, dan memulihkan data kapan saja secara gratis.
          </p>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('Database & Google Sheets')}
              className="px-4 py-2 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <span>Buka Manajemen Database</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* System Settings & Code Info */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
            <div className="flex items-center gap-2.5">
              <School className="w-5 h-5 text-[#8B5E3C]" />
              <h3 className="font-extrabold text-sm sm:text-base text-[#4A3525] dark:text-[#F3E9DD]">
                Identitas Sekolah & Kode Database
              </h3>
            </div>
            <button
              onClick={() => onNavigate('Pengaturan Sistem')}
              className="text-xs font-bold text-[#8B5E3C] hover:underline"
            >
              Ubah
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#FAF4ED]">
              <span className="text-[#8C6D53]">Nama Sekolah:</span>
              <span className="font-bold text-[#4A3525] dark:text-[#F3E9DD]">{settings.namaSekolah}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#FAF4ED]">
              <span className="text-[#8C6D53]">Kode Database:</span>
              <span className="font-mono font-bold text-[#8B5E3C]">{settings.kodeDatabase}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#FAF4ED]">
              <span className="text-[#8C6D53]">Tahun Ajaran:</span>
              <span className="font-bold text-[#4A3525] dark:text-[#F3E9DD]">{settings.tahunAjaran}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#8C6D53]">Alamat Sekolah:</span>
              <span className="text-[#4A3525] dark:text-[#F3E9DD] text-right truncate max-w-[200px]">{settings.alamatSekolah}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
