import React, { useState } from 'react';
import { 
  Users, 
  FileCheck2, 
  MessageSquare, 
  CalendarClock, 
  Clock, 
  FolderKanban, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Printer, 
  Download, 
  ArrowRight,
  TrendingUp,
  School,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../lib/storage';
import { Breadcrumb } from '../common/Breadcrumb';

interface GuruDashboardProps {
  onNavigate: (menu: string) => void;
  onOpenRecapFilterModal: () => void;
}

export const GuruDashboard: React.FC<GuruDashboardProps> = ({ 
  onNavigate,
  onOpenRecapFilterModal
}) => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const users = storage.getUsersByGroup();
  const siswaList = users.filter(u => u.role === 'siswa');
  const results = storage.getResults();
  const appointments = storage.getAppointments();
  const services = storage.getServices();
  const chats = storage.getChats('', currentUser.id);

  const todayStr = new Date().toISOString().slice(0, 10);
  const pendingAppointments = appointments.filter(a => a.status === 'Menunggu konfirmasi');
  const todayAppointments = appointments.filter(a => a.tanggal === todayStr);
  const followUpServices = services.filter(s => s.status === 'Membutuhkan tindak lanjut');

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard Guru BK' }]} />

      {/* Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#24170F] via-[#3E2719] to-[#5C3B24] border border-[#C5A059]/40 text-white p-6 sm:p-8 shadow-xl shadow-[#24170F]/25">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src={currentUser.fotoProfil || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.nama}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#C5A059] shadow-lg shrink-0"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold mb-2 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-[#EAD0A0]" />
                <span className="text-[#F5E6CC]">Panel Konselor Bimbingan & Konseling</span>
              </div>
              <h1 className="font-editorial text-2xl sm:text-4xl font-bold tracking-tight text-[#FAF3EB]">
                Selamat Datang, {currentUser.nama}
              </h1>
              <p className="text-xs sm:text-sm text-[#DFCFBE] mt-1">
                NIP: <span className="font-bold text-white">{currentUser.nipNik || '-'}</span> • Memantau Perkembangan & Kebutuhan Peserta Didik.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('Catatan Layanan BK')}
              className="px-4 py-2.5 rounded-xl bg-white text-[#5C3B1E] font-bold text-xs sm:text-sm hover:bg-[#FDF9F5] transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-[#8B5E3C]" />
              <span>Tambah Layanan BK</span>
            </button>
          </div>
        </div>

        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* 8 Statistics Cards for Guru BK */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('Data Siswa')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A674A] dark:text-[#BA9B81]">Jumlah Siswa</span>
            <div className="w-9 h-9 rounded-xl bg-[#F4EBE1] dark:bg-[#342419] text-[#8B5E3C] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#4A3525] dark:text-[#F3E9DD] mt-3">{siswaList.length}</p>
          <p className="text-[11px] text-[#7A5B40] dark:text-[#A88C76] mt-1">Siswa terdaftar</p>
        </div>

        <div 
          onClick={() => onNavigate('Hasil Asesmen')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A674A] dark:text-[#BA9B81]">Hasil Asesmen</span>
            <div className="w-9 h-9 rounded-xl bg-[#F4EBE1] dark:bg-[#342419] text-[#8B5E3C] flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#4A3525] dark:text-[#F3E9DD] mt-3">{results.length}</p>
          <p className="text-[11px] text-[#7A5B40] dark:text-[#A88C76] mt-1">Asesmen masuk</p>
        </div>

        <div 
          onClick={() => onNavigate('Room Chat')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A674A] dark:text-[#BA9B81]">Chat Masuk</span>
            <div className="w-9 h-9 rounded-xl bg-[#F4EBE1] dark:bg-[#342419] text-[#8B5E3C] flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#4A3525] dark:text-[#F3E9DD] mt-3">
            {chats.filter(c => c.pengirim === 'siswa').length}
          </p>
          <p className="text-[11px] text-[#7A5B40] dark:text-[#A88C76] mt-1">Pesan dari siswa</p>
        </div>

        <div 
          onClick={() => onNavigate('Janji Konseling')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A674A] dark:text-[#BA9B81]">Janji Menunggu</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-3">{pendingAppointments.length}</p>
          <p className="text-[11px] text-[#7A5B40] dark:text-[#A88C76] mt-1">Perlu konfirmasi</p>
        </div>

        <div 
          onClick={() => onNavigate('Janji Konseling')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A674A] dark:text-[#BA9B81]">Janji Hari Ini</span>
            <div className="w-9 h-9 rounded-xl bg-[#F4EBE1] dark:bg-[#342419] text-[#8B5E3C] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#4A3525] dark:text-[#F3E9DD] mt-3">{todayAppointments.length}</p>
          <p className="text-[11px] text-[#7A5B40] dark:text-[#A88C76] mt-1">Sesi konseling aktif</p>
        </div>

        <div 
          onClick={() => onNavigate('Catatan Layanan BK')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A674A] dark:text-[#BA9B81]">Layanan BK</span>
            <div className="w-9 h-9 rounded-xl bg-[#F4EBE1] dark:bg-[#342419] text-[#8B5E3C] flex items-center justify-center group-hover:scale-105 transition-transform">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#4A3525] dark:text-[#F3E9DD] mt-3">{services.length}</p>
          <p className="text-[11px] text-[#7A5B40] dark:text-[#A88C76] mt-1">Total layanan tercatat</p>
        </div>

        <div 
          onClick={() => onNavigate('Tindak Lanjut Siswa')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A674A] dark:text-[#BA9B81]">Butuh Tindak Lanjut</span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-3">{followUpServices.length}</p>
          <p className="text-[11px] text-[#7A5B40] dark:text-[#A88C76] mt-1">Perlu pendampingan</p>
        </div>

        <div 
          onClick={() => onNavigate('Rekap Hasil Asesmen')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A674A] dark:text-[#BA9B81]">Capaian Asesmen</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-3">
            {siswaList.length > 0 ? Math.round((new Set(results.map(r => r.idSiswa)).size / siswaList.length) * 100) : 0}%
          </p>
          <p className="text-[11px] text-[#7A5B40] dark:text-[#A88C76] mt-1">Partisipasi siswa</p>
        </div>
      </div>

      {/* Counselor Shortcuts Row */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs space-y-4">
        <h2 className="font-extrabold text-sm sm:text-base text-[#4A3525] dark:text-[#F3E9DD]">
          Pintasan Cepat Guru Bimbingan dan Konseling
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onNavigate('Catatan Layanan BK')}
            className="p-3.5 rounded-2xl bg-[#FAF5EE] dark:bg-[#2E2017] hover:bg-[#F2E5D4] border border-[#E8DCCB] dark:border-[#443122] text-left transition-all"
          >
            <Plus className="w-5 h-5 text-[#8B5E3C] mb-2" />
            <p className="font-bold text-xs text-[#4A3525] dark:text-[#F3E9DD]">Tambah Layanan</p>
            <p className="text-[10px] text-[#8C6D53]">Catatan konseling baru</p>
          </button>

          <button
            onClick={() => onNavigate('Hasil Asesmen')}
            className="p-3.5 rounded-2xl bg-[#FAF5EE] dark:bg-[#2E2017] hover:bg-[#F2E5D4] border border-[#E8DCCB] dark:border-[#443122] text-left transition-all"
          >
            <FileCheck2 className="w-5 h-5 text-[#8B5E3C] mb-2" />
            <p className="font-bold text-xs text-[#4A3525] dark:text-[#F3E9DD]">Lihat Asesmen</p>
            <p className="text-[10px] text-[#8C6D53]">Analisis hasil siswa</p>
          </button>

          <button
            onClick={() => onNavigate('Janji Konseling')}
            className="p-3.5 rounded-2xl bg-[#FAF5EE] dark:bg-[#2E2017] hover:bg-[#F2E5D4] border border-[#E8DCCB] dark:border-[#443122] text-left transition-all"
          >
            <CalendarClock className="w-5 h-5 text-[#8B5E3C] mb-2" />
            <p className="font-bold text-xs text-[#4A3525] dark:text-[#F3E9DD]">Janji Konseling</p>
            <p className="text-[10px] text-[#8C6D53]">Konfirmasi jadwal</p>
          </button>

          <button
            onClick={() => onNavigate('Tindak Lanjut Siswa')}
            className="p-3.5 rounded-2xl bg-[#FAF5EE] dark:bg-[#2E2017] hover:bg-[#F2E5D4] border border-[#E8DCCB] dark:border-[#443122] text-left transition-all"
          >
            <AlertCircle className="w-5 h-5 text-[#8B5E3C] mb-2" />
            <p className="font-bold text-xs text-[#4A3525] dark:text-[#F3E9DD]">Tindak Lanjut</p>
            <p className="text-[10px] text-[#8C6D53]">Monitoring evaluasi</p>
          </button>

          <button
            onClick={onOpenRecapFilterModal}
            className="p-3.5 rounded-2xl bg-[#FAF5EE] dark:bg-[#2E2017] hover:bg-[#F2E5D4] border border-[#E8DCCB] dark:border-[#443122] text-left transition-all"
          >
            <Printer className="w-5 h-5 text-[#8B5E3C] mb-2" />
            <p className="font-bold text-xs text-[#4A3525] dark:text-[#F3E9DD]">Cetak Rekap</p>
            <p className="text-[10px] text-[#8C6D53]">Format A4 resmi</p>
          </button>

          <button
            onClick={onOpenRecapFilterModal}
            className="p-3.5 rounded-2xl bg-[#FAF5EE] dark:bg-[#2E2017] hover:bg-[#F2E5D4] border border-[#E8DCCB] dark:border-[#443122] text-left transition-all"
          >
            <Download className="w-5 h-5 text-[#8B5E3C] mb-2" />
            <p className="font-bold text-xs text-[#4A3525] dark:text-[#F3E9DD]">Download Rekap</p>
            <p className="text-[10px] text-[#8C6D53]">Format PDF / CSV</p>
          </button>
        </div>
      </div>

      {/* Appointments & Follow Up Overview Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Appointments */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
            <h3 className="font-extrabold text-sm text-[#4A3525] dark:text-[#F3E9DD] flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-[#8B5E3C]" />
              Permintaan Janji Konseling Terbaru
            </h3>
            <button
              onClick={() => onNavigate('Janji Konseling')}
              className="text-xs font-semibold text-[#8B5E3C] hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto">
            {pendingAppointments.length === 0 ? (
              <p className="text-xs text-[#8A674A] py-6 text-center">Tidak ada janji menunggu konfirmasi.</p>
            ) : (
              pendingAppointments.slice(0, 4).map(a => (
                <div key={a.id} className="p-3.5 rounded-2xl bg-[#FAF5EE] dark:bg-[#2E2017] border border-[#E8DCCB] dark:border-[#443122] flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#4A3525] dark:text-[#F3E9DD]">{a.namaSiswa} ({a.kelasSiswa})</p>
                    <p className="text-[11px] text-[#8C6D53]">{a.tanggal} • {a.waktu}</p>
                    <p className="text-[11px] text-[#70543E] line-clamp-1 italic mt-0.5">"{a.alasan}"</p>
                  </div>
                  <button
                    onClick={() => onNavigate('Janji Konseling')}
                    className="px-3 py-1.5 rounded-xl bg-[#8B5E3C] text-white text-[11px] font-bold shrink-0 hover:bg-[#724B2E]"
                  >
                    Respon
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Priority Follow-ups */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
            <h3 className="font-extrabold text-sm text-[#4A3525] dark:text-[#F3E9DD] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              Siswa Butuh Tindak Lanjut Prioritas
            </h3>
            <button
              onClick={() => onNavigate('Tindak Lanjut Siswa')}
              className="text-xs font-semibold text-[#8B5E3C] hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto">
            {followUpServices.length === 0 ? (
              <p className="text-xs text-[#8A674A] py-6 text-center">Seluruh tindak lanjut telah terselesaikan.</p>
            ) : (
              followUpServices.slice(0, 4).map(s => (
                <div key={s.id} className="p-3.5 rounded-2xl bg-[#FAF5EE] dark:bg-[#2E2017] border border-[#E8DCCB] dark:border-[#443122] flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#4A3525] dark:text-[#F3E9DD]">{s.namaSiswa} ({s.kelasSiswa})</p>
                    <p className="text-[11px] text-[#8C6D53]">{s.jenisLayanan} • Target: {s.tanggalTindakLanjut || '-'}</p>
                    <p className="text-[11px] text-[#70543E] line-clamp-1 italic mt-0.5">Rencana: {s.rencanaTindakLanjut}</p>
                  </div>
                  <button
                    onClick={() => onNavigate('Tindak Lanjut Siswa')}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-[11px] font-bold shrink-0 hover:bg-rose-700"
                  >
                    Tindak Lanjut
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
