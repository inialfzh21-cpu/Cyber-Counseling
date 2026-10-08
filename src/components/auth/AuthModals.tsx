import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  User as UserIcon, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Hash, 
  ShieldCheck, 
  GraduationCap, 
  School,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../lib/storage';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister
}) => {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [kodeDatabase, setKodeDatabase] = useState(storage.getActiveGroupCode());
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      showToast('Harap isi username dan kata sandi.', 'warning');
      return;
    }

    setLoading(true);
    const res = await login(username, password, kodeDatabase);
    setLoading(false);

    if (res.success) {
      showToast(res.message, 'success');
      onClose();
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#FFFFFF] dark:bg-[#231A13] rounded-3xl max-w-md w-full p-7 sm:p-9 shadow-2xl border border-[#E7DFD5] dark:border-[#3D2C1E] animate-in zoom-in-95 relative overflow-hidden">
        {/* Subtle decorative gold sheen accent at top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8C5D38] via-[#D4AF37] to-[#8C5D38]" />

        <div className="flex items-start justify-between pb-5 border-b border-[#EFE8DF] dark:border-[#342419]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FAF5EE] dark:bg-[#2F2117] border border-[#E5D7C7] dark:border-[#4A3525] flex items-center justify-center text-[#8C5D38] dark:text-[#E2C7B0] shadow-xs shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-editorial text-2xl font-bold tracking-tight text-[#2D1F16] dark:text-[#F6EDE3]">
                Masuk ke Portal
              </h2>
              <p className="text-xs text-[#8A6D56] dark:text-[#BFA48E] font-medium mt-0.5">
                CYBER-COUNSELING Layanan Terpadu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-[#2D1F16] dark:hover:text-stone-200 hover:bg-[#F7F2EA] dark:hover:bg-[#2E2017] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#634731] dark:text-[#D5BCA9] mb-1.5">
              Nama Pengguna (Username)
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9C826D]" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username Anda"
                className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#2C1F16] border border-[#E4D9CC] dark:border-[#483424] text-sm text-[#2D1F16] dark:text-[#F6EDE3] placeholder:text-[#A8927E] focus:outline-none focus:ring-2 focus:ring-[#8C5D38]/50 focus:border-[#8C5D38] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#634731] dark:text-[#D5BCA9] mb-1.5">
              Kata Sandi (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9C826D]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi akun"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#2C1F16] border border-[#E4D9CC] dark:border-[#483424] text-sm text-[#2D1F16] dark:text-[#F6EDE3] placeholder:text-[#A8927E] focus:outline-none focus:ring-2 focus:ring-[#8C5D38]/50 focus:border-[#8C5D38] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-[#9C826D] hover:text-[#523A28]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#634731] dark:text-[#D5BCA9]">
                Kode Database Lembaga
              </label>
              <span className="text-[10px] text-[#9A7F6A] dark:text-[#AFA192]">Grup Sekolah</span>
            </div>
            <div className="relative">
              <Hash className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9C826D]" />
              <input
                type="text"
                value={kodeDatabase}
                onChange={(e) => setKodeDatabase(e.target.value)}
                placeholder="Contoh: BK-2026"
                className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#2C1F16] border border-[#E4D9CC] dark:border-[#483424] text-sm font-mono font-bold text-[#8C5D38] dark:text-[#E2C7B0] placeholder:text-[#A8927E] focus:outline-none focus:ring-2 focus:ring-[#8C5D38]/50 focus:border-[#8C5D38] transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4E3524] to-[#362417] hover:from-[#5E402C] hover:to-[#432C1D] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#362417]/25 transition-all flex items-center justify-center gap-2 border border-[#6E4B33]"
            >
              {loading ? (
                <span className="animate-pulse">Memverifikasi Kredensial...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-[#D4AF37]" />
                  <span>Otorisasi & Masuk</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-5 p-3 rounded-xl bg-[#FAF6F0] dark:bg-[#2A1E15] border border-[#EBE2D5] dark:border-[#3D2C1E] text-[11px] text-[#7A5E47] dark:text-[#BA9E87] leading-relaxed">
          <p className="font-semibold text-[#543821] dark:text-[#DFC2A8] flex items-center gap-1.5 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
            Petunjuk Masuk Sistem
          </p>
          <span>Siswa & Guru BK silakan masuk menggunakan akun terdaftar. Administrator menggunakan akun resmi sistem (username: <code className="font-mono text-[#8C5D38] dark:text-[#E2C7B0] bg-white/70 dark:bg-black/30 px-1 py-0.5 rounded">admincybercounseling</code>).</span>
        </div>

        <div className="mt-5 pt-4 border-t border-[#EFE8DF] dark:border-[#342419] text-center text-xs text-[#7A614D] dark:text-[#BFA48E]">
          Belum memiliki akun terdaftar?{' '}
          <button
            type="button"
            onClick={() => {
              onClose();
              onSwitchToRegister();
            }}
            className="text-[#8C5D38] dark:text-[#E2C7B0] font-bold hover:underline ml-1"
          >
            Registrasi Baru
          </button>
        </div>
      </div>
    </div>
  );
};

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  defaultTab?: 'siswa' | 'guru';
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  defaultTab = 'siswa'
}) => {
  const { registerSiswa, registerGuru } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'siswa' | 'guru'>(defaultTab);

  // Siswa Form States
  const [namaSiswa, setNamaSiswa] = useState('');
  const [jkSiswa, setJkSiswa] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [emailSiswa, setEmailSiswa] = useState('');
  const [usernameSiswa, setUsernameSiswa] = useState('');
  const [passwordSiswa, setPasswordSiswa] = useState('');
  const [confirmPasswordSiswa, setConfirmPasswordSiswa] = useState('');
  const [kelasSiswa, setKelasSiswa] = useState('X MIPA 1');
  const [kodeDBSiswa, setKodeDBSiswa] = useState(storage.getActiveGroupCode());

  // Guru Form States
  const [namaGuru, setNamaGuru] = useState('');
  const [jkGuru, setJkGuru] = useState<'Laki-laki' | 'Perempuan'>('Perempuan');
  const [emailGuru, setEmailGuru] = useState('');
  const [usernameGuru, setUsernameGuru] = useState('');
  const [passwordGuru, setPasswordGuru] = useState('');
  const [confirmPasswordGuru, setConfirmPasswordGuru] = useState('');
  const [nipGuru, setNipGuru] = useState('');
  const [kodeDBGuru, setKodeDBGuru] = useState(storage.getActiveGroupCode());

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRegisterSiswa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordSiswa !== confirmPasswordSiswa) {
      showToast('Konfirmasi password tidak cocok dengan password yang dimasukkan.', 'warning');
      return;
    }
    if (passwordSiswa.length < 6) {
      showToast('Password minimal 6 karakter untuk standar keamanan.', 'warning');
      return;
    }

    setLoading(true);
    const res = await registerSiswa({
      nama: namaSiswa,
      jenisKelamin: jkSiswa,
      email: emailSiswa,
      username: usernameSiswa,
      passwordPlain: passwordSiswa,
      kelas: kelasSiswa,
      kodeDatabase: kodeDBSiswa
    });
    setLoading(false);

    if (res.success) {
      showToast(res.message, 'success');
      onClose();
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleRegisterGuru = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordGuru !== confirmPasswordGuru) {
      showToast('Konfirmasi password tidak cocok dengan password yang dimasukkan.', 'warning');
      return;
    }
    if (passwordGuru.length < 6) {
      showToast('Password minimal 6 karakter untuk standar keamanan.', 'warning');
      return;
    }

    setLoading(true);
    const res = await registerGuru({
      nama: namaGuru,
      jenisKelamin: jkGuru,
      email: emailGuru,
      username: usernameGuru,
      passwordPlain: passwordGuru,
      nipNik: nipGuru || '-',
      kodeDatabase: kodeDBGuru
    });
    setLoading(false);

    if (res.success) {
      showToast(res.message, 'success');
      onClose();
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-[#FFFFFF] dark:bg-[#231A13] rounded-3xl max-w-lg w-full p-7 sm:p-9 shadow-2xl border border-[#E7DFD5] dark:border-[#3D2C1E] my-8 animate-in zoom-in-95 relative overflow-hidden">
        {/* Subtle decorative gold sheen accent at top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8C5D38] via-[#D4AF37] to-[#8C5D38]" />

        <div className="flex items-start justify-between pb-4 border-b border-[#EFE8DF] dark:border-[#342419]">
          <div>
            <h2 className="font-editorial text-2xl font-bold tracking-tight text-[#2D1F16] dark:text-[#F6EDE3]">
              Registrasi Akun Baru
            </h2>
            <p className="text-xs text-[#8A6D56] dark:text-[#BFA48E] font-medium mt-0.5">
              Pilih peranan Anda dalam ekosistem Bimbingan dan Konseling
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-[#2D1F16] dark:hover:text-stone-200 hover:bg-[#F7F2EA] dark:hover:bg-[#2E2017] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Tabs */}
        <div className="flex rounded-xl bg-[#FAF5EE] dark:bg-[#2C1F16] p-1 mt-5 border border-[#E5DACB] dark:border-[#423122]">
          <button
            type="button"
            onClick={() => setActiveTab('siswa')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'siswa'
                ? 'bg-[#4E3524] text-white shadow-sm'
                : 'text-[#7D614A] dark:text-[#C5A893] hover:text-[#382619]'
            }`}
          >
            Siswa / Konseli
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guru')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'guru'
                ? 'bg-[#4E3524] text-white shadow-sm'
                : 'text-[#7D614A] dark:text-[#C5A893] hover:text-[#382619]'
            }`}
          >
            Guru BK / Konselor
          </button>
        </div>

        {/* SISWA REGISTRATION FORM */}
        {activeTab === 'siswa' && (
          <form onSubmit={handleRegisterSiswa} className="mt-5 space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#634731] dark:text-[#D5BCA9] mb-1">
                Nama Lengkap Siswa
              </label>
              <input
                type="text"
                required
                value={namaSiswa}
                onChange={(e) => setNamaSiswa(e.target.value)}
                placeholder="Contoh: Muhammad Rizky Pratama"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#2C1F16] border border-[#E4D9CC] dark:border-[#483424] text-sm text-[#2D1F16] dark:text-[#F6EDE3] focus:outline-none focus:ring-2 focus:ring-[#8C5D38]/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#634731] dark:text-[#D5BCA9] mb-1">
                  Jenis Kelamin
                </label>
                <select
                  value={jkSiswa}
                  onChange={(e) => setJkSiswa(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#2C1F16] border border-[#E4D9CC] dark:border-[#483424] text-sm text-[#2D1F16] dark:text-[#F6EDE3] focus:outline-none focus:ring-2 focus:ring-[#8C5D38]/50"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#634731] dark:text-[#D5BCA9] mb-1">
                  Kelas / Rombel
                </label>
                <input
                  type="text"
                  required
                  value={kelasSiswa}
                  onChange={(e) => setKelasSiswa(e.target.value)}
                  placeholder="Contoh: XI MIPA 2"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#2C1F16] border border-[#E4D9CC] dark:border-[#483424] text-sm text-[#2D1F16] dark:text-[#F6EDE3] focus:outline-none focus:ring-2 focus:ring-[#8C5D38]/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#634731] dark:text-[#D5BCA9] mb-1">
                  Alamat Email Aktif
                </label>
                <input
                  type="email"
                  required
                  value={emailSiswa}
                  onChange={(e) => setEmailSiswa(e.target.value)}
                  placeholder="email@sekolah.sch.id"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#2C1F16] border border-[#E4D9CC] dark:border-[#483424] text-sm text-[#2D1F16] dark:text-[#F6EDE3] focus:outline-none focus:ring-2 focus:ring-[#8C5D38]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#634731] dark:text-[#D5BCA9] mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={usernameSiswa}
                  onChange={(e) => setUsernameSiswa(e.target.value)}
                  placeholder="username_siswa"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#2C1F16] border border-[#E4D9CC] dark:border-[#483424] text-sm text-[#2D1F16] dark:text-[#F6EDE3] focus:outline-none focus:ring-2 focus:ring-[#8C5D38]/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#634731] dark:text-[#D5BCA9] mb-1">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  required
                  value={passwordSiswa}
                  onChange={(e) => setPasswordSiswa(e.target.value)}
                  placeholder="Min. 6 karakter"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#2C1F16] border border-[#E4D9CC] dark:border-[#483424] text-sm text-[#2D1F16] dark:text-[#F6EDE3] focus:outline-none focus:ring-2 focus:ring-[#8C5D38]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#634731] dark:text-[#D5BCA9] mb-1">
                  Konfirmasi Kata Sandi
                </label>
                <input
                  type="password"
                  required
                  value={confirmPasswordSiswa}
                  onChange={(e) => setConfirmPasswordSiswa(e.target.value)}
                  placeholder="Ulangi kata sandi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#2C1F16] border border-[#E4D9CC] dark:border-[#483424] text-sm text-[#2D1F16] dark:text-[#F6EDE3] focus:outline-none focus:ring-2 focus:ring-[#8C5D38]/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#634731] dark:text-[#D5BCA9] mb-1">
                Kode Database Lembaga
              </label>
              <input
                type="text"
                required
                value={kodeDBSiswa}
                onChange={(e) => setKodeDBSiswa(e.target.value)}
                placeholder="Contoh: BK-2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#2C1F16] border border-[#E4D9CC] dark:border-[#483424] text-sm font-mono font-bold text-[#8C5D38] dark:text-[#E2C7B0] focus:outline-none focus:ring-2 focus:ring-[#8C5D38]/50"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4E3524] to-[#362417] hover:from-[#5E402C] hover:to-[#432C1D] text-white font-bold text-sm tracking-wide shadow-md shadow-[#362417]/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Mendaftarkan Akun Siswa...' : 'Daftarkan Akun Siswa'}
              </button>
            </div>
          </form>
        )}

        {/* GURU BK REGISTRATION FORM */}
        {activeTab === 'guru' && (
          <form onSubmit={handleRegisterGuru} className="mt-5 space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#634731] dark:text-[#D5BCA9] mb-1">
                Nama Lengkap & Gelar Guru BK
              </label>
              <input
                type="text"
                required
                value={namaGuru}
                onChange={(e) => setNamaGuru(e.target.value)}
                placeholder="Contoh: Dra. Hj. Siti Rahmawati, M.Pd., Kons."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#2C1F16] border border-[#E4D9CC] dark:border-[#483424] text-sm text-[#2D1F16] dark:text-[#F6EDE3] focus:outline-none focus:ring-2 focus:ring-[#8C5D38]/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#634731] dark:text-[#D5BCA9] mb-1">
                  Jenis Kelamin
                </label>
                <select
                  value={jkGuru}
                  onChange={(e) => setJkGuru(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#2C1F16] border border-[#E4D9CC] dark:border-[#483424] text-sm text-[#2D1F16] dark:text-[#F6EDE3] focus:outline-none focus:ring-2 focus:ring-[#8C5D38]/50"
                >
                  <option value="Perempuan">Perempuan</option>
                  <option value="Laki-laki">Laki-laki</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#634731] dark:text-[#D5BCA9] mb-1">
                  NIP / NIK Pegawai
                </label>
                <input
                  type="text"
                  value={nipGuru}
                  onChange={(e) => setNipGuru(e.target.value)}
                  placeholder="Contoh: 198509142010011008"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#2C1F16] border border-[#E4D9CC] dark:border-[#483424] text-sm text-[#2D1F16] dark:text-[#F6EDE3] focus:outline-none focus:ring-2 focus:ring-[#8C5D38]/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#634731] dark:text-[#D5BCA9] mb-1">
                  Email Lembaga Resmi
                </label>
                <input
                  type="email"
                  required
                  value={emailGuru}
                  onChange={(e) => setEmailGuru(e.target.value)}
                  placeholder="guru.bk@sekolah.sch.id"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#2C1F16] border border-[#E4D9CC] dark:border-[#483424] text-sm text-[#2D1F16] dark:text-[#F6EDE3] focus:outline-none focus:ring-2 focus:ring-[#8C5D38]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#634731] dark:text-[#D5BCA9] mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={usernameGuru}
                  onChange={(e) => setUsernameGuru(e.target.value)}
                  placeholder="username_guru"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#2C1F16] border border-[#E4D9CC] dark:border-[#483424] text-sm text-[#2D1F16] dark:text-[#F6EDE3] focus:outline-none focus:ring-2 focus:ring-[#8C5D38]/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#634731] dark:text-[#D5BCA9] mb-1">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  required
                  value={passwordGuru}
                  onChange={(e) => setPasswordGuru(e.target.value)}
                  placeholder="Min. 6 karakter"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#2C1F16] border border-[#E4D9CC] dark:border-[#483424] text-sm text-[#2D1F16] dark:text-[#F6EDE3] focus:outline-none focus:ring-2 focus:ring-[#8C5D38]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#634731] dark:text-[#D5BCA9] mb-1">
                  Konfirmasi Kata Sandi
                </label>
                <input
                  type="password"
                  required
                  value={confirmPasswordGuru}
                  onChange={(e) => setConfirmPasswordGuru(e.target.value)}
                  placeholder="Ulangi kata sandi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#2C1F16] border border-[#E4D9CC] dark:border-[#483424] text-sm text-[#2D1F16] dark:text-[#F6EDE3] focus:outline-none focus:ring-2 focus:ring-[#8C5D38]/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#634731] dark:text-[#D5BCA9] mb-1">
                Kode Database Lembaga
              </label>
              <input
                type="text"
                required
                value={kodeDBGuru}
                onChange={(e) => setKodeDBGuru(e.target.value)}
                placeholder="Contoh: BK-2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#2C1F16] border border-[#E4D9CC] dark:border-[#483424] text-sm font-mono font-bold text-[#8C5D38] dark:text-[#E2C7B0] focus:outline-none focus:ring-2 focus:ring-[#8C5D38]/50"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4E3524] to-[#362417] hover:from-[#5E402C] hover:to-[#432C1D] text-white font-bold text-sm tracking-wide shadow-md shadow-[#362417]/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Mendaftarkan Akun Guru BK...' : 'Daftarkan Akun Guru BK'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-[#EFE8DF] dark:border-[#342419] text-center text-xs text-[#7A614D] dark:text-[#BFA48E]">
          Sudah memiliki akun terdaftar?{' '}
          <button
            type="button"
            onClick={() => {
              onClose();
              onSwitchToLogin();
            }}
            className="text-[#8C5D38] dark:text-[#E2C7B0] font-bold hover:underline ml-1"
          >
            Masuk ke Portal
          </button>
        </div>
      </div>
    </div>
  );
};
