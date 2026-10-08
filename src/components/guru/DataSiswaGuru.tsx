import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  GraduationCap, 
  Mail, 
  FileCheck2, 
  FolderKanban, 
  X,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../lib/storage';
import { User, AssessmentResult, BkServiceRecord } from '../../types';
import { Breadcrumb } from '../common/Breadcrumb';

export const DataSiswaGuru: React.FC = () => {
  const { currentUser } = useAuth();
  const siswaList = storage.getUsersByGroup().filter(u => u.role === 'siswa');
  const results = storage.getResults();
  const services = storage.getServices();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterKelas, setFilterKelas] = useState('Semua');
  const [selectedSiswa, setSelectedSiswa] = useState<User | null>(null);

  if (!currentUser) return null;

  const kelasOptions = ['Semua', ...Array.from(new Set(siswaList.map(s => s.kelas || '-')))];

  const filteredStudents = siswaList.filter(s => {
    const matchesSearch = s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.kelas && s.kelas.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesKelas = filterKelas === 'Semua' || s.kelas === filterKelas;
    return matchesSearch && matchesKelas;
  });

  const getSiswaResults = (id: string) => results.filter(r => r.idSiswa === id);
  const getSiswaServices = (id: string) => services.filter(s => s.idSiswa === id);

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Data Siswa' }]} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">
            Database & Rekam Jejak Siswa
          </h1>
          <p className="text-xs sm:text-sm text-[#8A674A] dark:text-[#BA9B81] mt-0.5">
            Daftar seluruh siswa terdaftar, partisipasi asesmen, dan rekam riwayat layanan bimbingan konseling.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#9A7D66]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama siswa, kelas, atau email..."
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-1 focus:ring-[#8B5E3C]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-[#8C6D53]">Filter Kelas:</span>
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs font-semibold text-[#4A3525] dark:text-[#F3E9DD]"
          >
            {kelasOptions.map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table / Grid */}
      <div className="bg-white dark:bg-[#251B13] rounded-3xl border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF5EE] dark:bg-[#2E2017] border-b border-[#E8DEC8] dark:border-[#3E2D20] text-[#6A4728] dark:text-[#E2C7B0] font-bold">
                <th className="p-4">Foto & Siswa</th>
                <th className="p-4">Jenis Kelamin</th>
                <th className="p-4">Kelas</th>
                <th className="p-4">Status Asesmen</th>
                <th className="p-4">Riwayat Layanan</th>
                <th className="p-4 text-center">Aksi</th>
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
                filteredStudents.map(siswa => {
                  const sResults = getSiswaResults(siswa.id);
                  const sServices = getSiswaServices(siswa.id);
                  return (
                    <tr key={siswa.id} className="hover:bg-[#FAF6F0] dark:hover:bg-[#2C1E15] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={siswa.fotoProfil || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                            alt={siswa.nama}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#C89D7C]"
                          />
                          <div>
                            <p className="font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">{siswa.nama}</p>
                            <p className="text-[11px] text-[#8C6D53]">{siswa.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-[#7A5B40] dark:text-[#C5A893]">
                        {siswa.jenisKelamin}
                      </td>
                      <td className="p-4 font-bold text-[#5C3F28] dark:text-[#ECC9AC]">
                        {siswa.kelas || '-'}
                      </td>
                      <td className="p-4">
                        {sResults.length > 0 ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-[11px]">
                            {sResults.length} Asesmen Selesai
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                            Belum Mengisi
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-[#7A5B40] dark:text-[#C5A893]">
                        {sServices.length} Catatan Konseling
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setSelectedSiswa(siswa)}
                          className="px-3 py-1.5 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white font-bold text-xs flex items-center gap-1 mx-auto shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedSiswa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#251B13] rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-[#E8DEC8] dark:border-[#423122] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#38281B]">
              <h3 className="font-extrabold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                Rekam Data Siswa: {selectedSiswa.nama}
              </h3>
              <button onClick={() => setSelectedSiswa(null)} className="text-stone-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF5EE] dark:bg-[#2E2017] border border-[#E8DCCB]">
              <img
                src={selectedSiswa.fotoProfil}
                alt={selectedSiswa.nama}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#8B5E3C]"
              />
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-base text-[#4A3525] dark:text-[#F3E9DD]">{selectedSiswa.nama}</h4>
                <p className="text-xs text-[#8C6D53]">Kelas: {selectedSiswa.kelas} • Jenis Kelamin: {selectedSiswa.jenisKelamin}</p>
                <p className="text-xs text-[#8C6D53]">Email: {selectedSiswa.email} • Username: @{selectedSiswa.username}</p>
              </div>
            </div>

            {/* Assessment History */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#8B5E3C] mb-2 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4" />
                <span>Riwayat Asesmen Masalah Siswa ({getSiswaResults(selectedSiswa.id).length})</span>
              </h4>
              <div className="space-y-2">
                {getSiswaResults(selectedSiswa.id).length === 0 ? (
                  <p className="text-xs text-stone-400 p-3 bg-stone-50 rounded-xl">Siswa belum memiliki hasil asesmen.</p>
                ) : (
                  getSiswaResults(selectedSiswa.id).map(r => (
                    <div key={r.id} className="p-3 rounded-xl border border-[#E8DEC8] bg-white dark:bg-[#251B13] text-xs">
                      <div className="flex justify-between font-bold text-[#4A3525] dark:text-[#F3E9DD]">
                        <span>{r.jenisAsesmen} ({r.aspekBK})</span>
                        <span className="text-[11px] text-[#8C6D53]">{r.tanggalPengerjaan.slice(0, 10)}</span>
                      </div>
                      <p className="text-[#6F523B] dark:text-[#C5A893] mt-1">{r.ringkasan}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* BK Service Records */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#8B5E3C] mb-2 flex items-center gap-1.5">
                <FolderKanban className="w-4 h-4" />
                <span>Riwayat Catatan Layanan BK ({getSiswaServices(selectedSiswa.id).length})</span>
              </h4>
              <div className="space-y-2">
                {getSiswaServices(selectedSiswa.id).length === 0 ? (
                  <p className="text-xs text-stone-400 p-3 bg-stone-50 rounded-xl">Belum ada catatan konseling untuk siswa ini.</p>
                ) : (
                  getSiswaServices(selectedSiswa.id).map(s => (
                    <div key={s.id} className="p-3 rounded-xl border border-[#E8DEC8] bg-white dark:bg-[#251B13] text-xs">
                      <div className="flex justify-between font-bold text-[#4A3525] dark:text-[#F3E9DD]">
                        <span>{s.jenisLayanan}</span>
                        <span className="text-[11px] text-[#8C6D53]">{s.tanggal}</span>
                      </div>
                      <p className="text-[#6F523B] dark:text-[#C5A893] mt-1"><strong>Masalah:</strong> {s.permasalahan}</p>
                      <p className="text-[#6F523B] dark:text-[#C5A893]"><strong>Hasil:</strong> {s.hasilLayanan}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="text-right pt-2">
              <button
                onClick={() => setSelectedSiswa(null)}
                className="px-5 py-2 rounded-xl bg-[#8B5E3C] text-white text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
