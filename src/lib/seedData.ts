import { 
  User, 
  AssessmentQuestion, 
  AssessmentResult, 
  CounselingAppointment, 
  BkServiceRecord, 
  BkProgram,
  DiaryEntry,
  TodoItem,
  SystemSettings
} from '../types';

export const DEFAULT_GROUP_CODE = 'BK-2026';

export const INITIAL_SETTINGS: SystemSettings = {
  namaSekolah: 'SMA NEGERI 1 TELADAN',
  alamatSekolah: 'Jl. Pendidikan No. 45, Kompleks Pelajar Nusantara',
  kodeDatabase: DEFAULT_GROUP_CODE,
  kebijakanKonseling: 'Layanan Bimbingan dan Konseling berlandaskan asas kerahasiaan, keterbukaan, dan kesukarelaan untuk mengoptimalkan potensi dan perkembangan kepribadian siswa.',
  tahunAjaran: '2026/2027',
  kontakBK: '(021) 7891234 / ruangbk@sman1teladan.sch.id'
};

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin',
    nama: 'Administrator Utama BK',
    jenisKelamin: 'Laki-laki',
    email: 'admin.cyber@sekolah.sch.id',
    username: 'admincybercounseling',
    passwordHash: 'saacounseling', // Checked via auth simulator
    role: 'admin',
    fotoProfil: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    statusAkun: 'aktif',
    tanggalDibuat: '2026-01-10T08:00:00Z',
    groupCode: DEFAULT_GROUP_CODE
  },
  {
    id: 'usr_guru_1',
    nama: 'Dra. Hj. Siti Rahmawati, M.Pd., Kons.',
    jenisKelamin: 'Perempuan',
    email: 'siti.rahmawati@sekolah.sch.id',
    username: 'gurubk1',
    passwordHash: 'password123',
    role: 'guru_bk',
    nipNik: '197805122003122001',
    tersediaKonseling: true,
    fotoProfil: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    statusAkun: 'aktif',
    tanggalDibuat: '2026-01-12T09:00:00Z',
    groupCode: DEFAULT_GROUP_CODE
  },
  {
    id: 'usr_guru_2',
    nama: 'Ahmad Fauzi, S.Pd., Gr.',
    jenisKelamin: 'Laki-laki',
    email: 'ahmad.fauzi@sekolah.sch.id',
    username: 'gurubk2',
    passwordHash: 'password123',
    role: 'guru_bk',
    nipNik: '198509142010011008',
    tersediaKonseling: true,
    fotoProfil: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    statusAkun: 'aktif',
    tanggalDibuat: '2026-01-15T10:00:00Z',
    groupCode: DEFAULT_GROUP_CODE
  },
  {
    id: 'usr_siswa_1',
    nama: 'Muhammad Rizky Pratama',
    jenisKelamin: 'Laki-laki',
    email: 'rizky.pratama@siswa.sch.id',
    username: 'siswa1',
    passwordHash: 'password123',
    role: 'siswa',
    kelas: 'XI MIPA 2',
    fotoProfil: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    statusAkun: 'aktif',
    tanggalDibuat: '2026-02-01T11:00:00Z',
    groupCode: DEFAULT_GROUP_CODE
  },
  {
    id: 'usr_siswa_2',
    nama: 'Alya Putri Salsabila',
    jenisKelamin: 'Perempuan',
    email: 'alya.putri@siswa.sch.id',
    username: 'siswa2',
    passwordHash: 'password123',
    role: 'siswa',
    kelas: 'X E-3',
    fotoProfil: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    statusAkun: 'aktif',
    tanggalDibuat: '2026-02-05T13:30:00Z',
    groupCode: DEFAULT_GROUP_CODE
  },
  {
    id: 'usr_siswa_3',
    nama: 'Dimas Bagus Anggoro',
    jenisKelamin: 'Laki-laki',
    email: 'dimas.bagus@siswa.sch.id',
    username: 'siswa3',
    passwordHash: 'password123',
    role: 'siswa',
    kelas: 'XII IPS 1',
    fotoProfil: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    statusAkun: 'aktif',
    tanggalDibuat: '2026-02-10T14:15:00Z',
    groupCode: DEFAULT_GROUP_CODE
  }
];

