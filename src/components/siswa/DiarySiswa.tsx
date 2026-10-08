import React, { useState } from 'react';
import { 
  BookHeart, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Lock, 
  Smile, 
  Frown, 
  Calendar, 
  X,
  Save
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../lib/storage';
import { DiaryEntry, MoodType } from '../../types';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { Breadcrumb } from '../common/Breadcrumb';

export const DiarySiswa: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [diaryList, setDiaryList] = useState<DiaryEntry[]>(() => 
    currentUser ? storage.getDiary(currentUser.id) : []
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState<string>('Semua');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);

  // Form Fields
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [kondisiPerasaan, setKondisiPerasaan] = useState('');
  const [mood, setMood] = useState<MoodType>('Tenang');

  // Delete Dialog State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  if (!currentUser) return null;

  const refreshDiary = () => {
    setDiaryList(storage.getDiary(currentUser.id));
  };

  const handleOpenAdd = () => {
    setEditingEntry(null);
    setJudul('');
    setIsi('');
    setKondisiPerasaan('');
    setMood('Tenang');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setJudul(entry.judul);
    setIsi(entry.isi);
    setKondisiPerasaan(entry.kondisiPerasaan);
    setMood(entry.mood);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !isi.trim()) {
      showToast('Harap lengkapi judul dan isi jurnal.', 'warning');
      return;
    }

    const newEntry: DiaryEntry = {
      id: editingEntry ? editingEntry.id : 'dry_' + Date.now(),
      idSiswa: currentUser.id,
      judul: judul.trim(),
      isi: isi.trim(),
      kondisiPerasaan: kondisiPerasaan.trim() || 'Tenang',
      mood,
      tanggal: editingEntry ? editingEntry.tanggal : new Date().toISOString(),
      groupCode: currentUser.groupCode
    };

    storage.saveDiary(newEntry);
    refreshDiary();
    setIsModalOpen(false);
    showToast(editingEntry ? 'Catatan diary berhasil diperbarui.' : 'Catatan diary berhasil disimpan.', 'success');
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      storage.deleteDiary(deleteTargetId);
      refreshDiary();
      setDeleteTargetId(null);
      showToast('Catatan diary berhasil dihapus.', 'info');
    }
  };

  const filteredEntries = diaryList.filter(d => {
    const matchesSearch = d.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.isi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = filterMood === 'Semua' || d.mood === filterMood;
    return matchesSearch && matchesMood;
  });

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Diary / Self Journal' }]} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">
              Diary / Self Journal Siswa
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EFE3D5] text-[#6A4728] dark:bg-[#32231A] dark:text-[#ECC9AC] text-[11px] font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Privat
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#8A674A] dark:text-[#BA9B81] mt-0.5">
            Ruang privat untuk mencurahkan isi hati, emosi, dan suasana hatimu setiap hari.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#8B5E3C]/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Jurnal Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9A7D66]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul atau isi jurnal..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-1 focus:ring-[#8B5E3C]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-[#8C6D53]">Filter Mood:</span>
          <select
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs font-semibold text-[#4A3525] dark:text-[#F3E9DD]"
          >
            <option value="Semua">Semua Mood</option>
            <option value="Senang">Senang</option>
            <option value="Tenang">Tenang</option>
            <option value="Cemas">Cemas</option>
            <option value="Sedih">Sedih</option>
            <option value="Marah">Marah</option>
            <option value="Bersemangat">Bersemangat</option>
          </select>
        </div>
      </div>

      {/* Diary Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#251B13] rounded-3xl border border-[#E8DEC8] dark:border-[#3E2D20] text-xs text-[#8C6D53]">
            Belum ada catatan jurnal yang sesuai.
          </div>
        ) : (
          filteredEntries.map(entry => (
            <div
              key={entry.id}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#EFE3D5] text-[#6A4728] dark:bg-[#342419] dark:text-[#ECC9AC]">
                    Mood: {entry.mood}
                  </span>
                  <h3 className="font-extrabold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                    {entry.judul}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-[#9A7D66] flex items-center gap-1 mr-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(entry.tanggal).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                  </span>
                  <button
                    onClick={() => handleOpenEdit(entry)}
                    className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
                    title="Edit Catatan"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(entry.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600"
                    title="Hapus Catatan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#8C6D53] dark:text-[#BA9B81] italic">
                Kondisi emosi: {entry.kondisiPerasaan}
              </p>

              <div className="p-4 rounded-xl bg-[#FAF5EE] dark:bg-[#2E2017] border border-[#E8DCCB] dark:border-[#443122] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] leading-relaxed whitespace-pre-wrap">
                {entry.isi}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Diary Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#251B13] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E8DEC8] dark:border-[#423122] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#38281B]">
              <h3 className="font-extrabold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                {editingEntry ? 'Edit Catatan Diary' : 'Tulis Catatan Diary Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                  Judul Catatan
                </label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Misal: Perasaan Lega Usai Ujian"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                    Mood / Suasana Hati
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value as MoodType)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD]"
                  >
                    <option value="Tenang">🌿 Tenang</option>
                    <option value="Senang">😊 Senang</option>
                    <option value="Bersemangat">🔥 Bersemangat</option>
                    <option value="Cemas">😰 Cemas</option>
                    <option value="Sedih">😢 Sedih</option>
                    <option value="Marah">😠 Marah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                    Kondisi Fisik / Emosi
                  </label>
                  <input
                    type="text"
                    value={kondisiPerasaan}
                    onChange={(e) => setKondisiPerasaan(e.target.value)}
                    placeholder="Misal: Cukup lelah, butuh istirahat"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                  Isi Curahan Hati / Refleksi
                </label>
                <textarea
                  required
                  rows={5}
                  value={isi}
                  onChange={(e) => setIsi(e.target.value)}
                  placeholder="Tuliskan apa saja yang kamu rasakan hari ini secara bebas..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#7A5B40]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white text-xs font-bold shadow-md shadow-[#8B5E3C]/20 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Jurnal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteTargetId !== null}
        title="Hapus Catatan Diary"
        message="Apakah Anda yakin ingin menghapus catatan diary ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Ya, Hapus"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
