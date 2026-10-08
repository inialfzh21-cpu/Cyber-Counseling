import React, { useState } from 'react';
import { 
  Bell, 
  Menu, 
  Moon, 
  Sun, 
  LogOut, 
  User as UserIcon, 
  Sparkles,
  School,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../lib/storage';
import { AppNotification } from '../../types';

interface HeaderNavProps {
  onToggleSidebar: () => void;
  activeMenu: string;
  onSelectMenu: (menu: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onToggleSidebar,
  activeMenu,
  onSelectMenu,
  darkMode,
  onToggleDarkMode
}) => {
  const { currentUser, logout, role } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const settings = storage.getSettings();

  const notifications = currentUser ? storage.getNotifications(currentUser.id) : [];
  const unreadCount = notifications.filter(n => !n.dibaca).length;

  const handleNotificationClick = (notif: AppNotification) => {
    storage.markNotificationRead(notif.id);
    if (notif.linkMenu) {
      onSelectMenu(notif.linkMenu);
    }
    setShowNotifications(false);
  };

  const markAllRead = () => {
    if (currentUser) {
      storage.markAllNotificationsRead(currentUser.id);
    }
  };

  const roleLabel = role === 'admin' ? 'Administrator' : role === 'guru_bk' ? 'Guru BK' : 'Siswa';

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 dark:bg-[#1E150F]/95 backdrop-blur-md border-b border-[#E8DEC8] dark:border-[#3D2C1E] transition-colors relative">
      {/* Delicate gold hairline border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#6E492B] via-[#C5A059] to-[#6E492B]" />

      <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-[#6E4F32] dark:text-[#D4A373] hover:bg-[#F0E6D8] dark:hover:bg-[#3D2C1E] transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#3A2416] dark:text-[#FAF1E6]">
                CYBER-COUNSELING
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full bg-[#EFE4D3] text-[#5C3B1E] dark:bg-[#342419] dark:text-[#E2C7B0] border border-[#DECBB8] dark:border-[#4D3625]">
                {roleLabel}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#826146] dark:text-[#BCA087] flex items-center gap-1.5 font-medium">
              <span>Media Pendukung Layanan Bimbingan dan Konseling</span>
              <span className="text-[#C5A059] hidden md:inline">•</span>
              <span className="hidden md:flex items-center gap-1 font-semibold text-[#573A22] dark:text-[#E5CCA8]">
                <School className="w-3.5 h-3.5 text-[#C5A059]" />
                {settings.namaSekolah}
              </span>
            </p>
          </div>
        </div>

        {/* Right Action Icons & User Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-[#7A5A3C] dark:text-[#DFB892] hover:bg-[#F2E7DC] dark:hover:bg-[#38281B] transition-colors"
            title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-[#7A5A3C] dark:text-[#DFB892] hover:bg-[#F2E7DC] dark:hover:bg-[#38281B] transition-colors"
              title="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C84B31] text-[10px] font-bold text-white shadow-sm animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popup */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#2C2017] shadow-2xl border border-[#E8DEC8] dark:border-[#4B3728] p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#423125]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#4A3525] dark:text-[#F3E9DD]">Notifikasi</span>
                    {unreadCount > 0 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F5E6D8] text-[#7A4B23] font-semibold">
                        {unreadCount} baru
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-[#8B5E3C] dark:text-[#D4A373] hover:underline font-medium flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Tandai dibaca
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#F2EAE0] dark:divide-[#3A2A1E] mt-2">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#9B7D64] dark:text-[#A88C75]">
                      Belum ada notifikasi baru saat ini.
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-3 text-left hover:bg-[#FAF4ED] dark:hover:bg-[#34251B] rounded-xl cursor-pointer transition-colors ${
                          !n.dibaca ? 'bg-[#FDF7F0] dark:bg-[#32231A]' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-[#4A3525] dark:text-[#F3E9DD]">{n.judul}</p>
                          <span className="text-[10px] text-[#A08168] dark:text-[#9A7D66] shrink-0">
                            {new Date(n.waktu).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-[#705642] dark:text-[#BA9D85] mt-1 line-clamp-2">{n.pesan}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          {currentUser && (
            <div className="flex items-center gap-2.5 pl-2 border-l border-[#E5DAC8] dark:border-[#423125]">
              <button
                onClick={() => onSelectMenu('Profil')}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#F2E7DC] dark:hover:bg-[#38281B] transition-colors text-left"
              >
                <img
                  src={currentUser.fotoProfil || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={currentUser.nama}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#C5A059]/60 shadow-xs"
                />
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-[#3E2718] dark:text-[#F3E9DD] max-w-[120px] truncate leading-tight">
                    {currentUser.nama.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-[#8C6343] dark:text-[#C5A58D] font-medium leading-none">
                    {currentUser.kelas || currentUser.nipNik || currentUser.role}
                  </p>
                </div>
              </button>

              {/* Logout button */}
              <button
                onClick={logout}
                className="p-2 rounded-xl text-[#A0402C] hover:bg-[#FDF0ED] dark:hover:bg-[#401C14] transition-colors"
                title="Keluar (Logout)"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