export const INITIAL_QUESTIONS: AssessmentQuestion[] = [
  // DCM - Pribadi
  {
    id: 'q_dcm_p1',
    jenisAsesmen: 'DCM',
    kategori: 'Pribadi',
    pertanyaan: 'Sering merasa cemas atau gugup saat menghadapi ujian atau presentasi di depan kelas.',
    pilihanJawaban: ['Sering', 'Kadang-kadang', 'Tidak Pernah'],
    bobotNilai: [2, 1, 0],
    statusAktif: true,
    urutan: 1
  },
  {
    id: 'q_dcm_p2',
    jenisAsesmen: 'DCM',
    kategori: 'Pribadi',
    pertanyaan: 'Mengalami kesulitan dalam mengendalikan emosi atau rasa marah saat ada masalah.',
    pilihanJawaban: ['Sering', 'Kadang-kadang', 'Tidak Pernah'],
    bobotNilai: [2, 1, 0],
    statusAktif: true,
    urutan: 2
  },
  {
    id: 'q_dcm_p3',
    jenisAsesmen: 'DCM',
    kategori: 'Pribadi',
    pertanyaan: 'Merasa kurang percaya diri terhadap kemampuan dan kelebihan fisik maupun mental diri sendiri.',
    pilihanJawaban: ['Sering', 'Kadang-kadang', 'Tidak Pernah'],
    bobotNilai: [2, 1, 0],
    statusAktif: true,
    urutan: 3
  },
  // DCM - Sosial
  {
    id: 'q_dcm_s1',
    jenisAsesmen: 'DCM',
    kategori: 'Sosial',
    pertanyaan: 'Merasa canggung atau sulit membuka obrolan saat berada di lingkungan pertemanan baru.',
    pilihanJawaban: ['Sering', 'Kadang-kadang', 'Tidak Pernah'],
    bobotNilai: [2, 1, 0],
    statusAktif: true,
    urutan: 4
  },
  {
    id: 'q_dcm_s2',
    jenisAsesmen: 'DCM',
    kategori: 'Sosial',
    pertanyaan: 'Merasa sering disalahpahami oleh teman sebaya atau keluarga di rumah.',
    pilihanJawaban: ['Sering', 'Kadang-kadang', 'Tidak Pernah'],
    bobotNilai: [2, 1, 0],
    statusAktif: true,
    urutan: 5
  },
  // DCM - Belajar
  {
    id: 'q_dcm_b1',
    jenisAsesmen: 'DCM',
    kategori: 'Belajar',
    pertanyaan: 'Sulit berkonsentrasi dalam pelajaran dan mudah terdistraksi oleh gawai (smartphone/media sosial).',
    pilihanJawaban: ['Sering', 'Kadang-kadang', 'Tidak Pernah'],
    bobotNilai: [2, 1, 0],
    statusAktif: true,
    urutan: 6
  },
  {
    id: 'q_dcm_b2',
    jenisAsesmen: 'DCM',
    kategori: 'Belajar',
    pertanyaan: 'Sering menunda-nunda pengerjaan tugas hingga batas akhir (deadlines).',
    pilihanJawaban: ['Sering', 'Kadang-kadang', 'Tidak Pernah'],
    bobotNilai: [2, 1, 0],
    statusAktif: true,
    urutan: 7
  },
  // DCM - Karier
  {
    id: 'q_dcm_k1',
    jenisAsesmen: 'DCM',
    kategori: 'Karier',
    pertanyaan: 'Belum memiliki gambaran yang jelas mengenai minat jurusan kuliah atau cita-cita masa depan.',
    pilihanJawaban: ['Sering', 'Kadang-kadang', 'Tidak Pernah'],
    bobotNilai: [2, 1, 0],
    statusAktif: true,
    urutan: 8
  },
  {
    id: 'q_dcm_k2',
    jenisAsesmen: 'DCM',
    kategori: 'Karier',
    pertanyaan: 'Merasa bimbang karena pilihan profesi atau jurusan belum sejalan dengan keinginan orang tua.',
    pilihanJawaban: ['Sering', 'Kadang-kadang', 'Tidak Pernah'],
    bobotNilai: [2, 1, 0],
    statusAktif: true,
    urutan: 9
  },

  // AUM - Alat Ungkap Masalah (Umum & Belajar)
  {
    id: 'q_aum_1',
    jenisAsesmen: 'AUM',
    kategori: 'Pribadi',
    pertanyaan: 'Sering merasa kelelahan fisik, insomnia, atau sulit tidur nyenyak di malam hari.',
    pilihanJawaban: ['Ya', 'Tidak'],
    bobotNilai: [1, 0],
    statusAktif: true,
    urutan: 10
  },
  {
    id: 'q_aum_2',
    jenisAsesmen: 'AUM',
    kategori: 'Sosial',
    pertanyaan: 'Takut dikucilkan atau merasa tidak nyaman berada di dalam kelompok belajar.',
    pilihanJawaban: ['Ya', 'Tidak'],
    bobotNilai: [1, 0],
    statusAktif: true,
    urutan: 11
  },
  {
    id: 'q_aum_3',
    jenisAsesmen: 'AUM',
    kategori: 'Belajar',
    pertanyaan: 'Kurang memahami teknik belajar yang efektif sesuai tipe belajar diri sendiri.',
    pilihanJawaban: ['Ya', 'Tidak'],
    bobotNilai: [1, 0],
    statusAktif: true,
    urutan: 12
  },
  {
    id: 'q_aum_4',
    jenisAsesmen: 'AUM',
    kategori: 'Karier',
    pertanyaan: 'Memerlukan informasi lebih mendalam seputar prospek pekerjaan masa depan dan beasiswa perguruan tinggi.',
    pilihanJawaban: ['Ya', 'Tidak'],
    bobotNilai: [1, 0],
    statusAktif: true,
    urutan: 13
  },

  // Sosiometri
  {
    id: 'q_sosio_1',
    jenisAsesmen: 'Sosiometri',
    kategori: 'Sosial',
    pertanyaan: 'Siapakah teman di kelas yang paling sering kamu ajak berdiskusi ketika mengalami kesulitan belajar?',
    pilihanJawaban: ['Teman Sebangku', 'Ketua Kelas', 'Sahabat Dekat', 'Belajar Sendiri'],
    bobotNilai: [1, 1, 1, 0],
    statusAktif: true,
    urutan: 14
  },
  {
    id: 'q_sosio_2',
    jenisAsesmen: 'Sosiometri',
    kategori: 'Sosial',
    pertanyaan: 'Dalam kegiatan kerja kelompok atau organisasi kelas, peran apa yang paling kamu sukai?',
    pilihanJawaban: ['Pemimpin / Koordinator', 'Perencana & Konseptor', 'Pelaksana Teknis', 'Penyemangat Tim'],
    bobotNilai: [2, 2, 1, 1],
    statusAktif: true,
    urutan: 15
  }
];

