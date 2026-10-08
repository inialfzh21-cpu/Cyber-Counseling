import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  GraduationCap, 
  Mail, 
  X, 
  Check, 
  Lock 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../lib/storage';
import { User } from '../../types';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { Breadcrumb } from '../common/Breadcrumb';

export const KelolaSiswa: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [siswaList, setSiswaList] = useState<User[]>(() =>
    storage.getUsers().filter(u => u.role === 'siswa')
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [filterKelas, setFilterKelas] = useState('Semua');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState<User | null>(null);

  // Form Fields
  const [nama, setNama] = useState('');
  const [jk, setJk] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [kelas, setKelas] = useState('X MIPA 1');

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  if (!currentUser) return null;

  const refreshList = () => {
    setSiswaList(storage.getUsers().filter(u => u.role === 'siswa'));
  };

  const kelasOptions = ['Semua', ...Array.from(new Set(siswaList.map(s => s.kelas || '-')))];

  const handleOpenAdd = () => {
    setEditingSiswa(null);
    setNama('');
    setJk('Laki-laki');
    setEmail('');
    setUsername('');
    setPassword('');
    setKelas('X MIPA 1');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (siswa: User) => {
    setEditingSiswa(siswa);
    setNama(siswa.nama);
    setJk(siswa.jenisKelamin);
    setEmail(siswa.email);
    setUsername(siswa.username);
    setPassword('');
    setKelas(siswa.kelas || '');
    setIsModalOpen(true);
  };

  const handleSaveSiswa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !email.trim() || !username.trim()) {
      showToast('Harap lengkapi semua isian wajib.', 'warning');
      return;
    }

    let passwordHash = editingSiswa ? editingSiswa.passwordHash : 'password123';
    if (password.trim()) {
      passwordHash = await storage.hashPassword(password.trim());
    }

    const item: User = {
      id: editingSiswa ? editingSiswa.id : 'usr_siswa_' + Date.now(),
      nama: nama.trim(),
      jenisKelamin: jk,
      email: email.trim(),
      username: username.trim(),
      passwordHash,
      role: 'siswa',
      kelas: kelas.trim(),
      statusAkun: editingSiswa ? editingSiswa.statusAkun : 'aktif',
      tanggalDibuat: editingSiswa ? editingSiswa.tanggalDibuat : new Date().toISOString(),
      groupCode: currentUser.groupCode,
      fotoProfil: editingSiswa?.fotoProfil || (jk === 'Perempuan' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80')
    };

    storage.saveUser(item);
    refreshList();
    setIsModalOpen(false);
    showToast(editingSiswa ? 'Data siswa berhasil diperbarui.' : 'Siswa baru berhasil ditambahkan.', 'success');
  };

  const handleToggleActive = (siswa: User) => {
    const updated: User = {
      ...siswa,
      statusAkun: siswa.statusAkun === 'aktif' ? 'nonaktif' : 'aktif'
    };
    storage.saveUser(updated);
    refreshList();
    showToast(`Akun ${siswa.nama} diubah menjadi ${updated.statusAkun}.`, 'info');
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      storage.deleteUser(deleteTargetId);
      refreshList();
      setDeleteTargetId(null);
      showToast('Akun siswa berhasil dihapus.', 'info');
    }
  };

  const filteredStudents = siswaList.filter(s => {
    const matchesSearch = s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKelas = filterKelas === 'Semua' || s.kelas === filterKelas;
    return matchesSearch && matchesKelas;
  });

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Data Siswa' }]} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">
            Kelola Data Siswa
          </h1>
          <p className="text-xs sm:text-sm text-[#8A674A] dark:text-[#BA9B81] mt-0.5">
            Daftar seluruh siswa terdaftar, status akun, dan manajemen kelas peserta didik.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#8B5E3C]/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Siswa Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#9A7D66]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, email, atau username siswa..."
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs text-[#4A3525] dark:text-[#F3E9DD]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#8C6D53]">Filter Kelas:</span>
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs font-semibold text-[#4A3525] dark:text-[#F3E9DD]"
          >
            {kelasOptions.map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white dark:bg-[#251B13] rounded-3xl border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF5EE] dark:bg-[#2E2017] border-b border-[#E8DEC8] dark:border-[#3E2D20] text-[#6A4728] dark:text-[#E2C7B0] font-bold">
                <th className="p-4">Siswa</th>
                <th className="p-4">Jenis Kelamin</th>
                <th className="p-4">Kelas</th>
                <th className="p-4">Status Akun</th>
                <th className="p-4">Tanggal Daftar</th>
                <th className="p-4 text-center">Aksi Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EAE0] dark:divide-[#3A2A1E]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-400">
                    Tidak ditemukan data siswa.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(siswa => (
                  <tr key={siswa.id} className="hover:bg-[#FAF6F0] dark:hover:bg-[#2C1E15] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={siswa.fotoProfil}
                          alt={siswa.nama}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-[#C89D7C]"
                        />
                        <div>
                          <p className="font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">{siswa.nama}</p>
                          <p className="text-[11px] text-[#8C6D53]">@{siswa.username} • {siswa.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#7A5B40] dark:text-[#C5A893]">{siswa.jenisKelamin}</td>
                    <td className="p-4 font-bold text-[#5C3F28] dark:text-[#ECC9AC]">{siswa.kelas || '-'}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(siswa)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          siswa.statusAkun === 'aktif'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {siswa.statusAkun === 'aktif' ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="p-4 text-[#8C6D53]">
                      {new Date(siswa.tanggalDibuat).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(siswa)}
                          className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
                          title="Edit Siswa"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(siswa.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                          title="Hapus Siswa"
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

      {/* Add / Edit Siswa Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#251B13] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8DEC8] dark:border-[#423122] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#38281B]">
              <h3 className="font-extrabold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                {editingSiswa ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSiswa} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#5C3F28] mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama Siswa"
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
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] mb-1">Kelas</label>
                  <input
                    type="text"
                    required
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    placeholder="Contoh: XI MIPA 2"
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
                  Password {editingSiswa && <span className="font-normal text-stone-400">(Kosongkan jika tidak diubah)</span>}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={editingSiswa ? '••••••••' : 'Password awal siswa'}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                />
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
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteTargetId !== null}
        title="Hapus Akun Siswa"
        message="Apakah Anda yakin ingin menghapus data siswa ini? Akses login dan asesmen siswa ini akan dihapus."
        confirmLabel="Ya, Hapus"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
