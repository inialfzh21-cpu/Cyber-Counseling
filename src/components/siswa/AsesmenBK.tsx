import React, { useState } from 'react';
import { 
  FileCheck2, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  CheckCircle, 
  History, 
  Sparkles,
  AlertCircle,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../lib/storage';
import { AssessmentType, AssessmentAspect, AssessmentQuestion, AssessmentResult } from '../../types';
import { Breadcrumb } from '../common/Breadcrumb';

export const AsesmenBK: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [selectedInstrumen, setSelectedInstrumen] = useState<AssessmentType>('DCM');
  const [selectedAspek, setSelectedAspek] = useState<AssessmentAspect>('Pribadi');
  const [isTakingTest, setIsTakingTest] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'pilih' | 'riwayat'>('pilih');
  const [lastCompletedResult, setLastCompletedResult] = useState<AssessmentResult | null>(null);

  if (!currentUser) return null;

  const allQuestions = storage.getQuestions().filter(q => q.statusAktif);
  const currentFilteredQuestions = allQuestions.filter(
    q => q.jenisAsesmen === selectedInstrumen && q.kategori === selectedAspek
  );

  const riwayatSiswa = storage.getResultsBySiswa(currentUser.id);

  const handleStartAsesmen = () => {
    if (currentFilteredQuestions.length === 0) {
      showToast(`Belum ada soal aktif untuk instrumen ${selectedInstrumen} (${selectedAspek}).`, 'info');
      return;
    }
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setIsTakingTest(true);
    setLastCompletedResult(null);
  };

  const handleSelectAnswer = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentFilteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFinishAsesmen = () => {
    // Calculate simple score
    let totalScore = 0;
    const detailList: { aspek: string; skor: number; kategoriTingkat: 'Rendah' | 'Sedang' | 'Tinggi'; keterangan: string }[] = [];

    currentFilteredQuestions.forEach(q => {
      const ans = userAnswers[q.id];
      if (ans && q.bobotNilai) {
        const optIndex = q.pilihanJawaban.indexOf(ans);
        if (optIndex >= 0 && q.bobotNilai[optIndex] !== undefined) {
          totalScore += q.bobotNilai[optIndex];
        }
      }
    });

    const level: 'Rendah' | 'Sedang' | 'Tinggi' = 
      totalScore >= 5 ? 'Tinggi' : totalScore >= 2 ? 'Sedang' : 'Rendah';

    const keteranganLevel = 
      level === 'Tinggi' 
        ? 'Ditemukan beberapa indikator masalah yang memerlukan pendampingan konsultasi lebih lanjut bersama Guru BK.'
        : level === 'Sedang'
        ? 'Terdapat beberapa tantangan wajar dalam tahap penyesuaian diri dan belajar.'
        : 'Kondisi relatif stabil dan terkendali dengan baik.';

    detailList.push({
      aspek: selectedAspek,
      skor: totalScore,
      kategoriTingkat: level,
      keterangan: keteranganLevel
    });

    const newResult: AssessmentResult = {
      id: 'res_' + Date.now(),
      idSiswa: currentUser.id,
      namaSiswa: currentUser.nama,
      kelasSiswa: currentUser.kelas || '-',
      jenisKelamin: currentUser.jenisKelamin,
      idAsesmen: selectedInstrumen,
      jenisAsesmen: selectedInstrumen,
      aspekBK: selectedAspek,
      jawaban: userAnswers,
      skorTotal: totalScore,
      ringkasan: `Hasil pengerjaan ${selectedInstrumen} bidang ${selectedAspek}: Tingkat kebutuhan bimbingan ${level}. ${keteranganLevel}`,
      detailHasil: detailList,
      tanggalPengerjaan: new Date().toISOString(),
      groupCode: currentUser.groupCode
    };

    storage.saveResult(newResult);
    setIsTakingTest(false);
    setLastCompletedResult(newResult);
    showToast('Asesmen berhasil diselesaikan dan disimpan.', 'success');
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Asesmen BK' }]} />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">
            Asesmen Kebutuhan & Masalah BK
          </h1>
          <p className="text-xs sm:text-sm text-[#8A674A] dark:text-[#BA9B81] mt-0.5">
            Membantu mengenali potensi, peminatan belajar, dan tantangan yang sedang kamu hadapi.
          </p>
        </div>

        {/* Tab Switcher */}
        {!isTakingTest && (
          <div className="flex rounded-xl bg-[#FAF4ED] dark:bg-[#2C1E15] p-1 border border-[#EADCCB] dark:border-[#402E20]">
            <button
              onClick={() => { setActiveTab('pilih'); setLastCompletedResult(null); }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'pilih'
                  ? 'bg-[#8B5E3C] text-white shadow-xs'
                  : 'text-[#7D5C40] dark:text-[#C5A893]'
              }`}
            >
              Pilih Asesmen
            </button>
            <button
              onClick={() => { setActiveTab('riwayat'); setLastCompletedResult(null); }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'riwayat'
                  ? 'bg-[#8B5E3C] text-white shadow-xs'
                  : 'text-[#7D5C40] dark:text-[#C5A893]'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Riwayat ({riwayatSiswa.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* IF TAKING TEST VIEW */}
      {isTakingTest ? (
        <div className="bg-white dark:bg-[#251B13] rounded-3xl p-6 sm:p-8 border border-[#E8DEC8] dark:border-[#3E2D20] shadow-sm max-w-3xl mx-auto space-y-6">
          {/* Test Meta Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B5E3C] dark:text-[#D4A373]">
                {selectedInstrumen} • Bidang {selectedAspek}
              </span>
              <h2 className="text-base font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">
                Pertanyaan {currentQuestionIndex + 1} dari {currentFilteredQuestions.length}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-[#8C6D53]">
                Progress: {Math.round(((currentQuestionIndex + 1) / currentFilteredQuestions.length) * 100)}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#FAF5EE] dark:bg-[#342419] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#8B5E3C] h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / currentFilteredQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Box */}
          {currentFilteredQuestions[currentQuestionIndex] && (
            <div className="py-4 space-y-5">
              <div className="p-5 rounded-2xl bg-[#FAF5EE] dark:bg-[#2E2017] border border-[#E8DCCB] dark:border-[#443122]">
                <p className="text-base font-semibold text-[#4A3525] dark:text-[#F3E9DD] leading-relaxed">
                  "{currentFilteredQuestions[currentQuestionIndex].pertanyaan}"
                </p>
              </div>

              {/* Answer Choices */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-[#8A674A] dark:text-[#BA9B81] uppercase tracking-wider">
                  Pilih Jawaban yang Paling Sesuai:
                </p>
                <div className="grid grid-cols-1 gap-2.5">
                  {currentFilteredQuestions[currentQuestionIndex].pilihanJawaban.map((opt, i) => {
                    const isSelected = userAnswers[currentFilteredQuestions[currentQuestionIndex].id] === opt;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectAnswer(currentFilteredQuestions[currentQuestionIndex].id, opt)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between text-sm ${
                          isSelected
                            ? 'bg-[#8B5E3C] text-white border-[#8B5E3C] font-semibold shadow-sm'
                            : 'bg-white dark:bg-[#2A1E16] text-[#4A3525] dark:text-[#F3E9DD] border-[#E8DEC8] dark:border-[#423122] hover:bg-[#FDF9F5]'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle className="w-4 h-4 shrink-0 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 border-t border-[#E8DEC8] dark:border-[#3E2D20] flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2.5 rounded-xl border border-[#E0D2C0] text-[#6E4F32] dark:text-[#D1B8A5] text-xs sm:text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            <div className="flex items-center gap-2">
              {currentQuestionIndex < currentFilteredQuestions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#8B5E3C]/20 flex items-center gap-1.5"
                >
                  <span>Lanjut</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinishAsesmen}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Selesai & Simpan Hasil</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : lastCompletedResult ? (
        /* RESULT SUMMARY FOR STUDENT (NO PRINT / DOWNLOAD ACCESS PER SPEC) */
        <div className="bg-white dark:bg-[#251B13] rounded-3xl p-6 sm:p-8 border border-[#E8DEC8] dark:border-[#3E2D20] shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">
              Asesmen Berhasil Diselesaikan!
            </h2>
            <p className="text-xs text-[#8A674A] dark:text-[#BA9B81] mt-1">
              Data pengerjaanmu telah otomatis tercatat dan tersimpan rapi di sistem BK.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF5EE] dark:bg-[#2E2017] border border-[#E8DCCB] dark:border-[#443122] space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
              <span className="text-[#8C6D53]">Instrumen / Aspek:</span>
              <span className="font-bold text-[#4A3525] dark:text-[#F3E9DD]">
                {lastCompletedResult.jenisAsesmen} • {lastCompletedResult.aspekBK}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
              <span className="text-[#8C6D53]">Waktu Pengerjaan:</span>
              <span className="font-medium text-[#4A3525] dark:text-[#F3E9DD]">
                {new Date(lastCompletedResult.tanggalPengerjaan).toLocaleString('id-ID')}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#4A3525] dark:text-[#F3E9DD] mb-1">
                Ringkasan Hasil:
              </p>
              <p className="text-xs text-[#6F523B] dark:text-[#C5A893] leading-relaxed">
                {lastCompletedResult.ringkasan}
              </p>
            </div>
          </div>

          {/* Privacy Note Reminder: Student cannot print/download */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-snug">
              Hasil lengkap dan analisis formal akan ditelaah oleh Guru BK Anda. Sesuai asas kerahasiaan layanan BK, pencetakan dan pengunduhan berkas fisik hanya dapat dilakukan oleh Guru BK berwenang.
            </p>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => { setLastCompletedResult(null); setActiveTab('pilih'); }}
              className="px-6 py-2.5 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#8B5E3C]/20"
            >
              Kembali ke Menu Asesmen
            </button>
          </div>
        </div>
      ) : activeTab === 'pilih' ? (
        /* SELECTION VIEW */
        <div className="space-y-6">
          {/* Instructions Card */}
          <div className="p-5 rounded-2xl bg-[#FAF5EE] dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20]">
            <div className="flex items-center gap-2 mb-2 text-[#8B5E3C] dark:text-[#D4A373] font-bold text-sm">
              <HelpCircle className="w-4 h-4" />
              <span>Petunjuk Pengerjaan Asesmen BK:</span>
            </div>
            <ul className="text-xs text-[#70543E] dark:text-[#B6967E] space-y-1.5 list-disc list-inside leading-relaxed">
              <li>Pilih jenis instrumen (DCM, AUM, atau Sosiometri) serta aspek yang ingin dikerjakan.</li>
              <li>Jawablah seluruh pernyataan secara jujur sesuai keadaan diri kamu yang sebenarnya.</li>
              <li>Tidak ada jawaban benar atau salah; semua jawaban dijamin kerahasiaannya untuk kemajuan belajarmu.</li>
            </ul>
          </div>

          {/* Step 1: Select Instrument */}
          <div>
            <h3 className="text-sm font-bold text-[#4A3525] dark:text-[#F3E9DD] mb-3">
              1. Pilih Jenis Instrumen Asesmen:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { type: 'DCM' as AssessmentType, title: 'DCM (Daftar Cek Masalah)', desc: 'Mengidentifikasi beban masalah pada aspek diri, sosial, studi, dan karier.' },
                { type: 'AUM' as AssessmentType, title: 'AUM (Alat Ungkap Masalah)', desc: 'Mengungkap hambatan belajar dan kebutuhan layanan bimbingan prioritas.' },
                { type: 'Sosiometri' as AssessmentType, title: 'Sosiometri Siswa', desc: 'Memetakan dinamika hubungan antarteman dan kerja sama kelompok di kelas.' }
              ].map(item => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setSelectedInstrumen(item.type)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedInstrumen === item.type
                      ? 'bg-[#8B5E3C] text-white border-[#8B5E3C] shadow-md shadow-[#8B5E3C]/20'
                      : 'bg-white dark:bg-[#251B13] text-[#4A3525] dark:text-[#F3E9DD] border-[#E8DEC8] dark:border-[#3E2D20] hover:bg-[#FAF4ED]'
                  }`}
                >
                  <p className="font-bold text-sm">{item.title}</p>
                  <p className={`text-xs mt-1.5 leading-relaxed ${
                    selectedInstrumen === item.type ? 'text-stone-200' : 'text-[#8C6D53] dark:text-[#A88C76]'
                  }`}>
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Select Aspect */}
          <div>
            <h3 className="text-sm font-bold text-[#4A3525] dark:text-[#F3E9DD] mb-3">
              2. Pilih Aspek Bidang BK:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['Pribadi', 'Sosial', 'Belajar', 'Karier'] as AssessmentAspect[]).map(aspek => (
                <button
                  key={aspek}
                  type="button"
                  onClick={() => setSelectedAspek(aspek)}
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    selectedAspek === aspek
                      ? 'bg-[#A77953] text-white border-[#A77953] font-bold shadow-xs'
                      : 'bg-white dark:bg-[#251B13] text-[#4A3525] dark:text-[#F3E9DD] border-[#E8DEC8] dark:border-[#3E2D20] hover:bg-[#FAF4ED]'
                  }`}
                >
                  <span className="text-sm">Aspek {aspek}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Start Action */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-extrabold text-sm text-[#4A3525] dark:text-[#F3E9DD]">
                Instrumen Dipilih: {selectedInstrumen} ({selectedAspek})
              </p>
              <p className="text-xs text-[#8A674A] dark:text-[#BA9B81] mt-0.5">
                Jumlah soal aktif tersedia: <span className="font-bold text-[#8B5E3C]">{currentFilteredQuestions.length} butir</span>
              </p>
            </div>

            <button
              onClick={handleStartAsesmen}
              disabled={currentFilteredQuestions.length === 0}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm shadow-md shadow-[#8B5E3C]/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Mulai Asesmen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* RIWAYAT ASESMEN SISWA (READ-ONLY FOR STUDENT, NO PRINT / DOWNLOAD) */
        <div className="space-y-4">
          <p className="text-xs text-[#8A674A] dark:text-[#BA9B81]">
            Berikut adalah riwayat asesmen yang telah kamu selesaikan:
          </p>

          {riwayatSiswa.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#251B13] rounded-2xl border border-[#E8DEC8] dark:border-[#3E2D20] text-xs text-[#8C6D53]">
              Belum ada riwayat asesmen tersimpan. Silakan kerjakan asesmen pertamamu.
            </div>
          ) : (
            <div className="space-y-3">
              {riwayatSiswa.map(item => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#4A3525] dark:text-[#F3E9DD]">
                        {item.jenisAsesmen} • {item.aspekBK}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#9A7D66]">
                      {new Date(item.tanggalPengerjaan).toLocaleDateString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>

                  <p className="text-xs text-[#6F523B] dark:text-[#C5A893] bg-[#FAF5EE] dark:bg-[#2E2017] p-3 rounded-xl border border-[#E8DCCB] dark:border-[#423122]">
                    {item.ringkasan}
                  </p>

                  {item.catatanGuru && (
                    <div className="mt-2 text-xs text-[#2D6A4F] bg-[#EBF7EE] dark:bg-[#1E3A2B] p-2.5 rounded-lg border border-[#B7E4C7] dark:border-[#2D6A4F]">
                      <strong>Catatan Guru BK:</strong> {item.catatanGuru}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