export const INITIAL_ASSESSMENT_RESULTS: AssessmentResult[] = [
  {
    id: 'res_001',
    idSiswa: 'usr_siswa_1',
    namaSiswa: 'Muhammad Rizky Pratama',
    kelasSiswa: 'XI MIPA 2',
    jenisKelamin: 'Laki-laki',
    idAsesmen: 'DCM',
    jenisAsesmen: 'DCM',
    aspekBK: 'Belajar',
    jawaban: {
      'q_dcm_p1': 'Kadang-kadang',
      'q_dcm_p2': 'Tidak Pernah',
      'q_dcm_p3': 'Kadang-kadang',
      'q_dcm_s1': 'Tidak Pernah',
      'q_dcm_s2': 'Kadang-kadang',
      'q_dcm_b1': 'Sering',
      'q_dcm_b2': 'Sering',
      'q_dcm_k1': 'Kadang-kadang',
      'q_dcm_k2': 'Tidak Pernah'
    },
    skorTotal: 9,
    ringkasan: 'Siswa memiliki kecenderungan kendala dalam manajemen waktu belajar dan konsentrasi terhadap gawai digital. Aspek sosial dan pribadi dalam batas aman.',
    detailHasil: [
      { aspek: 'Pribadi', skor: 2, kategoriTingkat: 'Rendah', keterangan: 'Kondisi emosi relatif stabil, sedikit cemas menjelang ujian' },
      { aspek: 'Sosial', skor: 1, kategoriTingkat: 'Rendah', keterangan: 'Hubungan interpersonal dengan teman sebaya sangat baik' },
      { aspek: 'Belajar', skor: 4, kategoriTingkat: 'Tinggi', keterangan: 'Membutuhkan pendampingan teknik pomodoro dan manajemen waktu belajar' },
      { aspek: 'Karier', skor: 2, kategoriTingkat: 'Sedang', keterangan: 'Sudah mulai mempertimbangkan pilihan perguruan tinggi' }
    ],
    tanggalPengerjaan: '2026-10-02T10:15:00Z',
    groupCode: DEFAULT_GROUP_CODE,
    catatanGuru: 'Siswa sangat kooperatif dan menyadari kendala menunda tugas.',
    rekomendasiGuru: 'Diberikan bimbingan individual tentang time management dan digital detox saat jam belajar malam.'
  },
  {
    id: 'res_002',
    idSiswa: 'usr_siswa_2',
    namaSiswa: 'Alya Putri Salsabila',
    kelasSiswa: 'X E-3',
    jenisKelamin: 'Perempuan',
    idAsesmen: 'AUM',
    jenisAsesmen: 'AUM',
    aspekBK: 'Karier',
    jawaban: {
      'q_aum_1': 'Tidak',
      'q_aum_2': 'Tidak',
      'q_aum_3': 'Ya',
      'q_aum_4': 'Ya'
    },
    skorTotal: 2,
    ringkasan: 'Siswa memerlukan wawasan komprehensif terkait peminatan mata pelajaran fase E ke fase F dan eksplorasi karier masa depan.',
    detailHasil: [
      { aspek: 'Pribadi', skor: 0, kategoriTingkat: 'Rendah', keterangan: 'Kondisi psikologis dan adaptasi sekolah baru sangat baik' },
      { aspek: 'Sosial', skor: 0, kategoriTingkat: 'Rendah', keterangan: 'Memiliki teman akrab dan aktif berorganisasi' },
      { aspek: 'Belajar', skor: 1, kategoriTingkat: 'Sedang', keterangan: 'Masih menyesuaikan ritme beban belajar jenjang SMA' },
      { aspek: 'Karier', skor: 1, kategoriTingkat: 'Sedang', keterangan: 'Perlu konsultasi peminatan kurikulum merdeka' }
    ],
    tanggalPengerjaan: '2026-10-04T13:40:00Z',
    groupCode: DEFAULT_GROUP_CODE,
    catatanGuru: 'Siswa berpotensi tinggi di bidang komunikasi dan bahasa.',
    rekomendasiGuru: 'Sertakan dalam sesi Bimbingan Klasikal Eksplorasi Karier Abad 21.'
  },
  {
    id: 'res_003',
    idSiswa: 'usr_siswa_3',
    namaSiswa: 'Dimas Bagus Anggoro',
    kelasSiswa: 'XII IPS 1',
    jenisKelamin: 'Laki-laki',
    idAsesmen: 'DCM',
    jenisAsesmen: 'DCM',
    aspekBK: 'Pribadi',
    jawaban: {
      'q_dcm_p1': 'Sering',
      'q_dcm_p2': 'Kadang-kadang',
      'q_dcm_p3': 'Sering',
      'q_dcm_s1': 'Kadang-kadang',
      'q_dcm_s2': 'Sering',
      'q_dcm_b1': 'Kadang-kadang',
      'q_dcm_b2': 'Sering',
      'q_dcm_k1': 'Sering',
      'q_dcm_k2': 'Sering'
    },
    skorTotal: 14,
    ringkasan: 'Indikasi tingkat stres cukup tinggi terkait seleksi masuk perguruan tinggi (SNBP/SNBT) serta perbedaan pendapat dengan orang tua.',
    detailHasil: [
      { aspek: 'Pribadi', skor: 5, kategoriTingkat: 'Tinggi', keterangan: 'Tingkat kecemasan tinggi dan rentan overthinking' },
      { aspek: 'Sosial', skor: 3, kategoriTingkat: 'Sedang', keterangan: 'Merasa kurang mendapat dukungan emosional keluarga' },
      { aspek: 'Belajar', skor: 3, kategoriTingkat: 'Sedang', keterangan: 'Motivasi belajar naik turun karena kelelahan mental' },
      { aspek: 'Karier', skor: 4, kategoriTingkat: 'Tinggi', keterangan: 'Dilema jurusan kuliah versus ekspektasi orang tua' }
    ],
    tanggalPengerjaan: '2026-10-06T09:20:00Z',
    groupCode: DEFAULT_GROUP_CODE,
    catatanGuru: 'Perlu tindak lanjut konseling individual segera dan konseling keluarga bila diperlukan.',
    rekomendasiGuru: 'Jadwalkan konseling tatap muka berkala dan latihan relaksasi pernapasan rutin.'
  }
];

