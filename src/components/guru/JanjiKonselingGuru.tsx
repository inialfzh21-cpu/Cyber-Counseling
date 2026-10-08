import React, { useState } from 'react';
import { 
  CalendarClock, 
  Check, 
  X, 
  Clock, 
  Calendar, 
  User, 
  Edit3, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../lib/storage';
import { CounselingAppointment, AppointmentStatus } from '../../types';
import { Breadcrumb } from '../common/Breadcrumb';

export const JanjiKonselingGuru: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState<CounselingAppointment[]>(() =>
    storage.getAppointments()
  );

  const [filterStatus, setFilterStatus] = useState<string>('Semua');

  // Response Modal State
  const [selectedAppt, setSelectedAppt] = useState<CounselingAppointment | null>(null);
  const [modalAction, setModalAction] = useState<'status' | 'reschedule'>('status');
  const [newStatus, setNewStatus] = useState<AppointmentStatus>('Disetujui');
  const [catatanGuru, setCatatanGuru] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  if (!currentUser) return null;

  const refreshList = () => {
    setAppointments(storage.getAppointments());
  };

  const handleOpenAction = (appt: CounselingAppointment, action: 'status' | 'reschedule') => {
    setSelectedAppt(appt);
    setModalAction(action);
    setNewStatus(appt.status);
    setCatatanGuru(appt.catatan || '');
    setNewDate(appt.tanggal);
    setNewTime(appt.waktu);
  };

  const handleSaveAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppt) return;

    const updated: CounselingAppointment = {
      ...selectedAppt,
      status: modalAction === 'reschedule' ? 'Disetujui' : newStatus,
      tanggal: modalAction === 'reschedule' ? newDate : selectedAppt.tanggal,
      waktu: modalAction === 'reschedule' ? newTime : selectedAppt.waktu,
      catatan: catatanGuru.trim()
    };

    storage.saveAppointment(updated);

    // Notify Student
    storage.createNotification({
      userId: selectedAppt.idSiswa,
      judul: 'Pembaruan Janji Konseling',
      pesan: `Permintaan janji konseling Anda pada tanggal ${updated.tanggal} telah diperbarui dengan status: ${updated.status}.`,
      tipe: 'janji',
      linkMenu: 'Janji Konseling'
    });

    refreshList();
    setSelectedAppt(null);
    showToast('Status janji konseling berhasil disimpan & dinotifikasikan.', 'success');
  };

  const filteredAppointments = appointments.filter(a => {
    if (filterStatus === 'Semua') return true;
    return a.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Janji Konseling' }]} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">
            Kelola Janji Temu Konseling
          </h1>
          <p className="text-xs sm:text-sm text-[#8A674A] dark:text-[#BA9B81] mt-0.5">
            Tinjau permintaan konseling siswa, konfirmasi jadwal, atau berikan catatan internal.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#8C6D53]">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] text-xs font-semibold text-[#4A3525] dark:text-[#F3E9DD]"
          >
            <option value="Semua">Semua Status</option>
            <option value="Menunggu konfirmasi">Menunggu Konfirmasi</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Selesai">Selesai</option>
            <option value="Ditolak">Ditolak</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>
        </div>
      </div>

      {/* Appointment Cards */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#251B13] rounded-3xl border border-[#E8DEC8] dark:border-[#3E2D20] text-xs text-[#8C6D53]">
            Tidak ada permohonan janji konseling pada kategori ini.
          </div>
        ) : (
          filteredAppointments.map(appt => (
            <div
              key={appt.id}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-extrabold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                    {appt.namaSiswa} ({appt.kelasSiswa || 'Siswa'})
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    appt.status === 'Disetujui'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : appt.status === 'Ditolak'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      : appt.status === 'Selesai'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                      : appt.status === 'Dibatalkan'
                      ? 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}>
                    {appt.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#7A5B40] dark:text-[#B6967E]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    {appt.tanggal}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    {appt.waktu}
                  </span>
                  <span>Konselor: <strong>{appt.namaGuru}</strong></span>
                </div>

                <p className="text-xs text-[#523C2B] dark:text-[#D5BCA9] bg-[#FAF5EE] dark:bg-[#2E2017] p-3 rounded-xl border border-[#E8DCCB] dark:border-[#443122]">
                  <strong>Alasan Konseling:</strong> {appt.alasan}
                </p>

                {appt.catatan && (
                  <p className="text-xs text-[#2D6A4F] bg-[#EBF7EE] dark:bg-[#1E3A2B] p-2.5 rounded-lg border border-[#B7E4C7] dark:border-[#2D6A4F]">
                    <strong>Catatan Guru BK:</strong> {appt.catatan}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0">
                <button
                  onClick={() => handleOpenAction(appt, 'status')}
                  className="px-4 py-2 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white text-xs font-bold shadow-xs"
                >
                  Ubah Status / Catatan
                </button>
                <button
                  onClick={() => handleOpenAction(appt, 'reschedule')}
                  className="px-4 py-2 rounded-xl bg-[#FAF5EE] dark:bg-[#2E2017] hover:bg-[#F2E5D4] text-[#6A4728] dark:text-[#ECC9AC] border border-[#E8DCCB] text-xs font-bold"
                >
                  Ubah Jadwal
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Response / Reschedule Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#251B13] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8DEC8] dark:border-[#423122] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#38281B]">
              <h3 className="font-extrabold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                {modalAction === 'reschedule' ? 'Jadwalkan Ulang Konseling' : 'Kelola Status Janji Konseling'}
              </h3>
              <button onClick={() => setSelectedAppt(null)} className="text-stone-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAction} className="mt-4 space-y-4">
              <p className="text-xs text-[#8C6D53]">
                Siswa: <strong>{selectedAppt.namaSiswa} ({selectedAppt.kelasSiswa})</strong>
              </p>

              {modalAction === 'status' ? (
                <div>
                  <label className="block text-xs font-bold text-[#5C3F28] mb-1">Status Permintaan</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as AppointmentStatus)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm font-semibold"
                  >
                    <option value="Disetujui">Disetujui (Konfirmasi Sesi)</option>
                    <option value="Selesai">Tandai Selesai (Sesi Telah Terlaksana)</option>
                    <option value="Ditolak">Ditolak (Jadwal Penuh / Alasan Lain)</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#5C3F28] mb-1">Tanggal Baru</label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5C3F28] mb-1">Waktu Baru</label>
                    <input
                      type="text"
                      required
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      placeholder="Contoh: 10:00 - 10:45 WIB"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#5C3F28] mb-1">
                  Catatan untuk Siswa / Lokasi Ruang
                </label>
                <textarea
                  rows={3}
                  value={catatanGuru}
                  onChange={(e) => setCatatanGuru(e.target.value)}
                  placeholder="Misal: Hadir di Ruang Konseling 1 atau persiapkan lembar refleksi..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] text-xs sm:text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAppt(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8B5E3C] text-white text-xs font-bold shadow-md"
                >
                  Simpan & Notifikasi Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
