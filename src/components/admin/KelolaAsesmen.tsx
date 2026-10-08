import React, { useState } from 'react';
import { 
  FileCheck2, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  ArrowUpDown, 
  Layers,
  Save,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../lib/storage';
import { AssessmentQuestion, AssessmentType, AssessmentAspect } from '../../types';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { Breadcrumb } from '../common/Breadcrumb';

export const KelolaAsesmen: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [questions, setQuestions] = useState<AssessmentQuestion[]>(() =>
    storage.getQuestions()
  );

  const [selectedJenis, setSelectedJenis] = useState<string>('Semua');
  const [selectedAspek, setSelectedAspek] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AssessmentQuestion | null>(null);

  // Form Fields
  const [pertanyaan, setPertanyaan] = useState('');
  const [jenisAsesmen, setJenisAsesmen] = useState<AssessmentType>('DCM');
  const [kategori, setKategori] = useState<AssessmentAspect>('Pribadi');
  const [pilihanJawabanStr, setPilihanJawabanStr] = useState('Sering, Kadang-kadang, Tidak Pernah');
  const [bobotStr, setBobotStr] = useState('2, 1, 0');
  const [urutan, setUrutan] = useState(1);
  const [statusAktif, setStatusAktif] = useState(true);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  if (!currentUser) return null;

  const refreshList = () => {
    setQuestions(storage.getQuestions());
  };

  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setPertanyaan('');
    setJenisAsesmen('DCM');
    setKategori('Pribadi');
    setPilihanJawabanStr('Sering, Kadang-kadang, Tidak Pernah');
    setBobotStr('2, 1, 0');
    setUrutan(questions.length + 1);
    setStatusAktif(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (q: AssessmentQuestion) => {
    setEditingQuestion(q);
    setPertanyaan(q.pertanyaan);
    setJenisAsesmen(q.jenisAsesmen);
    setKategori(q.kategori);
    setPilihanJawabanStr(q.pilihanJawaban.join(', '));
    setBobotStr(q.bobotNilai ? q.bobotNilai.join(', ') : '1, 0');
    setUrutan(q.urutan);
    setStatusAktif(q.statusAktif);
    setIsModalOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pertanyaan.trim()) {
      showToast('Harap tuliskan butir pertanyaan.', 'warning');
      return;
    }

    const options = pilihanJawabanStr.split(',').map(s => s.trim()).filter(Boolean);
    const bobot = bobotStr.split(',').map(s => parseInt(s.trim(), 10) || 0);

    if (options.length === 0) {
      showToast('Harap tentukan pilihan jawaban minimal 2 opsi.', 'warning');
      return;
    }

    const item: AssessmentQuestion = {
      id: editingQuestion ? editingQuestion.id : 'q_' + Date.now(),
      jenisAsesmen,
      kategori,
      pertanyaan: pertanyaan.trim(),
      pilihanJawaban: options,
      bobotNilai: bobot,
      urutan: Number(urutan) || 1,
      statusAktif
    };

    storage.saveQuestion(item);
    refreshList();
    setIsModalOpen(false);
    showToast(editingQuestion ? 'Butir pertanyaan berhasil diperbarui.' : 'Pertanyaan baru berhasil ditambahkan.', 'success');
  };

  const handleToggleAktif = (q: AssessmentQuestion) => {
    const updated: AssessmentQuestion = {
      ...q,
      statusAktif: !q.statusAktif
    };
    storage.saveQuestion(updated);
    refreshList();
    showToast(`Status pertanyaan diubah menjadi ${updated.statusAktif ? 'Aktif' : 'Nonaktif'}.`, 'info');
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      storage.deleteQuestion(deleteTargetId);
      refreshList();
      setDeleteTargetId(null);
      showToast('Butir soal berhasil dihapus dari bank asesmen.', 'info');
    }
  };

  const filteredQuestions = questions
    .filter(q => {
      const matchSearch = q.pertanyaan.toLowerCase().includes(searchQuery.toLowerCase());
      const matchJenis = selectedJenis === 'Semua' || q.jenisAsesmen === selectedJenis;
      const matchAspek = selectedAspek === 'Semua' || q.kategori === selectedAspek;
      return matchSearch && matchJenis && matchAspek;
    })
    .sort((a, b) => a.urutan - b.urutan);

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Pertanyaan Asesmen' }]} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">
            Kelola Instrumen & Bank Soal Asesmen BK
          </h1>
          <p className="text-xs sm:text-sm text-[#8A674A] dark:text-[#BA9B81] mt-0.5">
            Tambah, edit, sesuaikan bobot, ubah urutan, dan kelola DCM, AUM, serta Sosiometri tanpa mengubah kode.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#8B5E3C]/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Butir Soal Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#9A7D66]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kata kunci pernyataan..."
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-[#4A3525] dark:text-[#F3E9DD]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedJenis}
            onChange={(e) => setSelectedJenis(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] font-semibold"
          >
            <option value="Semua">Semua Instrumen</option>
            <option value="DCM">DCM</option>
            <option value="AUM">AUM</option>
            <option value="Sosiometri">Sosiometri</option>
          </select>

          <select
            value={selectedAspek}
            onChange={(e) => setSelectedAspek(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] font-semibold"
          >
            <option value="Semua">Semua Aspek</option>
            <option value="Pribadi">Pribadi</option>
            <option value="Sosial">Sosial</option>
            <option value="Belajar">Belajar</option>
            <option value="Karier">Karier</option>
          </select>

          <span className="font-bold text-[#8C6D53] ml-2">
            Total: {filteredQuestions.length} butir
          </span>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#251B13] rounded-3xl border border-[#E8DEC8] dark:border-[#3E2D20] text-xs text-[#8C6D53]">
            Tidak ada pertanyaan dalam kategori ini.
          </div>
        ) : (
          filteredQuestions.map(q => (
            <div
              key={q.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                q.statusAktif
                  ? 'bg-white dark:bg-[#251B13] border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs'
                  : 'bg-[#FAF8F5] dark:bg-[#1C1510] border-[#EADCCB] opacity-60'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#FAF5EE] dark:bg-[#342419] text-[#8B5E3C] font-black text-xs flex items-center justify-center">
                    {q.urutan}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EFE3D5] text-[#6A4728] dark:bg-[#342419] dark:text-[#ECC9AC]">
                    {q.jenisAsesmen} • {q.kategori}
                  </span>
                  <button
                    onClick={() => handleToggleAktif(q)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      q.statusAktif
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {q.statusAktif ? 'Aktif Digunakan' : 'Nonaktif'}
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-[#4A3525] dark:text-[#F3E9DD] leading-relaxed">
                  "{q.pertanyaan}"
                </p>

                <p className="text-[11px] text-[#8C6D53]">
                  Pilihan Jawaban: {q.pilihanJawaban.join(' | ')}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(q)}
                  className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800"
                  title="Edit Butir Pertanyaan"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTargetId(q.id)}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Hapus Butir Pertanyaan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#251B13] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E8DEC8] dark:border-[#423122] max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#38281B]">
              <h3 className="font-extrabold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                {editingQuestion ? 'Edit Butir Pertanyaan' : 'Tambah Pertanyaan Asesmen Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] mb-1">Jenis Instrumen</label>
                  <select
                    value={jenisAsesmen}
                    onChange={(e) => setJenisAsesmen(e.target.value as AssessmentType)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                  >
                    <option value="DCM">DCM (Daftar Cek Masalah)</option>
                    <option value="AUM">AUM (Alat Ungkap Masalah)</option>
                    <option value="Sosiometri">Sosiometri</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] mb-1">Kategori / Aspek BK</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as AssessmentAspect)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                  >
                    <option value="Pribadi">Pribadi</option>
                    <option value="Sosial">Sosial</option>
                    <option value="Belajar">Belajar</option>
                    <option value="Karier">Karier</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3F28] mb-1">Teks Pernyataan / Pertanyaan</label>
                <textarea
                  required
                  rows={3}
                  value={pertanyaan}
                  onChange={(e) => setPertanyaan(e.target.value)}
                  placeholder="Tuliskan pernyataan asesmen..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3F28] mb-1">
                  Pilihan Jawaban (Pisahkan dengan tanda koma)
                </label>
                <input
                  type="text"
                  required
                  value={pilihanJawabanStr}
                  onChange={(e) => setPilihanJawabanStr(e.target.value)}
                  placeholder="Contoh: Sering, Kadang-kadang, Tidak Pernah"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] mb-1">Bobot Nilai (Koma)</label>
                  <input
                    type="text"
                    value={bobotStr}
                    onChange={(e) => setBobotStr(e.target.value)}
                    placeholder="Contoh: 2, 1, 0"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] mb-1">Nomor Urut</label>
                  <input
                    type="number"
                    min="1"
                    value={urutan}
                    onChange={(e) => setUrutan(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#5C3F28]">
                  <input
                    type="checkbox"
                    checked={statusAktif}
                    onChange={(e) => setStatusAktif(e.target.checked)}
                    className="rounded text-[#8B5E3C] focus:ring-[#8B5E3C] accent-[#8B5E3C]"
                  />
                  <span>Aktifkan Pertanyaan Ini di Form Siswa</span>
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
                  Simpan Pertanyaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteTargetId !== null}
        title="Hapus Butir Pertanyaan"
        message="Apakah Anda yakin ingin menghapus butir pertanyaan asesmen ini?"
        confirmLabel="Ya, Hapus"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