export const INITIAL_APPOINTMENTS: CounselingAppointment[] = [
  {
    id: 'apt_001',
    idSiswa: 'usr_siswa_1',
    namaSiswa: 'Muhammad Rizky Pratama',
    kelasSiswa: 'XI MIPA 2',
    idGuru: 'usr_guru_1',
    namaGuru: 'Dra. Hj. Siti Rahmawati, M.Pd., Kons.',
    tanggal: '2026-10-10',
    waktu: '10:00 - 10:45 WIB',
    alasan: 'Ingin berdiskusi mengenai teknik mengatasi rasa jenuh belajar dan membagi waktu organisasi OSIS dengan tugas sekolah.',
    status: 'Disetujui',
    catatan: 'Disetujui, silakan hadir di Ruang Konseling 1 atau melalui chat aplikasi.',
    tanggalDibuat: '2026-10-05T08:00:00Z',
    groupCode: DEFAULT_GROUP_CODE
  },
  {
    id: 'apt_002',
    idSiswa: 'usr_siswa_3',
    namaSiswa: 'Dimas Bagus Anggoro',
    kelasSiswa: 'XII IPS 1',
    idGuru: 'usr_guru_2',
    namaGuru: 'Ahmad Fauzi, S.Pd., Gr.',
    tanggal: '2026-10-09',
    waktu: '13:30 - 14:15 WIB',
    alasan: 'Konsultasi kelanjutan studi dan pemilihan prodi PTN agar mantap menentukan prioritas pilihan ujian.',
    status: 'Menunggu konfirmasi',
    tanggalDibuat: '2026-10-07T11:20:00Z',
    groupCode: DEFAULT_GROUP_CODE
  }
];

