import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Trash2, 
  X, 
  Save, 
  AlertCircle,
  FileText,
  BarChart3,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../lib/storage';
import { 
  BkProgram, 
  BkServiceRecord, 
  BkServiceType, 
  BkServiceStatus 
} from '../../types';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { Breadcrumb } from '../common/Breadcrumb';

interface ManajemenBKProps {
  initialSubmenu?: 'program' | 'catatan' | 'tindak_lanjut' | 'rekap';
}

export const ManajemenBK: React.FC<ManajemenBKProps> = ({ 
  initialSubmenu = 'program' 
}) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'program' | 'catatan' | 'tindak_lanjut' | 'rekap'>(initialSubmenu);

  // Data states
  const programs = storage.getPrograms();
  const services = storage.getServices();
  const students = storage.getUsersByGroup().filter(u => u.role === 'siswa');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJenis, setFilterJenis] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');

  // Program Modal State
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<BkProgram | null>(null);
  const [progNama, setProgNama] = useState('');
  const [progJenis, setProgJenis] = useState<BkServiceType>('Bimbingan klasikal');
  const [progSasaran, setProgSasaran] = useState('Semua Siswa Kelas X');
  const [progTanggal, setProgTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [progTujuan, setProgTujuan] = useState('');
  const [progMateri, setProgMateri] = useState('');
  const [progKeterangan, setProgKeterangan] = useState('');

  // Service Record Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<BkServiceRecord | null>(null);
  const [srvSiswaId, setSrvSiswaId] = useState(students[0]?.id || '');
  const [srvTanggal, setSrvTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [srvJenis, setSrvJenis] = useState<BkServiceType>('Konseling individual');
  const [srvTujuan, setSrvTujuan] = useState('');
  const [srvPermasalahan, setSrvPermasalahan] = useState('');
  const [srvTindakan, setSrvTindakan] = useState('');
  const [srvHasil, setSrvHasil] = useState('');
  const [srvRencanaTindakLanjut, setSrvRencanaTindakLanjut] = useState('');
  const [srvTanggalTindakLanjut, setSrvTanggalTindakLanjut] = useState('');
  const [srvCatatanInternal, setSrvCatatanInternal] = useState('');
  const [srvStatus, setSrvStatus] = useState<BkServiceStatus>('Selesai');

  // Follow-up Update Modal State
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [targetFollowUp, setTargetFollowUp] = useState<BkServiceRecord | null>(null);
  const [fuStatus, setFuStatus] = useState<'Belum Selesai' | 'Dalam Proses' | 'Selesai'>('Dalam Proses');
  const [fuTanggal, setFuTanggal] = useState('');
  const [fuCatatan, setFuCatatan] = useState('');

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'program' | 'service'; id: string } | null>(null);

  if (!currentUser) return null;

  // Program Handlers
  const handleOpenAddProgram = () => {
    setEditingProgram(null);
    setProgNama('');
    setProgJenis('Bimbingan klasikal');
    setProgSasaran('Semua Siswa');
    setProgTanggal(new Date().toISOString().slice(0, 10));
    setProgTujuan('');
    setProgMateri('');
    setProgKeterangan('');
    setIsProgramModalOpen(true);
  };

  const handleOpenEditProgram = (p: BkProgram) => {
    setEditingProgram(p);
    setProgNama(p.namaProgram);
    setProgJenis(p.jenisLayanan);
    setProgSasaran(p.sasaran);
    setProgTanggal(p.tanggalPelaksanaan);
    setProgTujuan(p.tujuanLayanan);
    setProgMateri(p.materiLayanan);
    setProgKeterangan(p.keterangan);
    setIsProgramModalOpen(true);
  };

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progNama.trim() || !progTujuan.trim()) {
      showToast('Harap lengkapi nama dan tujuan program.', 'warning');
      return;
    }

    const item: BkProgram = {
      id: editingProgram ? editingProgram.id : 'prg_' + Date.now(),
      namaProgram: progNama.trim(),
      jenisLayanan: progJenis,
      sasaran: progSasaran.trim(),
      tanggalPelaksanaan: progTanggal,
      tujuanLayanan: progTujuan.trim(),
      materiLayanan: progMateri.trim(),
      keterangan: progKeterangan.trim(),
      groupCode: currentUser.groupCode
    };

    storage.saveProgram(item);
    setIsProgramModalOpen(false);
    showToast('Program layanan BK berhasil disimpan.', 'success');
  };

  // Service Record Handlers
  const handleOpenAddService = () => {
    setEditingService(null);
    setSrvSiswaId(students[0]?.id || '');
    setSrvTanggal(new Date().toISOString().slice(0, 10));
    setSrvJenis('Konseling individual');
    setSrvTujuan('');
    setSrvPermasalahan('');
    setSrvTindakan('');
    setSrvHasil('');
    setSrvRencanaTindakLanjut('');
    setSrvTanggalTindakLanjut('');
    setSrvCatatanInternal('');
    setSrvStatus('Selesai');
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (s: BkServiceRecord) => {
    setEditingService(s);
    setSrvSiswaId(s.idSiswa);
    setSrvTanggal(s.tanggal);
    setSrvJenis(s.jenisLayanan);
    setSrvTujuan(s.tujuan);
    setSrvPermasalahan(s.permasalahan);
    setSrvTindakan(s.tindakan);
    setSrvHasil(s.hasilLayanan);
    setSrvRencanaTindakLanjut(s.rencanaTindakLanjut || '');
    setSrvTanggalTindakLanjut(s.tanggalTindakLanjut || '');
    setSrvCatatanInternal(s.catatanInternal || '');
    setSrvStatus(s.status);
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === srvSiswaId);
    if (!student) {
      showToast('Pilih siswa terlebih dahulu.', 'warning');
      return;
    }

    const item: BkServiceRecord = {
      id: editingService ? editingService.id : 'srv_' + Date.now(),
      idSiswa: student.id,
      namaSiswa: student.nama,
      kelasSiswa: student.kelas,
      idGuru: currentUser.id,
      namaGuru: currentUser.nama,
      tanggal: srvTanggal,
      jenisLayanan: srvJenis,
      tujuan: srvTujuan.trim(),
      permasalahan: srvPermasalahan.trim(),
      tindakan: srvTindakan.trim(),
      hasilLayanan: srvHasil.trim(),
      rencanaTindakLanjut: srvRencanaTindakLanjut.trim(),
      tanggalTindakLanjut: srvTanggalTindakLanjut,
      statusTindakLanjut: srvStatus === 'Membutuhkan tindak lanjut' ? 'Dalam Proses' : 'Selesai',
      catatanInternal: srvCatatanInternal.trim(),
      status: srvStatus,
      tanggalDibuat: editingService ? editingService.tanggalDibuat : new Date().toISOString(),
      groupCode: currentUser.groupCode
    };

    storage.saveService(item);
    setIsServiceModalOpen(false);
    showToast('Catatan layanan BK berhasil disimpan.', 'success');
  };

  // Follow-up Handlers
  const handleOpenUpdateFollowUp = (service: BkServiceRecord) => {
    setTargetFollowUp(service);
    setFuStatus(service.statusTindakLanjut || 'Dalam Proses');
    setFuTanggal(service.tanggalTindakLanjut || new Date().toISOString().slice(0, 10));
    setFuCatatan(service.rencanaTindakLanjut || '');
    setIsFollowUpModalOpen(true);
  };

  const handleSaveFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetFollowUp) return;

    const updated: BkServiceRecord = {
      ...targetFollowUp,
      statusTindakLanjut: fuStatus,
      tanggalTindakLanjut: fuTanggal,
      rencanaTindakLanjut: fuCatatan,
      status: fuStatus === 'Selesai' ? 'Selesai' : 'Membutuhkan tindak lanjut'
    };

    storage.saveService(updated);
    setIsFollowUpModalOpen(false);
    showToast('Catatan tindak lanjut berhasil diperbarui.', 'success');
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      if (deleteTarget.type === 'program') {
        storage.deleteProgram(deleteTarget.id);
        showToast('Program BK berhasil dihapus.', 'info');
      } else {
        storage.deleteService(deleteTarget.id);
        showToast('Catatan layanan BK berhasil dihapus.', 'info');
      }
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Manajemen BK' }, { label: activeTab === 'program' ? 'Program/Layanan BK' : activeTab === 'catatan' ? 'Catatan Layanan BK' : activeTab === 'tindak_lanjut' ? 'Tindak Lanjut Siswa' : 'Rekap Layanan BK' }]} />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">
            Pusat Manajemen Layanan Bimbingan dan Konseling
          </h1>
          <p className="text-xs sm:text-sm text-[#8A674A] dark:text-[#BA9B81] mt-0.5">
            Pengelolaan program, administrasi layanan, buku catatan kasus, dan tindak lanjut siswa.
          </p>
        </div>

        {/* Action Button depending on tab */}
        {activeTab === 'program' && (
          <button
            onClick={handleOpenAddProgram}
            className="px-5 py-2.5 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#8B5E3C]/20 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Program BK</span>
          </button>
        )}
        {activeTab === 'catatan' && (
          <button
            onClick={handleOpenAddService}
            className="px-5 py-2.5 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#8B5E3C]/20 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Catatan Layanan</span>
          </button>
        )}
      </div>

      {/* Submenu Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[#FAF5EE] dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20]">
        <button
          onClick={() => setActiveTab('program')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'program'
              ? 'bg-[#8B5E3C] text-white shadow-xs'
              : 'text-[#7D5C40] dark:text-[#C5A893]'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>1. Program/Layanan BK ({programs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('catatan')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'catatan'
              ? 'bg-[#8B5E3C] text-white shadow-xs'
              : 'text-[#7D5C40] dark:text-[#C5A893]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>2. Catatan Layanan BK ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tindak_lanjut')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'tindak_lanjut'
              ? 'bg-[#8B5E3C] text-white shadow-xs'
              : 'text-[#7D5C40] dark:text-[#C5A893]'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>3. Tindak Lanjut Siswa ({services.filter(s => s.status === 'Membutuhkan tindak lanjut').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rekap')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'rekap'
              ? 'bg-[#8B5E3C] text-white shadow-xs'
              : 'text-[#7D5C40] dark:text-[#C5A893]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>4. Rekap Layanan BK</span>
        </button>
      </div>

      {/* TAB 1: PROGRAM / LAYANAN BK */}
      {activeTab === 'program' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.length === 0 ? (
              <div className="col-span-2 py-16 text-center bg-white dark:bg-[#251B13] rounded-3xl border border-[#E8DEC8] dark:border-[#3E2D20] text-xs text-[#8C6D53]">
                Belum ada program BK yang ditambahkan.
              </div>
            ) : (
              programs.map(prog => (
                <div
                  key={prog.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EFE3D5] text-[#6A4728] dark:bg-[#342419] dark:text-[#ECC9AC]">
                        {prog.jenisLayanan}
                      </span>
                      <h3 className="font-extrabold text-base text-[#4A3525] dark:text-[#F3E9DD] mt-1.5">
                        {prog.namaProgram}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenEditProgram(prog)}
                        className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
                        title="Edit Program"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: 'program', id: prog.id })}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600"
                        title="Hapus Program"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-[#7A5B40] dark:text-[#B6967E] flex flex-wrap gap-4">
                    <span>Sasaran: <strong>{prog.sasaran}</strong></span>
                    <span>Pelaksanaan: <strong>{prog.tanggalPelaksanaan}</strong></span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF5EE] dark:bg-[#2E2017] border border-[#E8DCCB] dark:border-[#443122] text-xs text-[#523C2B] dark:text-[#D5BCA9] space-y-1">
                    <p><strong>Tujuan:</strong> {prog.tujuanLayanan}</p>
                    {prog.materiLayanan && <p><strong>Materi:</strong> {prog.materiLayanan}</p>}
                    {prog.keterangan && <p className="italic text-[#8C6D53]">Keterangan: {prog.keterangan}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CATATAN LAYANAN BK */}
      {activeTab === 'catatan' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {services.length === 0 ? (
              <div className="py-16 text-center bg-white dark:bg-[#251B13] rounded-3xl border border-[#E8DEC8] dark:border-[#3E2D20] text-xs text-[#8C6D53]">
                Belum ada catatan layanan BK yang tercatat.
              </div>
            ) : (
              services.map(srv => (
                <div
                  key={srv.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm sm:text-base text-[#4A3525] dark:text-[#F3E9DD]">
                        {srv.namaSiswa} ({srv.kelasSiswa || '-'})
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EFE3D5] text-[#6A4728] dark:bg-[#342419] dark:text-[#ECC9AC] font-bold">
                        {srv.jenisLayanan}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        srv.status === 'Selesai'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : srv.status === 'Membutuhkan tindak lanjut'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {srv.status}
                      </span>

                      <button
                        onClick={() => handleOpenEditService(srv)}
                        className="p-1 rounded-lg text-stone-500 hover:bg-stone-100"
                        title="Edit Layanan"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: 'service', id: srv.id })}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-50"
                        title="Hapus Layanan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-[#FAF5EE] dark:bg-[#2E2017] p-4 rounded-xl border border-[#E8DCCB] dark:border-[#443122]">
                    <div>
                      <p><strong>Tanggal Layanan:</strong> {srv.tanggal}</p>
                      <p className="mt-1"><strong>Konselor:</strong> {srv.namaGuru}</p>
                      <p className="mt-1"><strong>Permasalahan:</strong> {srv.permasalahan}</p>
                      <p className="mt-1"><strong>Tujuan:</strong> {srv.tujuan}</p>
                    </div>
                    <div>
                      <p><strong>Tindakan yang Diberikan:</strong> {srv.tindakan}</p>
                      <p className="mt-1"><strong>Hasil Layanan:</strong> {srv.hasilLayanan}</p>
                      {srv.rencanaTindakLanjut && (
                        <p className="mt-1 text-rose-700 dark:text-rose-400">
                          <strong>Rencana Tindak Lanjut:</strong> {srv.rencanaTindakLanjut} ({srv.tanggalTindakLanjut || '-'})
                        </p>
                      )}
                      {srv.catatanInternal && (
                        <p className="mt-1 italic text-stone-500">
                          <strong>Catatan Internal:</strong> {srv.catatanInternal}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: TINDAK LANJUT SISWA */}
      {activeTab === 'tindak_lanjut' && (
        <div className="space-y-4">
          <p className="text-xs text-[#8A674A] dark:text-[#BA9B81]">
            Daftar siswa yang memerlukan evaluasi, monitoring lanjutan, atau pendampingan intensif:
          </p>

          <div className="space-y-3">
            {services.filter(s => s.status === 'Membutuhkan tindak lanjut').length === 0 ? (
              <div className="py-16 text-center bg-white dark:bg-[#251B13] rounded-3xl border border-[#E8DEC8] dark:border-[#3E2D20] text-xs text-[#8C6D53]">
                Tidak ada siswa yang membutuhkan tindak lanjut saat ini. Semua layanan terselesaikan.
              </div>
            ) : (
              services.filter(s => s.status === 'Membutuhkan tindak lanjut').map(srv => (
                <div
                  key={srv.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#251B13] border-l-4 border-l-rose-600 border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                        {srv.namaSiswa} ({srv.kelasSiswa})
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                        {srv.statusTindakLanjut || 'Dalam Proses'}
                      </span>
                    </div>
                    <p className="text-xs text-[#7A5B40]">
                      Layanan Asal: {srv.jenisLayanan} • Tanggal: {srv.tanggal}
                    </p>
                    <p className="text-xs text-[#523C2B] dark:text-[#D5BCA9] font-medium bg-[#FAF5EE] dark:bg-[#2E2017] p-2.5 rounded-lg border border-[#E8DCCB] dark:border-[#443122]">
                      <strong>Rencana Aksi:</strong> {srv.rencanaTindakLanjut || 'Monitoring harian berkala'}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenUpdateFollowUp(srv)}
                    className="px-4 py-2 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white text-xs font-bold shadow-sm shrink-0"
                  >
                    Perbarui Tindak Lanjut
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: REKAP LAYANAN BK */}
      {activeTab === 'rekap' && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs">
              <span className="text-xs font-semibold text-[#8C6D53]">Total Layanan</span>
              <p className="text-2xl font-black text-[#4A3525] dark:text-[#F3E9DD] mt-1">{services.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs">
              <span className="text-xs font-semibold text-[#8C6D53]">Siswa Terlayani</span>
              <p className="text-2xl font-black text-[#4A3525] dark:text-[#F3E9DD] mt-1">
                {new Set(services.map(s => s.idSiswa)).size} Siswa
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs">
              <span className="text-xs font-semibold text-[#8C6D53]">Layanan Selesai</span>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                {services.filter(s => s.status === 'Selesai').length}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs">
              <span className="text-xs font-semibold text-[#8C6D53]">Tindak Lanjut Aktif</span>
              <p className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-1">
                {services.filter(s => s.status === 'Membutuhkan tindak lanjut').length}
              </p>
            </div>
          </div>

          {/* Simple Visual Breakdown Chart by Service Type */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-[#4A3525] dark:text-[#F3E9DD]">
              Distribusi Layanan Berdasarkan Jenis
            </h3>

            <div className="space-y-3">
              {[
                'Konseling individual',
                'Konseling kelompok',
                'Bimbingan klasikal',
                'Bimbingan kelompok',
                'Perencanaan individual',
                'Layanan responsif',
                'Layanan dasar',
                'Dukungan sistem'
              ].map(type => {
                const count = services.filter(s => s.jenisLayanan === type).length;
                const percentage = services.length > 0 ? (count / services.length) * 100 : 0;
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[#6A4728] dark:text-[#D1B8A5]">
                      <span>{type}</span>
                      <span>{count} sesi ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="w-full bg-[#FAF5EE] dark:bg-[#342419] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#8B5E3C] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, count > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Program Modal */}
      {isProgramModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#251B13] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E8DEC8] dark:border-[#423122] max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#38281B]">
              <h3 className="font-extrabold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                {editingProgram ? 'Edit Program Layanan BK' : 'Tambah Program Layanan BK'}
              </h3>
              <button onClick={() => setIsProgramModalOpen(false)} className="text-stone-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#5C3F28] mb-1">Nama Program</label>
                <input
                  type="text"
                  required
                  value={progNama}
                  onChange={(e) => setProgNama(e.target.value)}
                  placeholder="Contoh: Bimbingan Klasikal Eksplorasi Karier"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] mb-1">Jenis Layanan</label>
                  <select
                    value={progJenis}
                    onChange={(e) => setProgJenis(e.target.value as BkServiceType)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD]"
                  >
                    <option value="Bimbingan klasikal">Bimbingan klasikal</option>
                    <option value="Bimbingan kelompok">Bimbingan kelompok</option>
                    <option value="Konseling individual">Konseling individual</option>
                    <option value="Konseling kelompok">Konseling kelompok</option>
                    <option value="Layanan dasar">Layanan dasar</option>
                    <option value="Layanan responsif">Layanan responsif</option>
                    <option value="Perencanaan individual">Perencanaan individual</option>
                    <option value="Dukungan sistem">Dukungan sistem</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] mb-1">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    required
                    value={progTanggal}
                    onChange={(e) => setProgTanggal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3F28] mb-1">Sasaran Siswa / Kelas</label>
                <input
                  type="text"
                  required
                  value={progSasaran}
                  onChange={(e) => setProgSasaran(e.target.value)}
                  placeholder="Contoh: Siswa Kelas XI MIPA"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3F28] mb-1">Tujuan Layanan</label>
                <textarea
                  required
                  rows={2}
                  value={progTujuan}
                  onChange={(e) => setProgTujuan(e.target.value)}
                  placeholder="Tujuan yang diharapkan tercapai..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3F28] mb-1">Materi Layanan</label>
                <textarea
                  rows={2}
                  value={progMateri}
                  onChange={(e) => setProgMateri(e.target.value)}
                  placeholder="Rangkuman pokok materi..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProgramModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8B5E3C] text-white text-xs font-bold shadow-md"
                >
                  Simpan Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Record Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#251B13] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E8DEC8] dark:border-[#423122] max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#38281B]">
              <h3 className="font-extrabold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                {editingService ? 'Edit Catatan Layanan BK' : 'Buat Catatan Layanan BK'}
              </h3>
              <button onClick={() => setIsServiceModalOpen(false)} className="text-stone-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#5C3F28] mb-1">Pilih Siswa</label>
                <select
                  value={srvSiswaId}
                  onChange={(e) => setSrvSiswaId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                >
                  {students.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.nama} ({st.kelas || 'Siswa'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] mb-1">Tanggal Layanan</label>
                  <input
                    type="date"
                    required
                    value={srvTanggal}
                    onChange={(e) => setSrvTanggal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] mb-1">Jenis Layanan</label>
                  <select
                    value={srvJenis}
                    onChange={(e) => setSrvJenis(e.target.value as BkServiceType)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                  >
                    <option value="Konseling individual">Konseling individual</option>
                    <option value="Konseling kelompok">Konseling kelompok</option>
                    <option value="Perencanaan individual">Perencanaan individual</option>
                    <option value="Layanan responsif">Layanan responsif</option>
                    <option value="Layanan dasar">Layanan dasar</option>
                    <option value="Bimbingan kelompok">Bimbingan kelompok</option>
                    <option value="Bimbingan klasikal">Bimbingan klasikal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3F28] mb-1">Permasalahan / Kebutuhan</label>
                <textarea
                  required
                  rows={2}
                  value={srvPermasalahan}
                  onChange={(e) => setSrvPermasalahan(e.target.value)}
                  placeholder="Uraian masalah siswa..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3F28] mb-1">Tujuan Layanan</label>
                <input
                  type="text"
                  required
                  value={srvTujuan}
                  onChange={(e) => setSrvTujuan(e.target.value)}
                  placeholder="Tujuan bimbingan..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3F28] mb-1">Tindakan / Layanan yang Diberikan</label>
                <textarea
                  required
                  rows={2}
                  value={srvTindakan}
                  onChange={(e) => setSrvTindakan(e.target.value)}
                  placeholder="Pendekatan atau teknik konseling..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3F28] mb-1">Hasil Layanan</label>
                <textarea
                  required
                  rows={2}
                  value={srvHasil}
                  onChange={(e) => setSrvHasil(e.target.value)}
                  placeholder="Hasil capaian sesi..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] mb-1">Status Layanan</label>
                  <select
                    value={srvStatus}
                    onChange={(e) => setSrvStatus(e.target.value as BkServiceStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                  >
                    <option value="Selesai">Selesai</option>
                    <option value="Membutuhkan tindak lanjut">Membutuhkan tindak lanjut</option>
                    <option value="Sedang berlangsung">Sedang berlangsung</option>
                    <option value="Terjadwal">Terjadwal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] mb-1">Rencana Tindak Lanjut</label>
                  <input
                    type="text"
                    value={srvRencanaTindakLanjut}
                    onChange={(e) => setSrvRencanaTindakLanjut(e.target.value)}
                    placeholder="Langkah evaluasi lanjutan..."
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3F28] mb-1">Catatan Internal Konselor</label>
                <input
                  type="text"
                  value={srvCatatanInternal}
                  onChange={(e) => setSrvCatatanInternal(e.target.value)}
                  placeholder="Catatan rahasia guru..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8B5E3C] text-white text-xs font-bold shadow-md"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Follow-up Update Modal */}
      {isFollowUpModalOpen && targetFollowUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#251B13] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8DEC8] dark:border-[#423122] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#38281B]">
              <h3 className="font-extrabold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                Perbarui Tindak Lanjut Siswa
              </h3>
              <button onClick={() => setIsFollowUpModalOpen(false)} className="text-stone-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFollowUp} className="mt-4 space-y-4">
              <p className="text-xs text-[#8C6D53]">
                Siswa: <strong>{targetFollowUp.namaSiswa} ({targetFollowUp.kelasSiswa})</strong>
              </p>

              <div>
                <label className="block text-xs font-bold text-[#5C3F28] mb-1">Status Tindak Lanjut</label>
                <select
                  value={fuStatus}
                  onChange={(e) => setFuStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                >
                  <option value="Dalam Proses">Dalam Proses Monitoring</option>
                  <option value="Selesai">Tandai Selesai (Kasus Tuntas)</option>
                  <option value="Belum Selesai">Belum Selesai (Perlu Rujukan)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3F28] mb-1">Tanggal Evaluasi</label>
                <input
                  type="date"
                  value={fuTanggal}
                  onChange={(e) => setFuTanggal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3F28] mb-1">Catatan Perkembangan Siswa</label>
                <textarea
                  required
                  rows={3}
                  value={fuCatatan}
                  onChange={(e) => setFuCatatan(e.target.value)}
                  placeholder="Catatan perkembangan tingkah laku atau nilai akademik..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFollowUpModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8B5E3C] text-white text-xs font-bold shadow-md"
                >
                  Simpan Progres
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteTarget !== null}
        title="Hapus Data Manajemen BK"
        message="Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Ya, Hapus"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
