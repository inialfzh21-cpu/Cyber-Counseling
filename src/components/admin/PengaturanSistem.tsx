import React, { useState } from 'react';
import { 
  Settings, 
  School, 
  Save, 
  Hash, 
  Phone, 
  Calendar, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../lib/storage';
import { SystemSettings } from '../../types';
import { Breadcrumb } from '../common/Breadcrumb';

export const PengaturanSistem: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [settings, setSettings] = useState<SystemSettings>(() => storage.getSettings());

  const [namaSekolah, setNamaSekolah] = useState(settings.namaSekolah);
  const [alamatSekolah, setAlamatSekolah] = useState(settings.alamatSekolah);
  const [kodeDatabase, setKodeDatabase] = useState(settings.kodeDatabase);
  const [tahunAjaran, setTahunAjaran] = useState(settings.tahunAjaran);
  const [kontakBK, setKontakBK] = useState(settings.kontakBK);
  const [kebijakanKonseling, setKebijakanKonseling] = useState(settings.kebijakanKonseling);

  if (!currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSekolah.trim()) {
      showToast('Nama sekolah tidak boleh kosong.', 'warning');
      return;
    }

    const updated = storage.updateSettings({
      namaSekolah: namaSekolah.trim(),
      alamatSekolah: alamatSekolah.trim(),
      kodeDatabase: kodeDatabase.trim().toUpperCase(),
      tahunAjaran: tahunAjaran.trim(),
      kontakBK: kontakBK.trim(),
      kebijakanKonseling: kebijakanKonseling.trim()
    });

    setSettings(updated);
    showToast('Pengaturan sistem dan identitas sekolah berhasil disimpan.', 'success');
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Pengaturan Sistem' }]} />

      <div className="pb-4 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">
          Pengaturan Sistem & Profil Lembaga
        </h1>
        <p className="text-xs sm:text-sm text-[#8A674A] dark:text-[#BA9B81] mt-0.5">
          Atur informasi sekolah, tahun ajaran aktif, kode database pengelompokan, dan pedoman layanan BK.
        </p>
      </div>

      <div className="bg-white dark:bg-[#251B13] rounded-3xl p-6 sm:p-8 border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs max-w-3xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                Nama Sekolah / Lembaga
              </label>
              <input
                type="text"
                required
                value={namaSekolah}
                onChange={(e) => setNamaSekolah(e.target.value)}
                placeholder="Contoh: SMA NEGERI 1 TELADAN"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                Kode Database / Lembaga <span className="font-mono text-amber-800 dark:text-amber-300 font-bold">(Kunci Akses)</span>
              </label>
              <input
                type="text"
                required
                value={kodeDatabase}
                onChange={(e) => setKodeDatabase(e.target.value.toUpperCase())}
                placeholder="Contoh: BK-2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] font-mono font-bold text-xs sm:text-sm text-[#8B5E3C] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                Tahun Ajaran Aktif
              </label>
              <input
                type="text"
                required
                value={tahunAjaran}
                onChange={(e) => setTahunAjaran(e.target.value)}
                placeholder="Contoh: 2026/2027"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
                Kontak & Ruang BK
              </label>
              <input
                type="text"
                value={kontakBK}
                onChange={(e) => setKontakBK(e.target.value)}
                placeholder="Telepon / Email Ruang BK"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
              Alamat Lengkap Sekolah
            </label>
            <input
              type="text"
              value={alamatSekolah}
              onChange={(e) => setAlamatSekolah(e.target.value)}
              placeholder="Alamat sekolah..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0] mb-1">
              Kebijakan & Kode Etik Bimbingan Konseling
            </label>
            <textarea
              rows={4}
              value={kebijakanKonseling}
              onChange={(e) => setKebijakanKonseling(e.target.value)}
              placeholder="Prinsip kerahasiaan dan komitmen layanan..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#8B5E3C]/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan Sistem</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