export const INITIAL_BK_SERVICES: BkServiceRecord[] = [
  {
    id: 'srv_001',
    idSiswa: 'usr_siswa_1',
    namaSiswa: 'Muhammad Rizky Pratama',
    kelasSiswa: 'XI MIPA 2',
    idGuru: 'usr_guru_1',
    namaGuru: 'Dra. Hj. Siti Rahmawati, M.Pd., Kons.',
    tanggal: '2026-09-28',
    jenisLayanan: 'Konseling individual',
    tujuan: 'Membantu siswa menemukan strategi manajemen waktu belajar harian yang seimbang.',
    permasalahan: 'Sering begadang bermain ponsel sehingga mengantuk saat pelajaran pagi.',
    tindakan: 'Reframing pola pikir, pembuatan lembar kontrak komitmen jadwal, dan pengenalan aplikasi to-do list.',
    hasilLayanan: 'Siswa berkomitmen membatasi screen time maksimal pukul 22.00 WIB.',
    rencanaTindakLanjut: 'Evaluasi jadwal belajar pada tanggal 10 Oktober 2026.',
    statusTindakLanjut: 'Dalam Proses',
    tanggalTindakLanjut: '2026-10-10',
    catatanInternal: 'Siswa memiliki motivasi intrinsik yang bagus.',
    status: 'Membutuhkan tindak lanjut',
    tanggalDibuat: '2026-09-28T11:00:00Z',
    groupCode: DEFAULT_GROUP_CODE
  },
  {
    id: 'srv_002',
    idSiswa: 'usr_siswa_2',
    namaSiswa: 'Alya Putri Salsabila',
    kelasSiswa: 'X E-3',
    idGuru: 'usr_guru_2',
    namaGuru: 'Ahmad Fauzi, S.Pd., Gr.',
    tanggal: '2026-10-01',
    jenisLayanan: 'Perencanaan individual',
    tujuan: 'Pemberian informasi pemetaan bakat minat dan peminatan mata pelajaran.',
    permasalahan: 'Bimbang memilih paket peminatan saintek vs soshum.',
    tindakan: 'Interpretasi hasil asesmen AUM dan tes bakat minat sekolah.',
    hasilLayanan: 'Siswa mantap memilih fokus sosial humaniora dengan tujuan studi Ilmu Hubungan Internasional.',
    status: 'Selesai',
    statusTindakLanjut: 'Selesai',
    tanggalDibuat: '2026-10-01T14:00:00Z',
    groupCode: DEFAULT_GROUP_CODE
  }
];

