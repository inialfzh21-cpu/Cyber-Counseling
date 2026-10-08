import React, { useState } from 'react';
import { 
  Sparkles, 
  FileCheck2, 
  MessageSquare, 
  CalendarClock, 
  BookHeart, 
  CheckSquare, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  AlertCircle, 
  ArrowRight, 
  TrendingUp, 
  Heart,
  Smile,
  Compass,
  Lightbulb,
  ShieldCheck,
  Sparkle,
  Quote,
  Target,
  RefreshCw,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../lib/storage';
import { Breadcrumb } from '../common/Breadcrumb';
import { MoodType } from '../../types';

interface SiswaDashboardProps {
  onNavigate: (menu: string) => void;
}

export const SiswaDashboard: React.FC<SiswaDashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  if (!currentUser) return null;

  const results = storage.getResultsBySiswa(currentUser.id);
  const appointments = storage.getAppointments().filter(a => a.idSiswa === currentUser.id);
  const diaryList = storage.getDiary(currentUser.id);
  const todos = storage.getTodos(currentUser.id);
  const allUsers = storage.getUsersByGroup();
  const counselors = allUsers.filter(u => u.role === 'guru_bk');

  const nearestAppointment = appointments.find(a => a.status === 'Disetujui' || a.status === 'Menunggu konfirmasi');
  const recentDiary = diaryList[0];
  const pendingTodos = todos.filter(t => t.status === 'belum');

  // Interactive Mood Check-in State
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [moodNote, setMoodNote] = useState<string>('');

  // Daily Affirmations State
  const [quoteIdx, setQuoteIdx] = useState(0);
  const studentQuotes = [
    {
      text: "Fokus pada progres kecil setiap hari, bukan kesempurnaan instan. Kamu lebih hebat dari yang kamu kira!",
      tag: "Motivasi Belajar"
    },
    {
      text: "Istirahat sejenak bukanlah menyerah. Mengambil jeda bernapas adalah bentuk persiapan untuk melangkah lebih jauh.",
      tag: "Kesehatan Mental"
    },
    {
      text: "Jangan takut salah saat belajar. Kesalahan adalah bukti nyata bahwa kamu sedang berjuang mencoba hal baru.",
      tag: "Keberanian Diri"
    },
    {
      text: "Masa depanmu diciptakan oleh apa yang kamu kerjakan hari ini dengan penuh kesungguhan dan ketulusan hati.",
      tag: "Perencanaan Karier"
    }
  ];

  // Check 4 aspects completion from results
  const completedAspects = {
    Pribadi: results.some(r => r.aspekBK === 'Pribadi'),
    Sosial: results.some(r => r.aspekBK === 'Sosial'),
    Belajar: results.some(r => r.aspekBK === 'Belajar'),
    Karier: results.some(r => r.aspekBK === 'Karier'),
  };

  const handleToggleTodo = (id: string) => {
    const target = todos.find(t => t.id === id);
    if (target) {
      storage.saveTodo({
        ...target,
        status: target.status === 'belum' ? 'selesai' : 'belum'
      });
      showToast('Status tugas berhasil diperbarui.', 'info');
    }
  };

  const handleSelectMood = (mood: MoodType) => {
    setSelectedMood(mood);
    if (mood === 'Senang' || mood === 'Tenang' || mood === 'Bersemangat') {
      setMoodNote('Alhamdulillah! Energi positifmu luar biasa hari ini. Pertahankan semangat belajarmu ya!');
    } else if (mood === 'Marah') {
      setMoodNote('Wajar jika merasa kesal. Tarik napas perlahan di Ruang Refleksi agar pikiranmu lebih jernih.');
    } else if (mood === 'Cemas' || mood === 'Sedih') {
      setMoodNote('Tidak apa-apa merasa lelah atau cemas hari ini. Tarik napas perlahan di Ruang Refleksi, dan jangan ragu bercerita ke Guru BK.');
    }
  };

  const handleSaveMoodToDiary = () => {
    if (!selectedMood) return;
    storage.saveDiary({
      id: `diary_${Date.now()}`,
      idSiswa: currentUser.id,
      judul: `Refleksi Suasana Hati: ${selectedMood}`,
      isi: `Hari ini saya merasa ${selectedMood}. ${moodNote}`,
      kondisiPerasaan: moodNote || selectedMood,
      mood: selectedMood,
      tanggal: new Date().toISOString(),
      groupCode: currentUser.groupCode || storage.getActiveGroupCode()
    });
    showToast('Suasana hatimu berhasil disimpan ke Jurnal Diary!', 'success');
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard Siswa' }]} />

      {/* Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2C1D13] via-[#482F1D] to-[#6A4728] border border-[#C5A059]/40 text-white p-6 sm:p-8 shadow-xl shadow-[#2C1D13]/25">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src={currentUser.fotoProfil || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.nama}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#C5A059] shadow-lg shrink-0"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold mb-2 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-[#EAD0A0]" />
                <span className="text-[#F5E6CC]">Selamat Datang Kembali</span>
              </div>
              <h1 className="font-editorial text-2xl sm:text-4xl font-bold tracking-tight text-[#FAF3EB]">
                Halo, {currentUser.nama}!
              </h1>
              <p className="text-xs sm:text-sm text-[#DFCFBE] mt-1">
                Kelas: <span className="font-bold text-white">{currentUser.kelas || '-'}</span> • Ruang Aman Cyber-Counseling Siap Membantu Perkembanganmu.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('Refleksi Siswa')}
              className="px-4 py-2.5 rounded-xl bg-white text-[#5C3B1E] font-bold text-xs sm:text-sm hover:bg-[#FDF9F5] transition-all shadow-md flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-[#8B5E3C]" />
              <span>Ruang Refleksi Diri</span>
            </button>
            <button
              onClick={() => onNavigate('Asesmen BK')}
              className="px-4 py-2.5 rounded-xl bg-[#FAF5EE]/20 hover:bg-[#FAF5EE]/30 text-white font-semibold text-xs sm:text-sm border border-white/30 backdrop-blur-xs transition-all flex items-center gap-1.5"
            >
              <FileCheck2 className="w-4 h-4 text-[#EAD0A0]" />
              <span>Asesmen BK</span>
            </button>
          </div>
        </div>

        {/* Ambient decorative circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* NEW ELEMENT: Interactive Daily Affirmation & Student Wisdom */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#F5ECE0] dark:bg-[#251A13] border border-[#DECBB8] dark:border-[#3E2B1E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FAF4ED] dark:bg-[#342419] text-[#8C5D38] dark:text-[#E2C7B0] flex items-center justify-center border border-[#DECBB8] dark:border-[#4A3423] shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4 text-[#C5A059]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5D38] dark:text-[#C5A059]">
                {studentQuotes[quoteIdx].tag}
              </span>
              <span className="text-[11px] text-[#A28269]">• Afirmasi Pelajar Hari Ini</span>
            </div>
            <p className="font-editorial text-sm sm:text-base italic font-semibold text-[#3C2718] dark:text-[#FAF3EB] leading-snug">
              "{studentQuotes[quoteIdx].text}"
            </p>
          </div>
        </div>

        <button
          onClick={() => setQuoteIdx((prev) => (prev + 1) % studentQuotes.length)}
          className="self-end sm:self-center p-2 rounded-xl text-[#7A5B42] hover:text-[#3C2718] dark:text-[#C5A893] hover:bg-[#EFE3D5] dark:hover:bg-[#302117] transition-colors shrink-0"
          title="Ganti Afirmasi"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('Asesmen BK')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A674A] dark:text-[#BA9B81]">Status Asesmen</span>
            <div className="w-9 h-9 rounded-xl bg-[#F4EBE1] dark:bg-[#342419] text-[#8B5E3C] flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#4A3525] dark:text-[#F3E9DD] mt-3">
            {results.length}
          </p>
          <p className="text-[11px] text-[#7A5B40] dark:text-[#A88C76] mt-1 flex items-center gap-1">
            <span>Asesmen diselesaikan</span>
          </p>
        </div>

        <div 
          onClick={() => onNavigate('Janji Konseling')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A674A] dark:text-[#BA9B81]">Janji Konseling</span>
            <div className="w-9 h-9 rounded-xl bg-[#F4EBE1] dark:bg-[#342419] text-[#8B5E3C] flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#4A3525] dark:text-[#F3E9DD] mt-3">
            {appointments.length}
          </p>
          <p className="text-[11px] text-[#7A5B40] dark:text-[#A88C76] mt-1">
            {nearestAppointment ? nearestAppointment.status : 'Belum ada jadwal'}
          </p>
        </div>

        <div 
          onClick={() => onNavigate('Diary / Self Journal')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A674A] dark:text-[#BA9B81]">Jurnal Pribadi</span>
            <div className="w-9 h-9 rounded-xl bg-[#F4EBE1] dark:bg-[#342419] text-[#8B5E3C] flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookHeart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#4A3525] dark:text-[#F3E9DD] mt-3">
            {diaryList.length}
          </p>
          <p className="text-[11px] text-[#7A5B40] dark:text-[#A88C76] mt-1">
            Catatan diary tersimpan
          </p>
        </div>

        <div 
          onClick={() => onNavigate('To-Do List')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A674A] dark:text-[#BA9B81]">To-Do List</span>
            <div className="w-9 h-9 rounded-xl bg-[#F4EBE1] dark:bg-[#342419] text-[#8B5E3C] flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#4A3525] dark:text-[#F3E9DD] mt-3">
            {pendingTodos.length}
          </p>
          <p className="text-[11px] text-[#7A5B40] dark:text-[#A88C76] mt-1">
            Tugas belum selesai
          </p>
        </div>
      </div>

      {/* NEW ELEMENT: Quick Mood Check-In Widget */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#EFE8DF] dark:border-[#35261C]">
          <div className="flex items-center gap-2.5">
            <Smile className="w-5 h-5 text-[#C5A059]" />
            <div>
              <h2 className="font-bold text-sm sm:text-base text-[#3E2718] dark:text-[#FAF3EB]">
                Bagaimana Perasaan & Suasana Hatimu Hari Ini?
              </h2>
              <p className="text-xs text-[#8C6D53] dark:text-[#B1937B]">
                Pilih emosi yang paling mewakili dirimu saat ini untuk refleksi sejenak.
              </p>
            </div>
          </div>
          {selectedMood && (
            <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-[#FAF4ED] dark:bg-[#32231A] text-[#8C5D38] border border-[#DFCBB5] dark:border-[#4B3728]">
              Mood: {selectedMood}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mt-4">
          {[
            { label: 'Senang' as MoodType, icon: '😊' },
            { label: 'Tenang' as MoodType, icon: '😌' },
            { label: 'Bersemangat' as MoodType, icon: '⚡' },
            { label: 'Cemas' as MoodType, icon: '😰' },
            { label: 'Sedih' as MoodType, icon: '😔' },
            { label: 'Marah' as MoodType, icon: '😤' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => handleSelectMood(item.label)}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all text-center ${
                selectedMood === item.label
                  ? 'bg-[#F9F3EA] dark:bg-[#382619] border-[#C5A059] shadow-xs scale-102 ring-1 ring-[#C5A059]'
                  : 'bg-[#FAF7F2] dark:bg-[#2B1E16] border-[#E8DEC8] dark:border-[#3A281C] hover:bg-white dark:hover:bg-[#342419]'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-semibold text-[#4A3222] dark:text-[#F3E9DD]">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {selectedMood && (
          <div className="mt-4 p-4 rounded-2xl bg-[#FAF5EE] dark:bg-[#2C1F16] border border-[#E8DEC8] dark:border-[#3E2D20] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
            <p className="text-xs text-[#5C3F2B] dark:text-[#DFC6B2] leading-relaxed">
              💡 <strong>Catatan Konseling:</strong> {moodNote}
            </p>
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={handleSaveMoodToDiary}
                className="px-3.5 py-1.5 rounded-xl bg-[#3A2416] hover:bg-[#523420] text-white text-xs font-bold transition-all shadow-xs"
              >
                Simpan ke Diary
              </button>
              {(selectedMood === 'Cemas' || selectedMood === 'Sedih' || selectedMood === 'Marah') && (
                <button
                  onClick={() => onNavigate('Refleksi Siswa')}
                  className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#36261C] border border-[#DECBB8] text-[#5C3B1E] dark:text-[#ECC9AC] text-xs font-bold hover:bg-[#FAF4EC] transition-all"
                >
                  Latihan Napas
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* NEW ELEMENT: 4 Aspects Assessment Progress Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DF] dark:border-[#35261C]">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#C5A059]" />
            <h2 className="font-bold text-sm sm:text-base text-[#3E2718] dark:text-[#FAF3EB]">
              Capaian 4 Bidang Bimbingan & Konseling
            </h2>
          </div>
          <button
            onClick={() => onNavigate('Asesmen BK')}
            className="text-xs font-bold text-[#8C5D38] dark:text-[#E2C7B0] hover:underline flex items-center gap-1"
          >
            <span>Mulai Asesmen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
          {[
            { name: 'Pribadi', completed: completedAspects.Pribadi, desc: 'Pemahaman emosi & konsep diri' },
            { name: 'Sosial', completed: completedAspects.Sosial, desc: 'Relasi pertemanan & komunikasi' },
            { name: 'Belajar', completed: completedAspects.Belajar, desc: 'Manajemen waktu & gaya belajar' },
            { name: 'Karier', completed: completedAspects.Karier, desc: 'Minat bakat & rencana masa depan' },
          ].map((asp) => (
            <div
              key={asp.name}
              className={`p-3.5 rounded-2xl border transition-all ${
                asp.completed
                  ? 'bg-[#F2FAF4] dark:bg-[#192F21] border-[#C2E7CE] dark:border-[#285739]'
                  : 'bg-[#FAF7F2] dark:bg-[#2A1E16] border-[#E8DEC8] dark:border-[#3C291E]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-[#3E2718] dark:text-[#FAF3EB]">
                  Aspek {asp.name}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  asp.completed
                    ? 'bg-emerald-200/80 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200'
                }`}>
                  {asp.completed ? 'Terisi' : 'Belum Terisi'}
                </span>
              </div>
              <p className="text-[11px] text-[#7A5E47] dark:text-[#B69982] leading-tight">
                {asp.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Sections: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Nearest Appointment, Recent Diary & Counselor On Duty */}
        <div className="lg:col-span-2 space-y-6">
          {/* Nearest Appointment Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
              <div className="flex items-center gap-2.5">
                <CalendarClock className="w-5 h-5 text-[#8B5E3C]" />
                <h2 className="font-bold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                  Janji Konseling Terdekat
                </h2>
              </div>
              <button
                onClick={() => onNavigate('Janji Konseling')}
                className="text-xs font-semibold text-[#8B5E3C] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {nearestAppointment ? (
              <div className="mt-4 p-4 rounded-xl bg-[#FAF5EE] dark:bg-[#2E2017] border border-[#E8DCCB] dark:border-[#443122]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#4A3525] dark:text-[#F3E9DD]">
                      Guru BK: {nearestAppointment.namaGuru}
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    nearestAppointment.status === 'Disetujui'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                  }`}>
                    {nearestAppointment.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#70533C] dark:text-[#BCA089]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    {nearestAppointment.tanggal}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    {nearestAppointment.waktu}
                  </span>
                </div>

                <p className="mt-3 text-xs text-[#523C2B] dark:text-[#D5BCA9] bg-white dark:bg-[#251B13] p-3 rounded-lg border border-[#EADCCB] dark:border-[#402E20]">
                  <strong>Topik:</strong> {nearestAppointment.alasan}
                </p>

                {nearestAppointment.catatan && (
                  <p className="mt-2 text-xs text-[#2D6A4F] bg-[#EBF7EE] dark:bg-[#1E3A2B] p-2.5 rounded-lg border border-[#B7E4C7] dark:border-[#2D6A4F]">
                    <strong>Catatan Guru:</strong> {nearestAppointment.catatan}
                  </p>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#8A674A] dark:text-[#A88C76]">
                Belum ada jadwal konseling yang aktif.{' '}
                <button
                  onClick={() => onNavigate('Janji Konseling')}
                  className="text-[#8B5E3C] font-bold hover:underline"
                >
                  Ajukan janji temu sekarang
                </button>
              </div>
            )}
          </div>

          {/* Recent Diary Activity */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
              <div className="flex items-center gap-2.5">
                <BookHeart className="w-5 h-5 text-[#8B5E3C]" />
                <h2 className="font-bold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                  Aktivitas Diary Terbaru
                </h2>
              </div>
              <button
                onClick={() => onNavigate('Diary / Self Journal')}
                className="text-xs font-semibold text-[#8B5E3C] hover:underline flex items-center gap-1"
              >
                <span>Buka Jurnal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentDiary ? (
              <div className="mt-4 p-4 rounded-xl bg-[#FAF5EE] dark:bg-[#2E2017] border border-[#E8DCCB] dark:border-[#443122]">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#4A3525] dark:text-[#F3E9DD]">
                    {recentDiary.judul}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EFE3D5] text-[#6A4728] dark:bg-[#382619] dark:text-[#ECC9AC]">
                    Mood: {recentDiary.mood}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#70533C] dark:text-[#BCA089] line-clamp-3 leading-relaxed">
                  "{recentDiary.isi}"
                </p>
                <p className="mt-2 text-[10px] text-[#9A7D66]">
                  {new Date(recentDiary.tanggal).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                </p>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#8A674A] dark:text-[#A88C76]">
                Kamu belum menulis jurnal hari ini.{' '}
                <button
                  onClick={() => onNavigate('Diary / Self Journal')}
                  className="text-[#8B5E3C] font-bold hover:underline"
                >
                  Tulis isi hatimu sekarang
                </button>
              </div>
            )}
          </div>

          {/* Counselors On Duty / Available List */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-[#C5A059]" />
                <h2 className="font-bold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                  Konselor BK Sekolah yang Siap Melayani
                </h2>
              </div>
              <button
                onClick={() => onNavigate('Room Chat Konseling')}
                className="text-xs font-semibold text-[#8B5E3C] hover:underline"
              >
                Mulai Chat
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {counselors.map(c => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2B1D15] border border-[#EADCCB] dark:border-[#3C291E] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={c.fotoProfil || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'}
                      alt={c.nama}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#C5A059]/40 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-[#3E2718] dark:text-[#FAF3EB] truncate">
                        {c.nama}
                      </p>
                      <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Siap Konseling
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('Room Chat Konseling')}
                    className="p-2 rounded-lg bg-white dark:bg-[#382619] text-[#8C5D38] dark:text-[#E2C7B0] hover:bg-[#F2E5D5] transition-all border border-[#DFCBB5] dark:border-[#4A3423] shrink-0"
                    title="Kirim pesan"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Today's To-Do List & Quick Shortcuts */}
        <div className="space-y-6">
          {/* Today's To-Do List */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#8B5E3C]" />
                <h2 className="font-bold text-sm text-[#4A3525] dark:text-[#F3E9DD]">
                  To-Do List Siswa
                </h2>
              </div>
              <button
                onClick={() => onNavigate('To-Do List')}
                className="text-xs font-semibold text-[#8B5E3C] hover:underline"
              >
                Kelola
              </button>
            </div>

            <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
              {todos.length === 0 ? (
                <p className="text-xs text-[#8A674A] text-center py-4">Belum ada tugas tercatat.</p>
              ) : (
                todos.slice(0, 5).map(todo => (
                  <div
                    key={todo.id}
                    onClick={() => handleToggleTodo(todo.id)}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-[#FAF4ED] dark:hover:bg-[#2E2017] cursor-pointer transition-colors border border-transparent hover:border-[#E8DEC8] dark:hover:border-[#3E2D20]"
                  >
                    <input
                      type="checkbox"
                      checked={todo.status === 'selesai'}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-[#8B5E3C] focus:ring-[#8B5E3C] accent-[#8B5E3C]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium leading-snug truncate ${
                        todo.status === 'selesai'
                          ? 'line-through text-stone-400 dark:text-stone-500'
                          : 'text-[#4A3525] dark:text-[#F3E9DD]'
                      }`}>
                        {todo.kegiatan}
                      </p>
                      <p className="text-[10px] text-[#9A7D66]">
                        {todo.waktu || 'Hari ini'} • {todo.prioritas}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#FAF5EE] to-[#EFE3D5] dark:from-[#2B1E16] dark:to-[#1F150E] border border-[#E5DAC8] dark:border-[#3E2D20]">
            <h3 className="font-bold text-sm text-[#4A3525] dark:text-[#F3E9DD] mb-3">
              Pintasan Menu
            </h3>
            <div className="space-y-2 text-xs font-semibold">
              <button
                onClick={() => onNavigate('Asesmen BK')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#342419] text-[#6A4728] dark:text-[#ECC9AC] hover:bg-[#F7EFE6] transition-all shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-[#8B5E3C]" />
                  Kerjakan Asesmen Masalah
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                onClick={() => onNavigate('Refleksi Siswa')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#342419] text-[#6A4728] dark:text-[#ECC9AC] hover:bg-[#F7EFE6] transition-all shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#8B5E3C]" />
                  Latihan Napas & Audio Santai
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                onClick={() => onNavigate('Room Chat Konseling')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#342419] text-[#6A4728] dark:text-[#ECC9AC] hover:bg-[#F7EFE6] transition-all shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#8B5E3C]" />
                  Chat Langsung dengan Guru BK
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>
            </div>
          </div>

          {/* Quick Study Wellness Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] text-xs text-[#6E5039] dark:text-[#BCA088] space-y-2">
            <p className="font-bold text-[#3E2718] dark:text-[#FAF3EB] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Jaminan Ruang Aman
            </p>
            <p className="text-[11px] leading-relaxed">
              Semua cerita, asesmen, dan obrolanmu dengan Guru BK dijamin kerahasiaannya sesuai kode etik bimbingan konseling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
