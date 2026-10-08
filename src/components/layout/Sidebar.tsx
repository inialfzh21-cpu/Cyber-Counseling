import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  Sparkles, 
  MessageSquare, 
  CalendarClock, 
  BookHeart, 
  CheckSquare, 
  UserCircle, 
  LogOut, 
  Users, 
  FolderKanban, 
  FileText, 
  FileSpreadsheet, 
  Settings, 
  Database, 
  ChevronDown, 
  ChevronRight,
  GraduationCap,
  HeartHandshake
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../lib/storage';

interface SidebarProps {
  activeMenu: string;
  onSelectMenu: (menu: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  onSelectMenu,
  isOpen,
  onClose
}) => {
  const { role, logout, currentUser } = useAuth();
  const [manajemenOpen, setManajemenOpen] = useState(true);
  const settings = storage.getSettings();

  const handleMenuClick = (menu: string) => {
    onSelectMenu(menu);
    onClose();
  };

  const getBtnClass = (menu: string) =>
    `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all relative ${
      activeMenu === menu
        ? 'bg-gradient-to-r from-[#442B1A] to-[#2E1D11] text-[#FAF5ED] border border-[#C5A059]/40 shadow-sm shadow-[#2E1D11]/25 font-semibold'
        : 'text-[#684C35] dark:text-[#D5BCA9] hover:bg-[#EFE4D3] dark:hover:bg-[#2C1E14] hover:text-[#2E1D11] dark:hover:text-[#F3E9DD]'
    }`;

  const getSubBtnClass = (menu: string) =>
    `w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
      activeMenu === menu
        ? 'bg-[#734A29] text-[#FAF5ED] font-semibold shadow-xs border-l-2 border-[#C5A059]'
        : 'text-[#7A5B42] dark:text-[#C5A893] hover:bg-[#EFE3D5] dark:hover:bg-[#2B1E15]'
    }`;

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-[#FAF7F2] dark:bg-[#1E150F] border-r border-[#E8DEC8] dark:border-[#382619] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#E8DEC8] dark:border-[#382619] bg-[#FAF5EE]/50 dark:bg-[#221710]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4A2E1B] via-[#6B442A] to-[#8F5D38] flex items-center justify-center text-white shadow-md shadow-[#4A2E1B]/20 ring-1 ring-[#C5A059]/30">
              <HeartHandshake className="w-5 h-5 text-[#F9EFE6]" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-[#3A2416] dark:text-[#FAF1E6]">
                CYBER-COUNSELING
              </h1>
              <p className="text-[11px] font-medium text-[#88674D] dark:text-[#BCA087]">
                Layanan BK Terpadu
              </p>
            </div>
          </div>

          <div className="mt-3 px-3 py-1.5 rounded-xl bg-[#EFE3D3] dark:bg-[#2B1E14] text-[#5C3B1E] dark:text-[#E2C7B0] text-xs font-semibold flex items-center gap-1.5 truncate border border-[#DECBB8] dark:border-[#422F20]">
            <GraduationCap className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
            <span className="truncate">{settings.namaSekolah}</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 text-sm">
          {/* SISWA NAVIGATION */}
          {role === 'siswa' && (
            <>
              <button onClick={() => handleMenuClick('Dashboard')} className={getBtnClass('Dashboard')}>
                <LayoutDashboard className="w-4 h-4 text-[#C5A059]" />
                <span>Dashboard</span>
              </button>

              <button onClick={() => handleMenuClick('Asesmen BK')} className={getBtnClass('Asesmen BK')}>
                <FileCheck2 className="w-4 h-4 text-[#C5A059]" />
                <span>Asesmen BK</span>
              </button>

              <button onClick={() => handleMenuClick('Refleksi Siswa')} className={getBtnClass('Refleksi Siswa')}>
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>Refleksi Siswa</span>
              </button>

              <button onClick={() => handleMenuClick('Room Chat Konseling')} className={getBtnClass('Room Chat Konseling')}>
                <MessageSquare className="w-4 h-4 text-[#C5A059]" />
                <span>Room Chat Konseling</span>
              </button>

              <button onClick={() => handleMenuClick('Janji Konseling')} className={getBtnClass('Janji Konseling')}>
                <CalendarClock className="w-4 h-4 text-[#C5A059]" />
                <span>Janji Konseling</span>
              </button>

              <button onClick={() => handleMenuClick('Diary / Self Journal')} className={getBtnClass('Diary / Self Journal')}>
                <BookHeart className="w-4 h-4 text-[#C5A059]" />
                <span>Diary / Self Journal</span>
              </button>

              <button onClick={() => handleMenuClick('To-Do List')} className={getBtnClass('To-Do List')}>
                <CheckSquare className="w-4 h-4 text-[#C5A059]" />
                <span>To-Do List</span>
              </button>
            </>
          )}

          {/* GURU BK NAVIGATION */}
          {role === 'guru_bk' && (
            <>
              <button onClick={() => handleMenuClick('Dashboard')} className={getBtnClass('Dashboard')}>
                <LayoutDashboard className="w-4 h-4 text-[#C5A059]" />
                <span>Dashboard</span>
              </button>

              {/* Manajemen BK Submenu */}
              <div>
                <button
                  onClick={() => setManajemenOpen(!manajemenOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-[#684C35] dark:text-[#D5BCA9] hover:bg-[#EFE4D3] dark:hover:bg-[#2C1E14] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <FolderKanban className="w-4 h-4 text-[#C5A059]" />
                    <span className="font-semibold text-xs sm:text-sm">Manajemen BK</span>
                  </div>
                  {manajemenOpen ? <ChevronDown className="w-4 h-4 text-[#C5A059]" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {manajemenOpen && (
                  <div className="pl-6 pr-1 pt-1 pb-1 space-y-1">
                    <button onClick={() => handleMenuClick('Program/Layanan BK')} className={getSubBtnClass('Program/Layanan BK')}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span>Program/Layanan BK</span>
                    </button>

                    <button onClick={() => handleMenuClick('Catatan Layanan BK')} className={getSubBtnClass('Catatan Layanan BK')}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span>Catatan Layanan BK</span>
                    </button>

                    <button onClick={() => handleMenuClick('Tindak Lanjut Siswa')} className={getSubBtnClass('Tindak Lanjut Siswa')}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span>Tindak Lanjut Siswa</span>
                    </button>

                    <button onClick={() => handleMenuClick('Rekap Layanan BK')} className={getSubBtnClass('Rekap Layanan BK')}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span>Rekap Layanan BK</span>
                    </button>
                  </div>
                )}
              </div>

              <button onClick={() => handleMenuClick('Data Siswa')} className={getBtnClass('Data Siswa')}>
                <Users className="w-4 h-4 text-[#C5A059]" />
                <span>Data Siswa</span>
              </button>

              <button onClick={() => handleMenuClick('Hasil Asesmen')} className={getBtnClass('Hasil Asesmen')}>
                <FileCheck2 className="w-4 h-4 text-[#C5A059]" />
                <span>Hasil Asesmen</span>
              </button>

              <button onClick={() => handleMenuClick('Rekap Hasil Asesmen')} className={getBtnClass('Rekap Hasil Asesmen')}>
                <FileSpreadsheet className="w-4 h-4 text-[#C5A059]" />
                <span>Rekap Hasil Asesmen</span>
              </button>

              <button onClick={() => handleMenuClick('Room Chat')} className={getBtnClass('Room Chat')}>
                <MessageSquare className="w-4 h-4 text-[#C5A059]" />
                <span>Room Chat</span>
              </button>

              <button onClick={() => handleMenuClick('Janji Konseling')} className={getBtnClass('Janji Konseling')}>
                <CalendarClock className="w-4 h-4 text-[#C5A059]" />
                <span>Janji Konseling</span>
              </button>
            </>
          )}

          {/* ADMIN NAVIGATION */}
          {role === 'admin' && (
            <>
              <button onClick={() => handleMenuClick('Dashboard')} className={getBtnClass('Dashboard')}>
                <LayoutDashboard className="w-4 h-4 text-[#C5A059]" />
                <span>Dashboard</span>
              </button>

              <button onClick={() => handleMenuClick('Data Guru')} className={getBtnClass('Data Guru')}>
                <Users className="w-4 h-4 text-[#C5A059]" />
                <span>Data Guru BK</span>
              </button>

              <button onClick={() => handleMenuClick('Data Siswa')} className={getBtnClass('Data Siswa')}>
                <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                <span>Data Siswa</span>
              </button>

              <button onClick={() => handleMenuClick('Data Asesmen & Soal')} className={getBtnClass('Data Asesmen & Soal')}>
                <FileText className="w-4 h-4 text-[#C5A059]" />
                <span>Pertanyaan Asesmen</span>
              </button>

              <button onClick={() => handleMenuClick('Database & Google Sheets')} className={getBtnClass('Database & Google Sheets')}>
                <Database className="w-4 h-4 text-[#C5A059]" />
                <span>Manajemen Database</span>
              </button>

              <button onClick={() => handleMenuClick('Pengaturan Sistem')} className={getBtnClass('Pengaturan Sistem')}>
                <Settings className="w-4 h-4 text-[#C5A059]" />
                <span>Pengaturan Sistem</span>
              </button>
            </>
          )}

          {/* SHARED PROFIL & LOGOUT */}
          <div className="pt-4 mt-4 border-t border-[#E8DEC8] dark:border-[#382619] space-y-1">
            <button onClick={() => handleMenuClick('Profil')} className={getBtnClass('Profil')}>
              <UserCircle className="w-4 h-4 text-[#C5A059]" />
              <span>Profil Pengguna</span>
            </button>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-[#A63522] hover:bg-[#FDF0ED] dark:hover:bg-[#381611] transition-all text-xs sm:text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar (Logout)</span>
            </button>
          </div>
        </nav>

        {/* Sidebar Footer Info with Database Code Badge */}
        <div className="p-4 border-t border-[#E8DEC8] dark:border-[#382619] text-xs text-[#826146] dark:text-[#AD907B] bg-[#FAF5EE]/50 dark:bg-[#221710]/50">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[11px] uppercase tracking-wider">Kode Database:</span>
            <span className="font-mono bg-[#EFE3D3] dark:bg-[#312217] px-2.5 py-0.5 rounded-md text-[11px] text-[#4E311A] dark:text-[#ECC9AC] font-bold border border-[#DFCBB5] dark:border-[#4A3525]">
              {currentUser?.groupCode || storage.getActiveGroupCode()}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
