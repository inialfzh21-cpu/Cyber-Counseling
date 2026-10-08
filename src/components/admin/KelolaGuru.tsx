import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  School, 
  Power, 
  Save, 
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../lib/storage';
import { User } from '../../types';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { Breadcrumb } from '../common/Breadcrumb';

export const KelolaGuru: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [guruList, setGuruList] = useState<User[]>(() =>
    storage.getUsers().filter(u => u.role === 'guru_bk')
  );

  const [settings, setSettings] = useState(() => storage.getSettings());
  const [schoolNameInput, setSchoolNameInput] = useState(settings.namaSekolah);
  const [isSchoolNameEditing, setIsSchoolNameEditing] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuru, setEditingGuru] = useState<User | null>(null);

  // Form Fields
  const [nama, setNama] = useState('');
  const [jk, setJk] = useState<'Laki-laki' | 'Perempuan'>('Perempuan');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nipNik, setNipNik] = useState('');
  const [tersediaKonseling, setTersediaKonseling] = useState(true);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  if (!currentUser) return null;

  const refreshList = () => {
    setGuruList(storage.getUsers().filter(u => u.role === 'guru_bk'));
  };

  const handleSaveSchoolName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolNameInput.trim()) {
      showToast('Nama sekolah tidak boleh kosong.', 'warning');
      return;
    }

    const updated = storage.updateSettings({ namaSekolah: schoolNameInput.trim() });
    setSettings(updated);
    setIsSchoolNameEditing(false);
    showToast('Nama sekolah berhasil diperbarui di seluruh sistem.', 'success');
  };

  const handleOpenAdd = () => {
    setEditingGuru(null);
    setNama('');
    setJk('Perempuan');
    setEmail('');
    setUsername('');
    setPassword('');
    setNipNik('');
    setTersediaKonseling(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (guru: User) => {
    setEditingGuru(guru);
    setNama(guru.nama);
    setJk(guru.jenisKelamin);
    setEmail(guru.email);
    setUsername(guru.username);
    setPassword('');
    setNipNik(guru.nipNik || '');
    setTersediaKonseling(guru.tersediaKonseling !== false);
    setIsModalOpen(true);
  };

  const handleSaveGuru = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !email.trim() || !username.trim()) {
      showToast('Harap lengkapi semua isian wajib.', 'warning');
      return;
    }

    let passwordHash = editingGuru ? editingGuru.passwordHash : 'password123';
    if (password.trim()) {
      passwordHash = await storage.hashPassword(password.trim());
    }

    const item: User = {
      id: editingGuru ? editingGuru.id : 'usr_guru_' + Date.now(),
      nama: nama.trim(),
      jenisKelamin: jk,
      email: email.trim(),
      username: username.trim(),
      passwordHash,
      role: 'guru_bk',
      nipNik: nipNik.trim(),
      tersediaKonseling,
      statusAkun: editingGuru ? editingGuru.statusAkun : 'aktif',
      tanggalDibuat: editingGuru ? editingGuru.tanggalDibuat : new Date().toISOString(),
      groupCode: currentUser.groupCode,
      fotoProfil: editingGuru?.fotoProfil || (jk === 'Perempuan' 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80')
    };

    storage.saveUser(item);
    refreshList();
    setIsModalOpen(false);
    showToast(editingGuru ? 'Data Guru BK berhasil diperbarui.' : 'Guru BK baru berhasil ditambahkan.', 'success');
  };

  const handleToggleActive = (guru: User) => {
    const updated: User = {
      ...guru,
      statusAkun: guru.statusAkun === 'aktif' ? 'nonaktif' : 'aktif'
    };
    storage.saveUser(updated);
    refreshList();
    showToast(`Status akun ${guru.nama} diubah menjadi ${updated.statusAkun}.`, 'info');
  };

  const handleToggleKonseling = (guru: User) => {
    const updated: User = {
      ...guru,
      tersediaKonseling: !guru.tersediaKonseling
    };
    storage.saveUser(updated);
    refreshList();
    showToast(
      updated.tersediaKonseling
        ? `${guru.nama} sekarang TERSEDIA untuk chat & janji konseling siswa.`
        : `${guru.nama} diset TIDAK AKTIF pada pilihan konseling siswa.`,
      'info'
    );
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      storage.deleteUser(deleteTargetId);
      refreshList();
      setDeleteTargetId(null);
      showToast('Data Guru BK berhasil dihapus dari sistem.', 'info');
    }
  };

  const filteredGuru = guruList.filter(g =>
    g.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (g.nipNik && g.nipNik.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Data Guru' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">
            Kelola Data Guru Bimbingan dan Konseling
          </h1>
          <p className="text-xs sm:text-sm text-[#8A674A] dark:text-[#BA9B81] mt-0.5">
            Manajemen akun guru, izin ketersediaan konseling siswa, dan pengaturan identitas sekolah.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#8B5E3C]/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Guru BK Baru</span>
        </button>
      </div>

      {/* Change School Name Box (USER REQUIREMENT NO 27) */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF5EE] dark:bg-[#342419] text-[#8B5E3C] flex items-center justify-center shrink-0">
              <School className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-[#4A3525] dark:text-[#F3E9DD]">
                Nama Sekolah Pada Dashboard & Lembar Asesmen:
              </p>
              <p className="text-xs text-[#8C6D53]">
                {settings.namaSekolah}
              </p>
            </div>
          </div>

          {isSchoolNameEditing ? (
            <form onSubmit={handleSaveSchoolName} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                required
                value={schoolNameInput}
                onChange={(e) => setSchoolNameInput(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs font-bold text-[#4A3525]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-[#8B5E3C] text-white text-xs font-bold"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setIsSchoolNameEditing(false)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-600"
              >
                Batal
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsSchoolNameEditing(true)}
              className="px-4 py-2 rounded-xl bg-[#FAF5EE] dark:bg-[#342419] hover:bg-[#F2E5D4] text-[#6A4728] dark:text-[#ECC9AC] border border-[#E8DCCB] text-xs font-bold"
            >
              Ubah Nama Sekolah
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#9A7D66]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama guru, email, atau NIP..."
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs text-[#4A3525] dark:text-[#F3E9DD]"
          />
        </div>
        <span className="text-xs font-bold text-[#8C6D53]">Total: {filteredGuru.length} Guru</span>
      </div>

      {/* Guru List Table */}
      <div className="bg-white dark:bg-[#251B13] rounded-3xl border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF5EE] dark:bg-[#2E2017] border-b border-[#E8DEC8] dark:border-[#3E2D20] text-[#6A4728] dark:text-[#E2C7B0] font-bold">
                <th className="p-4">Guru BK</th>
                <th className="p-4">NIP / NIK</th>
                <th className="p-4">Jenis Kelamin</th>
                <th className="p-4">Ketersediaan Konseling</th>
                <th className="p-4">Status Akun</th>
                <th className="p-4 text-center">Aksi Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EAE0] dark:divide-[#3A2A1E]">
              {filteredGuru.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-400">
                    Tidak ditemukan data Guru BK.
                  </td>
                </tr>
              ) : (
                filteredGuru.map(guru => (
                  <tr key={guru.id} className="hover:bg-[#FAF6F0] dark:hover:bg-[#2C1E15] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={guru.fotoProfil || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'}
                          alt={guru.nama}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-[#C89D7C]"
                        />
                        <div>
                          <p className="font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">{guru.nama}</p>
                          <p className="text-[11px] text-[#8C6D53]">@{guru.username} • {guru.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-[#5C3F28] dark:text-[#ECC9AC]">{guru.nipNik || '-'}</td>
                    <td className="p-4 text-[#7A5B40] dark:text-[#C5A893]">{guru.jenisKelamin}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleKonseling(guru)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                          guru.tersediaKonseling !== false
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                        }`}
                        title="Klik untuk mengubah status ketersediaan di chat/janji siswa"
                      >
                        {guru.tersediaKonseling !== false ? '✅ Tersedia Konseling' : '⏸️ Tidak Ditampilkan'}
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(guru)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          guru.statusAkun === 'aktif'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {guru.statusAkun === 'aktif' ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(guru)}
                          className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
                          title="Edit Guru"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(guru.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                          title="Hapus Guru"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Add / Edit Guru Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#251B13] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8DEC8] dark:border-[#423122] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#38281B]">
              <h3 className="font-extrabold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                {editingGuru ? 'Edit Data Guru BK' : 'Tambah Guru BK Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGuru} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#5C3F28] mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Dra. Hj. Siti Rahmawati, M.Pd., Kons."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] mb-1">Jenis Kelamin</label>
                  <select
                    value={jk}
                    onChange={(e) => setJk(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                  >
                    <option value="Perempuan">Perempuan</option>
                    <option value="Laki-laki">Laki-laki</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] mb-1">NIP / NIK</label>
                  <input
                    type="text"
                    value={nipNik}
                    onChange={(e) => setNipNik(e.target.value)}
                    placeholder="NIP Pegawai"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3F28] mb-1">
                  Password {editingGuru && <span className="font-normal text-stone-400">(Kosongkan jika tidak diubah)</span>}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={editingGuru ? '••••••••' : 'Password baru'}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#5C3F28]">
                  <input
                    type="checkbox"
                    checked={tersediaKonseling}
                    onChange={(e) => setTersediaKonseling(e.target.checked)}
                    className="rounded text-[#8B5E3C] focus:ring-[#8B5E3C] accent-[#8B5E3C]"
                  />
                  <span>Tampilkan di Pilihan Chat & Janji Siswa</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8B5E3C] text-white text-xs font-bold shadow-md"
                >
                  Simpan Guru BK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteTargetId !== null}
        title="Hapus Akun Guru BK"
        message="Apakah Anda yakin ingin menghapus akun guru ini dari sistem? Seluruh akses guru akan dinonaktifkan."
        confirmLabel="Ya, Hapus"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
