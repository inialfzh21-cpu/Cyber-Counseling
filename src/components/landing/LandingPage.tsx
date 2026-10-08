import React, { useState } from 'react';
import { 
  HeartHandshake, 
  FileCheck2, 
  Sparkles, 
  MessageSquare, 
  CalendarClock, 
  BookHeart, 
  CheckSquare, 
  FolderKanban, 
  ShieldCheck, 
  ArrowRight,
  School,
  Lock,
  Award,
  ChevronDown,
  ChevronUp,
  Quote,
  Clock,
  CheckCircle2,
  Users,
  Compass,
  GraduationCap,
  Smile,
  Heart,
  HelpCircle,
  TrendingUp,
  ShieldAlert,
  Sparkle
} from 'lucide-react';
import { storage } from '../../lib/storage';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: (roleTab?: 'siswa' | 'guru') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister
}) => {
  const settings = storage.getSettings();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeTabPreview, setActiveTabPreview] = useState<'siswa' | 'guru' | 'admin'>('siswa');
  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0);

  const quotes = [
    {
      text: "Mengenal diri sendiri adalah awal dari semua kebijaksanaan dan kunci memilih jalan masa depan.",
      author: "Aristoteles",
      tag: "Pengembangan Diri"
    },
    {
      text: "Setiap kesulitan yang kamu hadapi hari ini adalah proses pembentukan kekuatan mental untuk hari esok.",
      author: "Pesan Konselor BK",
      tag: "Resiliensi Siswa"
    },
    {
      text: "Bercerita dan meminta bantuan bukanlah tanda kelemahan, melainkan bukti keberanian untuk merawat diri.",
      author: "Prinsip Konseling",
      tag: "Kesehatan Mental"
    },
    {
      text: "Pendidikan bukan sekadar mengisi wadah, melainkan menyalakan api rasa ingin tahu dan kepercayaan diri.",
      author: "Ki Hajar Dewantara",
      tag: "Inspirasi Belajar"
    }
  ];

  const features = [
    {
      num: '01',
      title: 'Asesmen BK Komprehensif',
      desc: 'Instrumen DCM (Daftar Cek Masalah), AUM (Alat Ungkap Masalah), dan Sosiometri pada 4 aspek perkembangan: Pribadi, Sosial, Belajar, dan Karier.',
      icon: FileCheck2
    },
    {
      num: '02',
      title: 'Ruang Refleksi & Ketenangan',
      desc: 'Latihan pernapasan terpandu dengan timer ritmis, dzikir harian, tadabbur ayat Al-Qur\'an, mini-games antistres, dan relaksasi audio alam.',
      icon: Sparkles
    },
    {
      num: '03',
      title: 'Room Chat Konseling Privat',
      desc: 'Komunikasi dua arah antara Siswa dan Guru BK dengan enkripsi privasi, status pesan waktu nyata, serta rekam dialog yang terjaga kerahasiaannya.',
      icon: MessageSquare
    },
    {
      num: '04',
      title: 'Janji Konseling Terjadwal',
      desc: 'Pengajuan jadwal tatap muka atau konsultasi daring dengan pemilihan konselor, slot waktu fleksibel, dan konfirmasi status instan.',
      icon: CalendarClock
    },
    {
      num: '05',
      title: 'Self-Journal / Diary Siswa',
      desc: 'Buku harian digital berpassword pribadi untuk mencatat suasana hati (mood tracker), evaluasi diri, dan perkembangan emosional berkala.',
      icon: BookHeart
    },
    {
      num: '06',
      title: 'To-Do List & Manajemen Waktu',
      desc: 'Pengorganisasian tugas akademik dan agenda harian dengan penentuan prioritas guna membangun kemandirian serta kedisiplinan belajar.',
      icon: CheckSquare
    },
    {
      num: '07',
      title: 'Manajemen BK & Arsip Resmi',
      desc: 'Program kerja tahunan, catatan layanan, rencana tindak lanjut, cetak & download berkas PDF berlisensi resmi Guru BK, serta ekspor format Spreadsheet (.CSV) mandiri.',
      icon: FolderKanban,
      fullWidth: true
    }
  ];

  const faqs = [
    {
      q: 'Apakah percakapan konseling dan data masalah saya dijamin rahasia?',
      a: 'Sangat terjamin. CYBER-COUNSELING menerapkan asas kerahasiaan konseling profesional (Kode Etik Bimbingan & Konseling). Catatan chat dan hasil asesmen individual hanya dapat diakses oleh Siswa yang bersangkutan dan Guru BK pembimbing. Siswa lain tidak dapat mengakses data Anda.'
    },
    {
      q: 'Apa perbedaan instrumen DCM, AUM, dan Sosiometri?',
      a: 'DCM (Daftar Cek Masalah) membantu memetakan keluhan di bidang pribadi, sosial, belajar, dan karier. AUM (Alat Ungkap Masalah) mendalami intensitas beban masalah individual, sedangkan Sosiometri mengukur dinamika relasi dan penerimaan sosial dalam kelas.'
    },
    {
      q: 'Apakah saya bisa mengajukan janji konseling tatap muka secara langsung?',
      a: 'Bisa. Fitur Janji Konseling memungkinkan Anda memilih Guru BK yang diinginkan, menentukan tanggal dan jam yang cocok, serta mencantumkan topik bahasan agar Guru BK dapat mempersiapkan sesi tatap muka dengan optimal.'
    },
    {
      q: 'Apakah fitur Refleksi Siswa bisa diakses sewaktu-waktu saat merasa stres?',
      a: 'Ya, ruang refleksi dirancang untuk diakses kapan saja tanpa batasan. Anda dapat memanfaatkan panduan latihan pernapasan ritmis, audio alam menenangkan, dzikir, ayat Al-Qur\'an, maupun mini games santai untuk meredakan kecemasan dan stres belajar.'
    },
    {
      q: 'Bagaimana peran akun Admin dalam sistem ini?',
      a: 'Admin bertugas mengelola infrastruktur teknis sekolah: akun pengguna, bank instrumen asesmen, dan pencadangan basis data mandiri. Admin tidak memiliki wewenang untuk mencetak atau mengunduh hasil asesmen individual siswa.'
    }
  ];

  const alurLayanan = [
    {
      step: '01',
      title: 'Registrasi & Eksplorasi',
      desc: 'Siswa masuk ke portal aman dan mengisi asesmen diagnostik (DCM, AUM, atau Sosiometri) sesuai kebutuhan perkembangannya.',
      icon: Users
    },
    {
      step: '02',
      title: 'Pemetaan & Refleksi',
      desc: 'Siswa melihat profil hasil analisis kebutuhan, menulis diary reflektif, serta menggunakan fitur relaksasi untuk menjaga kestabilan emosi.',
      icon: Compass
    },
    {
      step: '03',
      title: 'Konseling Interaktif',
      desc: 'Jika memerlukan pendampingan lebih lanjut, siswa membuka room chat privat atau menjadwalkan janji konseling tatap muka dengan Guru BK.',
      icon: HeartHandshake
    },
    {
      step: '04',
      title: 'Solusi & Tindak Lanjut',
      desc: 'Guru BK mendampingi penetapan rencana aksi, memantau kemajuan belajar, dan mencatat administrasi tindak lanjut secara profesional.',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#18110C] text-[#2D1F16] dark:text-[#F3E9DD] transition-colors selection:bg-[#C5A059]/20 selection:text-[#3C2719]">
      {/* Top Luxury Navigation */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 dark:bg-[#18110C]/90 backdrop-blur-md border-b border-[#EAE0D2] dark:border-[#382619]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4A2E1B] via-[#6B442A] to-[#8F5D38] flex items-center justify-center text-white shadow-md shadow-[#4A2E1B]/20 ring-1 ring-[#C5A059]/30">
              <HeartHandshake className="w-5 h-5 text-[#F9EFE6]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#3A2416] dark:text-[#F7EFE6]">
                  CYBER-COUNSELING
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full bg-[#EFE4D3] dark:bg-[#342419] text-[#7A5333] dark:text-[#D5B597] border border-[#DECDB9] dark:border-[#4A3525]">
                  Media Pendukung BK
                </span>
              </div>
              <p className="text-[11px] text-[#856347] dark:text-[#B6977D] hidden sm:block font-medium">
                Media Pendukung Layanan Bimbingan dan Konseling
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#573A25] dark:text-[#E2C7B0] hover:bg-[#EFE4D3] dark:hover:bg-[#2C1E14] border border-transparent hover:border-[#DFCBB5] dark:hover:border-[#4A3525] transition-all"
            >
              Masuk
            </button>
            <button
              onClick={() => onOpenRegister('siswa')}
              className="px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#3A2416] hover:bg-[#523420] text-[#F9F5EC] border border-[#C5A059]/40 shadow-sm shadow-[#3A2416]/20 transition-all flex items-center gap-1.5 hover:-translate-y-0.5"
            >
              <span>Daftar Akun</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
        {/* Soft elegant warm ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] bg-gradient-to-tr from-[#E6D4BE]/30 via-[#DFCBB3]/20 to-transparent blur-3xl -z-10 rounded-full" />
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#C5A059]/5 blur-3xl -z-10 rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Institutional Crest Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFFFF]/85 dark:bg-[#241912]/85 backdrop-blur-xs text-[#5C3B21] dark:text-[#E5CCA8] text-xs font-semibold mb-6 shadow-sm border border-[#E5D7C5] dark:border-[#443122]">
            <School className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="tracking-wide">{settings.namaSekolah}</span>
            <span className="w-1 h-1 rounded-full bg-[#C5A059]"></span>
            <span className="text-[11px] font-normal text-[#8A674B] dark:text-[#BCA087]">Portal Resmi BK</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold text-[#2E1E14] dark:text-[#F8EFE4] tracking-tight leading-[1.12]">
            CYBER-COUNSELING
          </h1>

          <p className="mt-3 text-lg sm:text-2xl font-serif italic text-[#725137] dark:text-[#D5B89F]">
            Media Pendukung Layanan Bimbingan dan Konseling
          </p>

          <p className="mt-6 text-sm sm:text-base text-[#684C34] dark:text-[#BA9E85] max-w-2xl mx-auto leading-relaxed font-normal">
            Platform bimbingan konseling digital yang elegan, terstruktur, dan aman. Memfasilitasi pemahaman potensi diri, asesmen kebutuhan siswa, penjadwalan konseling profesional, serta tata kelola administrasi BK secara terpadu.
          </p>

          {/* Call to Actions */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onOpenLogin}
              className="px-7 py-3.5 rounded-2xl text-sm font-bold bg-[#362316] hover:bg-[#4E331F] text-[#FAF5EC] transition-all shadow-lg shadow-[#362316]/25 border border-[#C5A059]/50 flex items-center gap-2 hover:-translate-y-0.5"
            >
              <span>Masuk ke Portal Layanan</span>
              <ArrowRight className="w-4 h-4 text-[#C5A059]" />
            </button>
            <button
              onClick={() => onOpenRegister('siswa')}
              className="px-6 py-3.5 rounded-2xl text-sm font-semibold bg-[#FFFFFF] dark:bg-[#251A13] hover:bg-[#FAF4EC] dark:hover:bg-[#2F2117] text-[#422C1C] dark:text-[#EFE2D4] border border-[#DECBB8] dark:border-[#483324] transition-all shadow-xs hover:-translate-y-0.5"
            >
              <span>Registrasi Siswa</span>
            </button>
            <button
              onClick={() => onOpenRegister('guru')}
              className="px-6 py-3.5 rounded-2xl text-sm font-semibold bg-[#FFFFFF] dark:bg-[#251A13] hover:bg-[#FAF4EC] dark:hover:bg-[#2F2117] text-[#422C1C] dark:text-[#EFE2D4] border border-[#DECBB8] dark:border-[#483324] transition-all shadow-xs hover:-translate-y-0.5"
            >
              <span>Registrasi Guru BK</span>
            </button>
          </div>

          {/* Prestigious Highlights Strip */}
          <div className="mt-12 pt-8 border-t border-[#EAE0D2] dark:border-[#382619] grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
            <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#231811]/70 border border-[#EAE0D2] dark:border-[#3D2C1E] shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#C5A059]"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A5A3C] dark:text-[#C5A893]">4 Aspek</span>
              </div>
              <p className="text-xs font-semibold text-[#2D1F16] dark:text-[#F3E9DD]">Pribadi, Sosial, Belajar & Karier</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#231811]/70 border border-[#EAE0D2] dark:border-[#3D2C1E] shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#C5A059]"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A5A3C] dark:text-[#C5A893]">Instrumen</span>
              </div>
              <p className="text-xs font-semibold text-[#2D1F16] dark:text-[#F3E9DD]">DCM, AUM & Sosiometri</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#231811]/70 border border-[#EAE0D2] dark:border-[#3D2C1E] shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#C5A059]"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A5A3C] dark:text-[#C5A893]">Privasi Terjaga</span>
              </div>
              <p className="text-xs font-semibold text-[#2D1F16] dark:text-[#F3E9DD]">Hak Akses Ketat (RBAC)</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#231811]/70 border border-[#EAE0D2] dark:border-[#3D2C1E] shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#C5A059]"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A5A3C] dark:text-[#C5A893]">Integrasi Data</span>
              </div>
              <p className="text-xs font-semibold text-[#2D1F16] dark:text-[#F3E9DD]">Ekspor Spreadsheet & CSV</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW ELEMENT 1: Interactive Daily Motivation & Wisdom Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-4 mb-16 w-full">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#322115] via-[#482F1D] to-[#603E26] text-white shadow-xl shadow-[#322115]/20 border border-[#C5A059]/40 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-60 h-60 bg-[#C5A059]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center justify-center shrink-0">
                <Quote className="w-6 h-6 text-[#EAD0A0]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C5A059]/25 text-[#F3E1BD] border border-[#C5A059]/40">
                    {quotes[activeQuoteIdx].tag}
                  </span>
                  <span className="text-xs text-stone-300">• Kata Bijak Hari Ini</span>
                </div>
                <p className="font-editorial text-lg sm:text-xl italic font-medium leading-relaxed text-[#FAF5ED]">
                  "{quotes[activeQuoteIdx].text}"
                </p>
                <p className="text-xs text-[#EAD0A0] mt-1 font-semibold">
                  — {quotes[activeQuoteIdx].author}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                onClick={() => setActiveQuoteIdx((prev) => (prev + 1) % quotes.length)}
                className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-xs border border-white/20 transition-all flex items-center gap-1.5"
                title="Ganti Kutipan Inspirasi"
              >
                <Sparkle className="w-3.5 h-3.5 text-[#EAD0A0]" />
                <span>Inspirasi Lainnya</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NEW ELEMENT 2: Interactive Role Feature Preview Cards */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8F5D38] dark:text-[#C5A059]">
            Pengalaman Pengguna
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2D1F16] dark:text-[#F5EDE2] mt-1.5">
            Disesuaikan dengan Peran Anda di Sekolah
          </h2>
          <div className="w-12 h-0.5 bg-[#C5A059] mx-auto mt-3"></div>
          <p className="mt-3 text-sm text-[#73543A] dark:text-[#BA9E86]">
            Jelajahi bagaimana antarmuka dirancang khusus untuk memenuhi kebutuhan masing-masing pengguna secara intuitif.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#EFE4D3] dark:bg-[#251A13] border border-[#DFCBB5] dark:border-[#3D2C1E]">
            <button
              onClick={() => setActiveTabPreview('siswa')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTabPreview === 'siswa'
                  ? 'bg-[#3A2416] text-[#FAF5EC] shadow-sm'
                  : 'text-[#684C35] dark:text-[#C7AB96] hover:text-[#3A2416]'
              }`}
            >
              <Users className="w-4 h-4 text-[#C5A059]" />
              <span>Siswa (Konseli)</span>
            </button>
            <button
              onClick={() => setActiveTabPreview('guru')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTabPreview === 'guru'
                  ? 'bg-[#3A2416] text-[#FAF5EC] shadow-sm'
                  : 'text-[#684C35] dark:text-[#C7AB96] hover:text-[#3A2416]'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#C5A059]" />
              <span>Guru BK (Konselor)</span>
            </button>
            <button
              onClick={() => setActiveTabPreview('admin')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTabPreview === 'admin'
                  ? 'bg-[#3A2416] text-[#FAF5EC] shadow-sm'
                  : 'text-[#684C35] dark:text-[#C7AB96] hover:text-[#3A2416]'
              }`}
            >
              <Lock className="w-4 h-4 text-[#C5A059]" />
              <span>Administrator</span>
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Preview Box */}
        <div className="p-6 sm:p-9 rounded-3xl bg-white dark:bg-[#221610] border border-[#E5DAC8] dark:border-[#3B281B] shadow-sm">
          {activeTabPreview === 'siswa' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FAF2E6] dark:bg-[#2E2017] text-[#7A4E2C] border border-[#E9DAC8] dark:border-[#423022]">
                  Ruang Bertumbuh Ramah Pelajar
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#2D1F16] dark:text-[#F3E9DD]">
                  Eksplorasi Potensi, Atasi Stres & Rencanakan Masa Depan
                </h3>
                <p className="text-xs sm:text-sm text-[#6E5039] dark:text-[#BFA38C] leading-relaxed">
                  Siswa memiliki akses mandiri ke asesmen kebutuhan belajar, panduan relaksasi pernapasan, buku harian perasaan (diary), to-do list harian, serta obrolan privat dengan Guru BK tanpa cemas terhadap penghakiman sosial.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#FAF5EE] dark:bg-[#2A1D15] border border-[#EFE5D8] dark:border-[#3A271C]">
                    <p className="text-xs font-bold text-[#422C1C] dark:text-[#EAE0D3]">✓ Asesmen Mandiri</p>
                    <p className="text-[11px] text-[#8C6D53] dark:text-[#B1937B]">DCM, AUM, Sosiometri otomatis</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF5EE] dark:bg-[#2A1D15] border border-[#EFE5D8] dark:border-[#3A271C]">
                    <p className="text-xs font-bold text-[#422C1C] dark:text-[#EAE0D3]">✓ Audio & Dzikir Menenangkan</p>
                    <p className="text-[11px] text-[#8C6D53] dark:text-[#B1937B]">Relaksasi saat jenuh belajar</p>
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FAF5EE] to-[#EFE3D3] dark:from-[#2B1D14] dark:to-[#1F140D] border border-[#DECBB8] dark:border-[#422F20] text-center">
                <Smile className="w-10 h-10 text-[#C5A059] mx-auto mb-2" />
                <h4 className="font-bold text-sm text-[#3E2717] dark:text-[#F3E9DD]">Daftar Akun Siswa</h4>
                <p className="text-xs text-[#70523C] dark:text-[#BA9E87] mt-1 mb-4">
                  Cukup 1 menit untuk memulai perjalanan konseling digital yang aman.
                </p>
                <button
                  onClick={() => onOpenRegister('siswa')}
                  className="w-full py-2.5 rounded-xl bg-[#3A2416] hover:bg-[#523420] text-white font-bold text-xs shadow-sm transition-all"
                >
                  Registrasi Siswa Sekarang
                </button>
              </div>
            </div>
          )}

          {activeTabPreview === 'guru' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FAF2E6] dark:bg-[#2E2017] text-[#7A4E2C] border border-[#E9DAC8] dark:border-[#423022]">
                  Pusat Kendali Bimbingan & Konseling
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#2D1F16] dark:text-[#F3E9DD]">
                  Diagnostik Terpadu, Cetak Dokumen Resmi & Rekap Tindak Lanjut
                </h3>
                <p className="text-xs sm:text-sm text-[#6E5039] dark:text-[#BFA38C] leading-relaxed">
                  Guru BK memiliki hak khusus untuk melihat rekapitulasi masalah per kelas, mencetak dokumen formal (Format Cetak Standar BK), membalas room chat konseling, mengonfirmasi jadwal janji temu, dan mengelola arsip layanan.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#FAF5EE] dark:bg-[#2A1D15] border border-[#EFE5D8] dark:border-[#3A271C]">
                    <p className="text-xs font-bold text-[#422C1C] dark:text-[#EAE0D3]">✓ Cetak PDF & Ekspor CSV</p>
                    <p className="text-[11px] text-[#8C6D53] dark:text-[#B1937B]">Hanya dapat diakses Guru BK</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF5EE] dark:bg-[#2A1D15] border border-[#EFE5D8] dark:border-[#3A271C]">
                    <p className="text-xs font-bold text-[#422C1C] dark:text-[#EAE0D3]">✓ Notifikasi Pesan Realtime</p>
                    <p className="text-[11px] text-[#8C6D53] dark:text-[#B1937B]">Respon cepat kebutuhan konseli</p>
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FAF5EE] to-[#EFE3D3] dark:from-[#2B1D14] dark:to-[#1F140D] border border-[#DECBB8] dark:border-[#422F20] text-center">
                <GraduationCap className="w-10 h-10 text-[#C5A059] mx-auto mb-2" />
                <h4 className="font-bold text-sm text-[#3E2717] dark:text-[#F3E9DD]">Portal Guru BK</h4>
                <p className="text-xs text-[#70523C] dark:text-[#BA9E87] mt-1 mb-4">
                  Daftarkan diri atau masuk untuk mulai mengelola program layanan BK.
                </p>
                <button
                  onClick={() => onOpenRegister('guru')}
                  className="w-full py-2.5 rounded-xl bg-[#3A2416] hover:bg-[#523420] text-white font-bold text-xs shadow-sm transition-all"
                >
                  Registrasi Guru BK
                </button>
              </div>
            </div>
          )}

          {activeTabPreview === 'admin' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FAF2E6] dark:bg-[#2E2017] text-[#7A4E2C] border border-[#E9DAC8] dark:border-[#423022]">
                  Manajemen Sistem & Keamanan
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#2D1F16] dark:text-[#F3E9DD]">
                  Manajemen Akun Lembaga & Basis Data Mandiri
                </h3>
                <p className="text-xs sm:text-sm text-[#6E5039] dark:text-[#BFA38C] leading-relaxed">
                  Administrator mengelola master data siswa dan guru, mengatur bank instrumen pertanyaan asesmen, serta mengonfigurasi pencadangan dan ekspor data spreadsheet secara mandiri tanpa biaya cloud.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#FAF5EE] dark:bg-[#2A1D15] border border-[#EFE5D8] dark:border-[#3A271C]">
                    <p className="text-xs font-bold text-[#422C1C] dark:text-[#EAE0D3]">✓ Ekspor Spreadsheet & CSV</p>
                    <p className="text-[11px] text-[#8C6D53] dark:text-[#B1937B]">Dapat dibuka di Excel gratis</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF5EE] dark:bg-[#2A1D15] border border-[#EFE5D8] dark:border-[#3A271C]">
                    <p className="text-xs font-bold text-[#422C1C] dark:text-[#EAE0D3]">✓ Kode Database Lembaga</p>
                    <p className="text-[11px] text-[#8C6D53] dark:text-[#B1937B]">Isolasi data antar tahun ajaran</p>
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FAF5EE] to-[#EFE3D3] dark:from-[#2B1D14] dark:to-[#1F140D] border border-[#DECBB8] dark:border-[#422F20] text-center">
                <Lock className="w-10 h-10 text-[#C5A059] mx-auto mb-2" />
                <h4 className="font-bold text-sm text-[#3E2717] dark:text-[#F3E9DD]">Akses Administrator</h4>
                <p className="text-xs text-[#70523C] dark:text-[#BA9E87] mt-1 mb-4">
                  Gunakan kredensial resmi sistem administrator untuk masuk ke konsol.
                </p>
                <button
                  onClick={onOpenLogin}
                  className="w-full py-2.5 rounded-xl bg-[#3A2416] hover:bg-[#523420] text-white font-bold text-xs shadow-sm transition-all"
                >
                  Masuk sebagai Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* NEW ELEMENT 3: 4-Step Interactive Workflow */}
      <section className="py-16 sm:py-20 bg-[#F5EFEB] dark:bg-[#1C140E] border-y border-[#EAE0D2] dark:border-[#352418]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8F5D38] dark:text-[#C5A059]">
              Alur Pelayanan
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2D1F16] dark:text-[#F5EDE2] mt-1.5">
              Empat Langkah Mudah Konseling Terpadu
            </h2>
            <div className="w-12 h-0.5 bg-[#C5A059] mx-auto mt-3"></div>
            <p className="mt-3 text-sm text-[#73543A] dark:text-[#BA9E86] leading-relaxed">
              Mulai dari asesmen mandiri hingga penetapan rencana aksi yang jelas untuk mencapai kemandirian dan prestasi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {alurLayanan.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.step}
                  className="p-6 rounded-3xl bg-white dark:bg-[#231811] border border-[#E6DBCE] dark:border-[#3D2B1E] shadow-sm relative hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#F7F1E7] dark:bg-[#302117] text-[#5C3B21] dark:text-[#D5B597] border border-[#EADAC8] dark:border-[#4A3423] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-editorial italic font-bold text-xl text-[#C5A059]">
                      Langkah {item.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#332216] dark:text-[#F3E8DB]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#70533C] dark:text-[#BCA088] mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8F5D38] dark:text-[#C5A059]">
            Layanan Menyeluruh
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2D1F16] dark:text-[#F5EDE2] mt-1.5">
            Tujuh Fitur Utama Layanan BK
          </h2>
          <div className="w-12 h-0.5 bg-[#C5A059] mx-auto mt-3"></div>
          <p className="mt-3 text-sm text-[#73543A] dark:text-[#BA9E86] leading-relaxed">
            Dirancang dengan standar konseling profesional untuk mendampingi perkembangan akademik, psikososial, dan arah masa depan siswa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.num}
                className={`p-7 rounded-3xl bg-white dark:bg-[#231811] border border-[#E6DBCE] dark:border-[#3D2B1E] shadow-sm hover:shadow-md hover:border-[#C5A059]/40 transition-all ${
                  feat.fullWidth ? 'md:col-span-2 lg:col-span-3' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F7F1E7] dark:bg-[#302117] text-[#5C3B21] dark:text-[#D5B597] border border-[#EADAC8] dark:border-[#4A3423] flex items-center justify-center shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-editorial italic font-bold text-lg text-[#C5A059]">
                    {feat.num}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#332216] dark:text-[#F3E8DB]">
                  {feat.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-[#70533C] dark:text-[#BCA088] leading-relaxed">
                  {feat.desc}
                </p>

                {feat.fullWidth && (
                  <div className="mt-4 pt-4 border-t border-[#F2E8DC] dark:border-[#352519] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#EBF7EE] text-[#1B4332] text-xs font-semibold flex items-center gap-1.5 border border-[#B7E4C7]">
                        <Award className="w-3.5 h-3.5 text-[#2D6A4F]" />
                        Hak Cetak & Unduh Resmi Khusus Guru BK
                      </span>
                    </div>
                    <span className="text-xs text-[#8A674B] dark:text-[#B39378]">
                      Siswa tidak memiliki akses mengunduh atau mencetak dokumen rekapitulasi.
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* NEW ELEMENT 4: School BK Counselor Room & Hours Information */}
      <section className="py-12 bg-[#F5ECE0] dark:bg-[#1E150F] border-y border-[#DECBB8] dark:border-[#382619]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#251A13] border border-[#E5DAC8] dark:border-[#432F21] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF4ED] dark:bg-[#2F2117] text-xs font-bold text-[#8C5D38] border border-[#DECBB8] dark:border-[#4B3728]">
                <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Informasi Ruang Bimbingan & Konseling</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#2D1F16] dark:text-[#F3E9DD]">
                Ruang BK Selalu Terbuka untuk Setiap Siswa
              </h3>
              <p className="text-xs sm:text-sm text-[#70533C] dark:text-[#BCA088] leading-relaxed">
                Layanan tatap muka di sekolah dilaksanakan pada hari kerja, sedangkan ruang konsultasi digital dan fitur refleksi CYBER-COUNSELING dapat diakses kapan saja demi kenyamanan belajar Anda.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#523B2A] dark:text-[#D5BCA9] font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Senin - Jumat (07.30 - 15.30 WIB)
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Ruang Konseling Khusus & Kedap
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={onOpenLogin}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#3A2416] hover:bg-[#523420] text-[#FAF5EC] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-4 h-4 text-[#C5A059]" />
                <span>Konsultasi Sekarang</span>
              </button>
              <button
                onClick={() => onOpenRegister('siswa')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#FAF5EE] dark:bg-[#2E2017] hover:bg-[#F0E5D8] dark:hover:bg-[#382619] text-[#523B2A] dark:text-[#ECC9AC] font-bold text-xs sm:text-sm border border-[#DECBB8] dark:border-[#4B3728] transition-all"
              >
                <span>Daftar Akun Baru</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Role Access Clarity (RBAC) */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-11 rounded-3xl bg-gradient-to-br from-[#F5ECE0] to-[#E9D9C7] dark:from-[#251A13] dark:to-[#1C130D] border border-[#DECBB8] dark:border-[#432F21] shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-9">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8F5D38] dark:text-[#C5A059]">
              Keamanan Data & Privasi
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#2D1F16] dark:text-[#F6EDE2] mt-1">
              Hierarki Hak Akses (Role-Based Access)
            </h3>
            <div className="w-10 h-0.5 bg-[#C5A059] mx-auto mt-2.5"></div>
            <p className="mt-2.5 text-xs sm:text-sm text-[#78573D] dark:text-[#B6967D]">
              Setiap peranan memiliki batas kewenangan terisolasi demi menjamin kerahasiaan asesmen dan konseling siswa:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            {/* Siswa */}
            <div className="p-5 rounded-2xl bg-white/85 dark:bg-[#2C1F17]/85 backdrop-blur-xs border border-[#E5DAC8] dark:border-[#4A3525] flex flex-col">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EFE8DE] dark:border-[#3D2C1F]">
                <span className="font-extrabold text-[#7A4E2C] dark:text-[#DDAF7A] text-sm tracking-wide">
                  SISWA (KONSELI)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#FAF3EA] dark:bg-[#382619] text-[10px] font-semibold text-[#8C603A]">
                  Akses Personal
                </span>
              </div>
              <ul className="space-y-2 text-[#684C35] dark:text-[#C7AB96] flex-1">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Mengisi asesmen mandiri (DCM, AUM, Sosiometri)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Melihat rangkuman hasil asesmen milik sendiri</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Akses refleksi, chat konseling privat, & janji temu</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Menulis diary privat & manajemen to-do list</span>
                </li>
                <li className="flex items-start gap-1.5 text-rose-700 dark:text-rose-400 font-medium">
                  <span>✕</span>
                  <span>Dilarang mencetak / mengunduh dokumen asesmen</span>
                </li>
                <li className="flex items-start gap-1.5 text-rose-700 dark:text-rose-400 font-medium">
                  <span>✕</span>
                  <span>Tidak dapat melihat data siswa lain</span>
                </li>
              </ul>
            </div>

            {/* Guru BK */}
            <div className="p-5 rounded-2xl bg-white/85 dark:bg-[#2C1F17]/85 backdrop-blur-xs border border-[#C5A059]/50 dark:border-[#C5A059]/40 flex flex-col ring-1 ring-[#C5A059]/20 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EFE8DE] dark:border-[#3D2C1F]">
                <span className="font-extrabold text-[#4E311A] dark:text-[#EAD0B3] text-sm tracking-wide">
                  GURU BK (KONSELOR)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#F5ECE0] dark:bg-[#3D281B] text-[10px] font-semibold text-[#8C5D38] border border-[#C5A059]/30">
                  Otoritas Penuh
                </span>
              </div>
              <ul className="space-y-2 text-[#684C35] dark:text-[#C7AB96] flex-1">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Akses menyeluruh hasil asesmen seluruh siswa</span>
                </li>
                <li className="flex items-start gap-1.5 font-bold text-[#3E2716] dark:text-[#F3E2D0]">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Hak Eksklusif Cetak & Unduh PDF Hasil & Rekap</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Program Layanan, Catatan Konseling, & Tindak Lanjut</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Respon room chat siswa & konfirmasi janji temu</span>
                </li>
              </ul>
            </div>

            {/* Admin */}
            <div className="p-5 rounded-2xl bg-white/85 dark:bg-[#2C1F17]/85 backdrop-blur-xs border border-[#E5DAC8] dark:border-[#4A3525] flex flex-col">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EFE8DE] dark:border-[#3D2C1F]">
                <span className="font-extrabold text-[#2E1D13] dark:text-[#F1E4D6] text-sm tracking-wide">
                  ADMINISTRATOR
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#FAF3EA] dark:bg-[#382619] text-[10px] font-semibold text-[#8C603A]">
                  Infrastruktur
                </span>
              </div>
              <ul className="space-y-2 text-[#684C35] dark:text-[#C7AB96] flex-1">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Manajemen akun Guru BK dan Siswa</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Pengaturan bank instrumen soal (DCM, AUM, Sosiometri)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Konfigurasi Kode Database & Ekspor Spreadsheet</span>
                </li>
                <li className="flex items-start gap-1.5 text-rose-700 dark:text-rose-400 font-medium">
                  <span>✕</span>
                  <span>Tidak memiliki hak cetak/unduh hasil asesmen</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* NEW ELEMENT 5: Interactive Frequently Asked Questions (FAQ) Accordion */}
      <section className="py-14 max-w-4xl mx-auto px-4 sm:px-6 w-full mb-10">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8F5D38] dark:text-[#C5A059]">
            Tanya Jawab
          </span>
          <h2 className="font-editorial text-3xl font-bold text-[#2D1F16] dark:text-[#F5EDE2] mt-1">
            Pertanyaan yang Sering Diajukan
          </h2>
          <div className="w-10 h-0.5 bg-[#C5A059] mx-auto mt-2.5"></div>
          <p className="mt-2 text-xs sm:text-sm text-[#73543A] dark:text-[#BA9E86]">
            Temukan jawaban cepat seputar tata kelola, keamanan data, dan mekanisme layanan konseling.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-[#231811] border border-[#E8DEC8] dark:border-[#3D2C1E] overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[#3E2717] dark:text-[#F3E9DD] hover:bg-[#FAF5EE] dark:hover:bg-[#2B1D15] transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#8C5D38] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-[#6E5039] dark:text-[#BFA38C] leading-relaxed border-t border-[#F2EAE0] dark:border-[#2F2117] bg-[#FAF6F0]/50 dark:bg-[#1E150F]/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Classy Footer with ALFZH branding */}
      <footer className="mt-auto py-7 px-6 border-t border-[#EAE0D2] dark:border-[#352418] bg-[#FAF7F2] dark:bg-[#18110C] text-xs text-[#8A674A] dark:text-[#A88C76]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold tracking-tight text-[#332216] dark:text-[#F3E9DD]">CYBER-COUNSELING</span>
            <span className="text-[#C5A059]">•</span>
            <span className="font-medium">{settings.namaSekolah}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-[#937255] dark:text-[#9A7D66]">
              Media Pendukung Layanan Bimbingan dan Konseling
            </span>
            {/* USER REQUIREMENT: Tambahkan tulisan ALFZH pada pojok bawah setiap halaman */}
            <span className="font-extrabold tracking-widest text-[#6E492B] dark:text-[#D5B597] bg-[#EFE4D3] dark:bg-[#2C1E14] px-3 py-1 rounded-full text-[11px] border border-[#DECBB8] dark:border-[#483324] shadow-xs">
              ALFZH
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
