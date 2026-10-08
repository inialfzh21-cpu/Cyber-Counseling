import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Calendar, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Filter, 
  X,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../lib/storage';
import { TodoItem, PriorityLevel } from '../../types';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { Breadcrumb } from '../common/Breadcrumb';

export const TodoListSiswa: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [todos, setTodos] = useState<TodoItem[]>(() =>
    currentUser ? storage.getTodos(currentUser.id) : []
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kegiatan, setKegiatan] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [waktu, setWaktu] = useState('16:00');
  const [prioritas, setPrioritas] = useState<PriorityLevel>('Sedang');

  const [filterStatus, setFilterStatus] = useState<'semua' | 'belum' | 'selesai'>('semua');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  if (!currentUser) return null;

  const refreshTodos = () => {
    setTodos(storage.getTodos(currentUser.id));
  };

  const handleToggleTodo = (id: string) => {
    const target = todos.find(t => t.id === id);
    if (target) {
      const updated: TodoItem = {
        ...target,
        status: target.status === 'belum' ? 'selesai' : 'belum'
      };
      storage.saveTodo(updated);
      refreshTodos();
    }
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kegiatan.trim()) {
      showToast('Harap isi nama kegiatan.', 'warning');
      return;
    }

    const newTodo: TodoItem = {
      id: 'td_' + Date.now(),
      idSiswa: currentUser.id,
      kegiatan: kegiatan.trim(),
      tanggal,
      waktu,
      prioritas,
      status: 'belum',
      groupCode: currentUser.groupCode
    };

    storage.saveTodo(newTodo);
    refreshTodos();
    setIsModalOpen(false);
    setKegiatan('');
    showToast('Kegiatan baru berhasil ditambahkan ke To-Do List.', 'success');
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      storage.deleteTodo(deleteTargetId);
      refreshTodos();
      setDeleteTargetId(null);
      showToast('Kegiatan berhasil dihapus.', 'info');
    }
  };

  const filteredTodos = todos.filter(t => {
    if (filterStatus === 'belum') return t.status === 'belum';
    if (filterStatus === 'selesai') return t.status === 'selesai';
    return true;
  });

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayCount = todos.filter(t => t.tanggal === todayStr && t.status === 'belum').length;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'To-Do List' }]} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">
            To-Do List & Agenda Harian Siswa
          </h1>
          <p className="text-xs sm:text-sm text-[#8A674A] dark:text-[#BA9B81] mt-0.5">
            Susun skala prioritas tugas belajar dan kegiatan pengembangan dirimu.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#8B5E3C]/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kegiatan</span>
        </button>
      </div>

      {/* Filter and Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs">
          <span className="text-xs font-semibold text-[#8C6D53]">Agenda Hari Ini</span>
          <p className="text-2xl font-black text-[#4A3525] dark:text-[#F3E9DD] mt-1">{todayCount}</p>
          <p className="text-[11px] text-[#A08168]">Kegiatan belum selesai</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs">
          <span className="text-xs font-semibold text-[#8C6D53]">Total Tugas Selesai</span>
          <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
            {todos.filter(t => t.status === 'selesai').length}
          </p>
          <p className="text-[11px] text-[#A08168]">Dari total {todos.length} tugas</p>
        </div>

        {/* Filter buttons */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs flex flex-col justify-center">
          <span className="text-xs font-semibold text-[#8C6D53] mb-2">Filter Tampilan:</span>
          <div className="flex gap-1.5 text-xs font-bold">
            <button
              onClick={() => setFilterStatus('semua')}
              className={`flex-1 py-1.5 rounded-lg ${filterStatus === 'semua' ? 'bg-[#8B5E3C] text-white' : 'bg-[#FAF5EE] dark:bg-[#342419] text-[#7A5B40]'}`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterStatus('belum')}
              className={`flex-1 py-1.5 rounded-lg ${filterStatus === 'belum' ? 'bg-[#8B5E3C] text-white' : 'bg-[#FAF5EE] dark:bg-[#342419] text-[#7A5B40]'}`}
            >
              Belum
            </button>
            <button
              onClick={() => setFilterStatus('selesai')}
              className={`flex-1 py-1.5 rounded-lg ${filterStatus === 'selesai' ? 'bg-[#8B5E3C] text-white' : 'bg-[#FAF5EE] dark:bg-[#342419] text-[#7A5B40]'}`}
            >
              Selesai
            </button>
          </div>
        </div>
      </div>

      {/* Todo Items List */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#251B13] rounded-3xl border border-[#E8DEC8] dark:border-[#3E2D20] text-xs text-[#8C6D53]">
            Tidak ada kegiatan dalam daftar ini.
          </div>
        ) : (
          filteredTodos.map(todo => {
            const isDone = todo.status === 'selesai';
            return (
              <div
                key={todo.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  isDone
                    ? 'bg-[#FAF8F5] dark:bg-[#1E1712] border-[#EADCCB] opacity-75'
                    : 'bg-white dark:bg-[#251B13] border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs hover:border-[#8B5E3C]'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggleTodo(todo.id)}
                    className="shrink-0 text-[#8B5E3C]"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-400 hover:text-[#8B5E3C]" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className={`text-xs sm:text-sm font-bold ${
                      isDone
                        ? 'line-through text-stone-400 dark:text-stone-500'
                        : 'text-[#4A3525] dark:text-[#F3E9DD]'
                    }`}>
                      {todo.kegiatan}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#8C6D53] mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {todo.tanggal}
                      </span>
                      {todo.waktu && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {todo.waktu}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        todo.prioritas === 'Tinggi'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : todo.prioritas === 'Sedang'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}>
                        Prioritas {todo.prioritas}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setDeleteTargetId(todo.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                  title="Hapus Kegiatan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#251B13] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8DEC8] dark:border-[#423122] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#38281B]">
              <h3 className="font-extrabold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                Tambah Kegiatan To-Do Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTodo} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                  Nama Kegiatan / Tugas
                </label>
                <input
                  type="text"
                  required
                  value={kegiatan}
                  onChange={(e) => setKegiatan(e.target.value)}
                  placeholder="Misal: Latihan Soal Matematika Bab 3"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                    Waktu
                  </label>
                  <input
                    type="time"
                    value={waktu}
                    onChange={(e) => setWaktu(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                  Skala Prioritas
                </label>
                <select
                  value={prioritas}
                  onChange={(e) => setPrioritas(e.target.value as PriorityLevel)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD]"
                >
                  <option value="Tinggi">Tinggi (Penting & Mendesak)</option>
                  <option value="Sedang">Sedang (Terjadwal)</option>
                  <option value="Rendah">Rendah (Fleksibel)</option>
                </select>
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
                  className="px-5 py-2.5 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white text-xs font-bold shadow-md shadow-[#8B5E3C]/20"
                >
                  Simpan Kegiatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteTargetId !== null}
        title="Hapus Kegiatan"
        message="Apakah Anda yakin ingin menghapus kegiatan ini dari to-do list?"
        confirmLabel="Ya, Hapus"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
