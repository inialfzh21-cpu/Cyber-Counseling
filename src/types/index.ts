export type UserRole = 'siswa' | 'guru_bk' | 'admin';

export interface User {
  id: string;
  nama: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  fotoProfil?: string;
  statusAkun: 'aktif' | 'nonaktif';
  tanggalDibuat: string;
  // Specific role fields
  kelas?: string; // Siswa
  nipNik?: string; // Guru
  tersediaKonseling?: boolean; // Guru
  groupCode: string; // Multi-tenant code
}

export type AssessmentType = 'DCM' | 'AUM' | 'Sosiometri';
export type AssessmentAspect = 'Pribadi' | 'Sosial' | 'Belajar' | 'Karier';

export interface AssessmentQuestion {
  id: string;
  jenisAsesmen: AssessmentType;
  kategori: AssessmentAspect;
  pertanyaan: string;
  pilihanJawaban: string[]; // e.g. ["Ya", "Tidak"] or ["Sering", "Kadang-kadang", "Tidak Pernah"]
  bobotNilai?: number[];
  statusAktif: boolean;
  urutan: number;
}

export interface AssessmentResult {
  id: string;
  idSiswa: string;
  namaSiswa: string;
  kelasSiswa: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  idAsesmen: string;
  jenisAsesmen: AssessmentType;
  aspekBK: AssessmentAspect;
  jawaban: Record<string, string>; // questionId -> answer
  skorTotal: number;
  ringkasan: string;
  detailHasil: {
    aspek: string;
    skor: number;
    kategoriTingkat: 'Rendah' | 'Sedang' | 'Tinggi';
    keterangan: string;
  }[];
  tanggalPengerjaan: string;
  groupCode: string;
  catatanGuru?: string;
  rekomendasiGuru?: string;
}

export interface ChatMessage {
  id: string;
  idPercakapan: string;
  idSiswa: string;
  idGuru: string;
  namaPengirim: string;
  pengirim: 'siswa' | 'guru_bk';
  pesan: string;
  waktu: string;
  statusPesan: 'terkirim' | 'dibaca';
  groupCode: string;
}

export type AppointmentStatus = 'Menunggu konfirmasi' | 'Disetujui' | 'Ditolak' | 'Selesai' | 'Dibatalkan';

export interface CounselingAppointment {
  id: string;
  idSiswa: string;
  namaSiswa: string;
  kelasSiswa?: string;
  idGuru: string;
  namaGuru: string;
  tanggal: string;
  waktu: string;
  alasan: string;
  status: AppointmentStatus;
  catatan?: string;
  catatanInternalGuru?: string;
  tanggalDibuat: string;
  groupCode: string;
}

export type BkServiceType = 
  | 'Layanan dasar'
  | 'Layanan responsif'
  | 'Perencanaan individual'
  | 'Dukungan sistem'
  | 'Konseling individual'
  | 'Konseling kelompok'
  | 'Bimbingan kelompok'
  | 'Bimbingan klasikal';

export type BkServiceStatus = 'Terjadwal' | 'Sedang berlangsung' | 'Selesai' | 'Membutuhkan tindak lanjut';

export interface BkServiceRecord {
  id: string;
  idSiswa: string;
  namaSiswa: string;
  kelasSiswa?: string;
  idGuru: string;
  namaGuru: string;
  tanggal: string;
  jenisLayanan: BkServiceType;
  tujuan: string;
  permasalahan: string;
  tindakan: string;
  hasilLayanan: string;
  rencanaTindakLanjut?: string;
  statusTindakLanjut?: 'Belum Selesai' | 'Selesai' | 'Dalam Proses';
  tanggalTindakLanjut?: string;
  catatanInternal?: string;
  status: BkServiceStatus;
  tanggalDibuat: string;
  groupCode: string;
}

export interface BkProgram {
  id: string;
  namaProgram: string;
  jenisLayanan: BkServiceType;
  sasaran: string; // e.g. "Kelas X", "Siswa Bermasalah Akademik"
  tanggalPelaksanaan: string;
  tujuanLayanan: string;
  materiLayanan: string;
  keterangan: string;
  groupCode: string;
}

export type MoodType = 'Senang' | 'Tenang' | 'Cemas' | 'Sedih' | 'Marah' | 'Bersemangat';

export interface DiaryEntry {
  id: string;
  idSiswa: string;
  judul: string;
  isi: string;
  kondisiPerasaan: string;
  mood: MoodType;
  tanggal: string;
  groupCode: string;
}

export type PriorityLevel = 'Tinggi' | 'Sedang' | 'Rendah';

export interface TodoItem {
  id: string;
  idSiswa: string;
  kegiatan: string;
  tanggal: string;
  waktu: string;
  prioritas: PriorityLevel;
  status: 'belum' | 'selesai';
  groupCode: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  judul: string;
  pesan: string;
  tipe: 'chat' | 'janji' | 'asesmen' | 'tindak_lanjut' | 'info';
  waktu: string;
  dibaca: boolean;
  linkMenu?: string;
}

export interface SystemSettings {
  namaSekolah: string;
  alamatSekolah: string;
  kodeDatabase: string; // multi-tenant group code
  kebijakanKonseling: string;
  tahunAjaran: string;
  kontakBK: string;
}

export interface GoogleSheetsConfig {
  connected: boolean;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  userEmail?: string;
  lastSyncTime?: string;
  sharedEmails: string[];
  autoSync: boolean;
}