export const INITIAL_PROGRAMS: BkProgram[] = [
  {
    id: 'prg_001',
    namaProgram: 'Pekan Orientasi Kesehatan Mental & Manajemen Stres Remaja',
    jenisLayanan: 'Bimbingan klasikal',
    sasaran: 'Seluruh Siswa Kelas X & XI',
    tanggalPelaksanaan: '2026-10-20',
    tujuanLayanan: 'Meningkatkan kesadaran self-care, resiliensi emosi, dan pencegahan burnout akademik.',
    materiLayanan: 'Teknik Relaksasi Regulasi Emosi, Positive Self-Talk, dan Stop Cyberbullying.',
    keterangan: 'Dilaksanakan serentak di Aula Utama dan pendalaman materi di kelas masing-masing.',
    groupCode: DEFAULT_GROUP_CODE
  },
  {
    id: 'prg_002',
    namaProgram: 'Edu-Expo & Workshop Pemilihan Studi Lanjut Perguruan Tinggi',
    jenisLayanan: 'Layanan dasar',
    sasaran: 'Siswa Kelas XII & Orang Tua Siswa',
    tanggalPelaksanaan: '2026-11-05',
    tujuanLayanan: 'Memberikan informasi komprehensif jalur masuk PTN, PTS unggulan, dan program beasiswa.',
    materiLayanan: 'Strategi SNBP/SNBT, Portofolio Prestasi, dan Wawancara Beasiswa.',
    keterangan: 'Menghadirkan narasumber dari perguruan tinggi terkemuka dan alumni inspiratif.',
    groupCode: DEFAULT_GROUP_CODE
  }
];

export const INITIAL_DIARY: DiaryEntry[] = [
  {
    id: 'dry_001',
    idSiswa: 'usr_siswa_1',
    judul: 'Hari yang Tenang Setelah Menyelesaikan Tugas',
    isi: 'Hari ini aku mencoba menyelesaikan tugas Matematika lebih awal sebelum sore. Rasanya jauh lebih plong dan tidak gelisah saat malam hari. Aku juga sempat mendengarkan audio suara hujan di fitur refleksi, sangat menenangkan.',
    kondisiPerasaan: 'Tenang dan bangga pada diri sendiri',
    mood: 'Senang',
    tanggal: '2026-10-06T19:30:00Z',
    groupCode: DEFAULT_GROUP_CODE
  }
];

export const INITIAL_TODOS: TodoItem[] = [
  {
    id: 'td_001',
    idSiswa: 'usr_siswa_1',
    kegiatan: 'Mengerjakan resume Fisika Bab Gelombang',
    tanggal: '2026-10-08',
    waktu: '16:00',
    prioritas: 'Tinggi',
    status: 'selesai',
    groupCode: DEFAULT_GROUP_CODE
  },
  {
    id: 'td_002',
    idSiswa: 'usr_siswa_1',
    kegiatan: 'Latihan pernapasan 5 menit sebelum tidur',
    tanggal: '2026-10-08',
    waktu: '21:30',
    prioritas: 'Sedang',
    status: 'belum',
    groupCode: DEFAULT_GROUP_CODE
  },
  {
    id: 'td_003',
    idSiswa: 'usr_siswa_1',
    kegiatan: 'Menyiapkan berkas pertanyaan untuk sesi konseling BK',
    tanggal: '2026-10-10',
    waktu: '09:00',
    prioritas: 'Tinggi',
    status: 'belum',
    groupCode: DEFAULT_GROUP_CODE
  }
];

export const INITIAL_CHATS = [
  {
    id: 'chat_001',
    idPercakapan: 'conv_s1_g1',
    idSiswa: 'usr_siswa_1',
    idGuru: 'usr_guru_1',
    namaPengirim: 'Muhammad Rizky Pratama',
    pengirim: 'siswa' as const,
    pesan: 'Assalamu’alaikum Ibu Siti, saya sudah mengisi lembar DCM terkait manajemen belajar.',
    waktu: '2026-10-02T10:30:00Z',
    statusPesan: 'dibaca' as const,
    groupCode: DEFAULT_GROUP_CODE
  },
  {
    id: 'chat_002',
    idPercakapan: 'conv_s1_g1',
    idSiswa: 'usr_siswa_1',
    idGuru: 'usr_guru_1',
    namaPengirim: 'Dra. Hj. Siti Rahmawati, M.Pd., Kons.',
    pengirim: 'guru_bk' as const,
    pesan: 'Wa’alaikumsalam Rizky. Baik nak, Ibu sudah menelaah hasilnya. Kita diskusikan lebih mendalam pada sesi jadwal konseling ya.',
    waktu: '2026-10-02T11:05:00Z',
    statusPesan: 'dibaca' as const,
    groupCode: DEFAULT_GROUP_CODE
  }
];
