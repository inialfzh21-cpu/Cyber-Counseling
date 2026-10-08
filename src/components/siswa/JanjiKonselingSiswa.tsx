import React, { useState } from 'react';
import { 
  CalendarClock, 
  Plus, 
  Calendar, 
  Clock, 
  User as UserIcon, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../lib/storage';
import { CounselingAppointment, AppointmentStatus } from '../../types';
import { Breadcrumb } from '../common/Breadcrumb';

export const JanjiKonselingSiswa: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const guruList = storage.getUsersByGroup().filter(u => u.role === 'guru_bk' && u.statusAkun === 'aktif' && u.tersediaKonseling !== false);
  const appointments = storage.getAppointments().filter(a => a.idSiswa === currentUser?.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGuruId, setSelectedGuruId] = useState(guruList[0]?.id || '');
  const [tanggal, setTanggal] = useState('');
  const [waktu, setWaktu] = useState('09:00 - 09:45 WIB');
  const [alasan, setAlasan] = useState('');

  if (!currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanggal || !alasan.trim() || !selectedGuruId) {
      showToast('Harap lengkapi seluruh formulir janji temu.', 'warning');
      return;
    }

    const targetGuru = guruList.find(g => g.id === selectedGuruId);
    if (!targetGuru) return;

    const newAppt: CounselingAppointment = {
      id: 'apt_' + Date.now(),
      idSiswa: currentUser.id,
      namaSiswa: currentUser.nama,
      kelasSiswa: currentUser.kelas,
      idGuru: targetGuru.id,
      namaGuru: targetGuru.nama,
      tanggal,
      waktu,
      alasan: alasan.trim(),
      status: 'Menunggu konfirmasi',
      tanggalDibuat: new Date().toISOString(),
      groupCode: currentUser.groupCode
    };

    storage.saveAppointment(newAppt);
    // Create notification for Guru BK
    storage.createNotification({
      userId: targetGuru.id,
      judul: 'Permintaan Janji Konseling Baru',
      pesan: `Siswa ${currentUser.nama} (${currentUser.kelas}) mengajukan janji temu pada tanggal ${tanggal} (${waktu}).`,
      tipe: 'janji',
      linkMenu: 'Janji Konseling'
    });

    setIsModalOpen(false);
    setAlasan('');
    setTanggal('');
    showToast('Permintaan janji konseling berhasil dikirim ke Guru BK.', 'success');
  };

  const handleCancelAppointment = (id: string) => {
    const target = appointments.find(a => a.id === id);
    if (target) {
      storage.saveAppointment({
        ...target,
        status: 'Dibatalkan'
      });
      showToast('Janji konseling berhasil dibatalkan.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Janji Konseling' }]} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">
            Janji Temu Konseling Siswa
          </h1>
          <p className="text-xs sm:text-sm text-[#8A674A] dark:text-[#BA9B81] mt-0.5">
            Jadwalkan sesi bimbingan tatap muka atau virtual dengan Guru BK pilihanmu.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#8B5E3C]/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Janji Baru</span>
        </button>
      </div>

      {/* Appointment History Cards */}
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#251B13] rounded-3xl border border-[#E8DEC8] dark:border-[#3E2D20] text-xs text-[#8C6D53]">
            Belum ada jadwal janji temu konseling yang diajukan.
          </div>
        ) : (
          appointments.map(appt => (
            <div
              key={appt.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-extrabold text-sm sm:text-base text-[#4A3525] dark:text-[#F3E9DD]">
                    Guru BK: {appt.namaGuru}
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
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    {appt.tanggal}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    {appt.waktu}
                  </span>
                </div>

                <p className="text-xs text-[#6F523B] dark:text-[#C5A893] bg-[#FAF5EE] dark:bg-[#2E2017] p-3 rounded-xl border border-[#E8DCCB] dark:border-[#423122]">
                  <strong>Topik Konseling:</strong> {appt.alasan}
                </p>

                {appt.catatan && (
                  <p className="text-xs text-[#2D6A4F] bg-[#EBF7EE] dark:bg-[#1E3A2B] p-2.5 rounded-lg border border-[#B7E4C7] dark:border-[#2D6A4F]">
                    <strong>Catatan Guru BK:</strong> {appt.catatan}
                  </p>
                )}
              </div>

              {appt.status === 'Menunggu konfirmasi' && (
                <button
                  onClick={() => handleCancelAppointment(appt.id)}
                  className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold shrink-0"
                >
                  Batalkan Janji
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#251B13] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8DEC8] dark:border-[#423122] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#38281B]">
              <h3 className="font-extrabold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                Ajukan Janji Temu Konseling
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                  Pilih Guru BK
                </label>
                <select
                  value={selectedGuruId}
                  onChange={(e) => setSelectedGuruId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                >
                  {guruList.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.nama} ({g.nipNik || 'Guru BK'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                  Tanggal Konseling
                </label>
                <input
                  type="date"
                  required
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                  Sesi Waktu Konseling
                </label>
                <select
                  value={waktu}
                  onChange={(e) => setWaktu(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                >
                  <option value="08:00 - 08:45 WIB">08:00 - 08:45 WIB (Jam Pelajaran 1)</option>
                  <option value="09:00 - 09:45 WIB">09:00 - 09:45 WIB (Jam Pelajaran 2)</option>
                  <option value="10:15 - 11:00 WIB">10:15 - 11:00 WIB (Sesi Istirahat 1)</option>
                  <option value="11:15 - 12:00 WIB">11:15 - 12:00 WIB (Jam Pelajaran Siang)</option>
                  <option value="13:30 - 14:15 WIB">13:30 - 14:15 WIB (Sepulang Sekolah)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                  Alasan / Topik Konseling
                </label>
                <textarea
                  required
                  rows={3}
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  placeholder="Ceritakan secara singkat hal yang ingin kamu diskusikan..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
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
                  Kirim Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
