import React, { useState, useRef } from 'react';
import { 
  User as UserIcon, 
  Camera, 
  Lock, 
  Mail, 
  GraduationCap, 
  Hash, 
  Save, 
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../lib/storage';
import { Breadcrumb } from '../common/Breadcrumb';

export const ProfilSiswa: React.FC = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!currentUser) return null;

  // Profile Information Form
  const [nama, setNama] = useState(currentUser.nama);
  const [email, setEmail] = useState(currentUser.email);
  const [kelas, setKelas] = useState(currentUser.kelas || '');
  const [nipNik, setNipNik] = useState(currentUser.nipNik || '');
  const [jenisKelamin, setJenisKelamin] = useState(currentUser.jenisKelamin);

  // Password Change Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handle Profile Photo Upload via Device File Picker
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file berupa gambar (JPG, PNG, WebP).', 'warning');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      showToast('Ukuran foto maksimal 3MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        updateCurrentUser({ fotoProfil: base64 });
        showToast('Foto profil berhasil diperbarui.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !email.trim()) {
      showToast('Nama dan email tidak boleh kosong.', 'warning');
      return;
    }

    updateCurrentUser({
      nama: nama.trim(),
      email: email.trim(),
      jenisKelamin,
      kelas: currentUser.role === 'siswa' ? kelas.trim() : undefined,
      nipNik: currentUser.role === 'guru_bk' ? nipNik.trim() : undefined
    });

    showToast('Informasi profil berhasil diperbarui.', 'success');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Harap lengkapi semua isian ganti password.', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Konfirmasi password baru tidak cocok.', 'warning');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Password baru minimal 6 karakter.', 'warning');
      return;
    }

    const currentHash = await storage.hashPassword(currentPassword);
    const isCurrentValid = currentUser.passwordHash === currentPassword || currentUser.passwordHash === currentHash;

    if (!isCurrentValid) {
      showToast('Password lama Anda salah.', 'error');
      return;
    }

    const newHash = await storage.hashPassword(newPassword);
    updateCurrentUser({ passwordHash: newHash });

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password berhasil diubah dengan aman.', 'success');
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Profil Pengguna' }]} />

      <div className="pb-4 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">
          Profil Pengguna
        </h1>
        <p className="text-xs sm:text-sm text-[#8A674A] dark:text-[#BA9B81] mt-0.5">
          Kelola informasi identitas, foto profil, dan keamanan akun Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Summary */}
        <div className="bg-white dark:bg-[#251B13] rounded-3xl p-6 border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <img
              src={currentUser.fotoProfil || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80'}
              alt={currentUser.nama}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-[#8B5E3C]/20 shadow-md"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white shadow-lg transition-transform hover:scale-105"
              title="Ganti Foto dari Perangkat"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-[#4A3525] dark:text-[#F3E9DD]">
              {currentUser.nama}
            </h2>
            <p className="text-xs text-[#8A674A] dark:text-[#BA9B81] mt-0.5 font-medium">
              @{currentUser.username} • {currentUser.role === 'admin' ? 'Administrator' : currentUser.role === 'guru_bk' ? 'Guru BK' : 'Siswa'}
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EE] dark:bg-[#342419] border border-[#E8DEC8] dark:border-[#3E2D20] text-xs font-bold text-[#8B5E3C] dark:text-[#D4A373]">
              <Hash className="w-3.5 h-3.5" />
              <span>Kode DB: {currentUser.groupCode}</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Edit Info & Password */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Info Box */}
          <div className="bg-white dark:bg-[#251B13] rounded-3xl p-6 border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs">
            <h3 className="font-extrabold text-base text-[#4A3525] dark:text-[#F3E9DD] pb-3 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
              Informasi Pribadi
            </h3>

            <form onSubmit={handleUpdateInfo} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={jenisKelamin}
                    onChange={(e) => setJenisKelamin(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD]"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                  />
                </div>

                {currentUser.role === 'siswa' && (
                  <div>
                    <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                      Kelas
                    </label>
                    <input
                      type="text"
                      value={kelas}
                      onChange={(e) => setKelas(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    />
                  </div>
                )}

                {currentUser.role === 'guru_bk' && (
                  <div>
                    <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                      NIP / NIK
                    </label>
                    <input
                      type="text"
                      value={nipNik}
                      onChange={(e) => setNipNik(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#8B5E3C]/20 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Profil</span>
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Box */}
          <div className="bg-white dark:bg-[#251B13] rounded-3xl p-6 border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs">
            <h3 className="font-extrabold text-base text-[#4A3525] dark:text-[#F3E9DD] pb-3 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
              Ubah Password Akun
            </h3>

            <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                  Password Saat Ini
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan password lama"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password baru"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#5C4033] hover:bg-[#473026] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#5C4033]/20 flex items-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Perbarui Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
