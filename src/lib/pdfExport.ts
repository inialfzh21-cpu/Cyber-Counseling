import { jsPDF } from 'jspdf';
import { AssessmentResult, UserRole } from '../types';
import { storage } from './storage';

// Validate that only Guru BK can print or download
export const assertCanPrintOrDownload = (role: UserRole) => {
  if (role !== 'guru_bk') {
    throw new Error('Akses Ditolak: Hanya Guru BK yang memiliki wewenang untuk mencetak atau mengunduh dokumen asesmen.');
  }
};

export interface AssessmentPdfOptions {
  result: AssessmentResult;
  guruNama: string;
  guruNip?: string;
  role: UserRole;
}

export const downloadIndividualAssessmentPdf = ({
  result,
  guruNama,
  guruNip = '-',
  role
}: AssessmentPdfOptions) => {
  assertCanPrintOrDownload(role);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const settings = storage.getSettings();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Watermark (DOKUMEN TERBATAS – DATA LAYANAN BK)
  doc.saveGraphicsState();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(230, 215, 200);
  doc.text('DOKUMEN TERBATAS – DATA LAYANAN BK', pageWidth / 2, pageHeight / 2, {
    align: 'center',
    angle: 45
  });
  doc.restoreGraphicsState();

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(74, 53, 37); // #4A3525
  doc.text('CYBER-COUNSELING', pageWidth / 2, 20, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(110, 85, 65);
  doc.text('Media Pendukung Layanan Bimbingan dan Konseling', pageWidth / 2, 26, { align: 'center' });
  doc.text(settings.namaSekolah.toUpperCase(), pageWidth / 2, 31, { align: 'center' });

  // Divider Line
  doc.setDrawColor(180, 140, 110);
  doc.setLineWidth(0.8);
  doc.line(20, 36, pageWidth - 20, 36);
  doc.setLineWidth(0.2);
  doc.line(20, 37.5, pageWidth - 20, 37.5);

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(74, 53, 37);
  doc.text('HASIL ASESMEN BIMBINGAN DAN KONSELING', pageWidth / 2, 47, { align: 'center' });

  // Student Identity Box
  doc.setFillColor(250, 246, 240);
  doc.roundedRect(20, 52, pageWidth - 40, 38, 2, 2, 'F');
  doc.setDrawColor(210, 190, 170);
  doc.roundedRect(20, 52, pageWidth - 40, 38, 2, 2, 'D');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(74, 53, 37);
  doc.text('IDENTITAS SISWA & INSTRUMEN', 25, 59);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);

  const leftX = 25;
  const valLeftX = 65;
  const rightX = 115;
  const valRightX = 155;

  doc.text('Nama Siswa', leftX, 66);
  doc.text(`: ${result.namaSiswa}`, valLeftX, 66);

  doc.text('Jenis Kelamin', leftX, 73);
  doc.text(`: ${result.jenisKelamin}`, valLeftX, 73);

  doc.text('Kelas', leftX, 80);
  doc.text(`: ${result.kelasSiswa}`, valLeftX, 80);

  doc.text('Jenis Asesmen', rightX, 66);
  doc.text(`: ${result.jenisAsesmen}`, valRightX, 66);

  doc.text('Aspek BK', rightX, 73);
  doc.text(`: ${result.aspekBK}`, valRightX, 73);

  const tglFormatted = new Date(result.tanggalPengerjaan).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  doc.text('Tanggal Asesmen', rightX, 80);
  doc.text(`: ${tglFormatted}`, valRightX, 80);

  // Hasil Asesmen
  let currentY = 98;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(74, 53, 37);
  doc.text('RINGKASAN & DETAIL HASIL', 20, currentY);

  currentY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);

  // Summary box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(210, 190, 170);
  doc.roundedRect(20, currentY, pageWidth - 40, 18, 1, 1, 'D');
  const splitSummary = doc.splitTextToSize(`Kesimpulan: ${result.ringkasan}`, pageWidth - 50);
  doc.text(splitSummary, 25, currentY + 6);

  currentY += 24;

  // Detail table header
  doc.setFillColor(235, 222, 210);
  doc.rect(20, currentY, pageWidth - 40, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(74, 53, 37);
  doc.text('Aspek Pengamatan', 25, currentY + 5);
  doc.text('Skor', 75, currentY + 5);
  doc.text('Tingkat Kebutuhan', 95, currentY + 5);
  doc.text('Keterangan / Indikator Masalah', 135, currentY + 5);

  currentY += 8;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);

  result.detailHasil.forEach((item) => {
    doc.text(item.aspek, 25, currentY + 4);
    doc.text(String(item.skor), 75, currentY + 4);
    doc.text(item.kategoriTingkat, 95, currentY + 4);
    const splitDesc = doc.splitTextToSize(item.keterangan, 55);
    doc.text(splitDesc, 135, currentY + 4);
    
    currentY += Math.max(7, splitDesc.length * 4);
    doc.setDrawColor(235, 225, 215);
    doc.line(20, currentY, pageWidth - 20, currentY);
  });

  // Catatan Guru BK
  currentY += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(74, 53, 37);
  doc.text('CATATAN & REKOMENDASI GURU BK', 20, currentY);

  currentY += 4;
  doc.setFillColor(250, 246, 240);
  doc.roundedRect(20, currentY, pageWidth - 40, 22, 1, 1, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);

  const catatanText = result.catatanGuru || 'Siswa menunjukkan kesediaan terbuka dalam bimbingan layanan konseling.';
  const rekText = result.rekomendasiGuru || 'Diberikan pendampingan bimbingan secara berkala sesuai kebutuhan.';
  doc.text(`Catatan: ${catatanText}`, 25, currentY + 6);
  doc.text(`Rekomendasi: ${rekText}`, 25, currentY + 13);

  // Signatures
  currentY += 28;
  const signDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  doc.setFontSize(8.5);
  doc.text(`Mengetahui,`, pageWidth - 70, currentY);
  doc.text(`Guru Pembimbing BK,`, pageWidth - 70, currentY + 5);

  currentY += 24;
  doc.setFont('helvetica', 'bold');
  doc.text(guruNama, pageWidth - 70, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(`NIP: ${guruNip}`, pageWidth - 70, currentY + 4);

  // Footer Note
  doc.setFontSize(7.5);
  doc.setTextColor(140, 120, 100);
  doc.text('Dokumen ini dihasilkan secara resmi melalui sistem CYBER-COUNSELING dan bersifat RAHASIA.', pageWidth / 2, pageHeight - 12, { align: 'center' });
  doc.text(`Dicetak pada: ${signDate} | Ref: ALFZH`, pageWidth / 2, pageHeight - 8, { align: 'center' });

  // Save PDF
  const cleanName = result.namaSiswa.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanDate = result.tanggalPengerjaan.slice(0, 10);
  doc.save(`Hasil_Asesmen_${cleanName}_${cleanDate}.pdf`);
};

// Recap Assessment PDF
export interface RecapPdfOptions {
  results: AssessmentResult[];
  guruNama: string;
  guruNip?: string;
  periodeStr: string;
  role: UserRole;
  filterKelas?: string;
  filterJenis?: string;
}

export const downloadRecapAssessmentPdf = ({
  results,
  guruNama,
  guruNip = '-',
  periodeStr,
  role,
  filterKelas = 'Semua',
  filterJenis = 'Semua'
}: RecapPdfOptions) => {
  assertCanPrintOrDownload(role);

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const settings = storage.getSettings();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Watermark
  doc.saveGraphicsState();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(235, 225, 215);
  doc.text('DOKUMEN TERBATAS – DATA LAYANAN BK', pageWidth / 2, pageHeight / 2, {
    align: 'center',
    angle: 25
  });
  doc.restoreGraphicsState();

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(74, 53, 37);
  doc.text('REKAP HASIL ASESMEN BIMBINGAN DAN KONSELING', pageWidth / 2, 16, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 80, 60);
  doc.text(`CYBER-COUNSELING | ${settings.namaSekolah}`, pageWidth / 2, 22, { align: 'center' });
  doc.text(`Periode: ${periodeStr} | Kelas: ${filterKelas} | Instrumen: ${filterJenis}`, pageWidth / 2, 27, { align: 'center' });

  // Divider
  doc.setDrawColor(180, 140, 110);
  doc.setLineWidth(0.6);
  doc.line(15, 31, pageWidth - 15, 31);

  // Table header
  let y = 37;
  doc.setFillColor(235, 222, 210);
  doc.rect(15, y, pageWidth - 30, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(74, 53, 37);

  doc.text('No', 18, y + 5);
  doc.text('Nama Siswa', 28, y + 5);
  doc.text('Kelas', 80, y + 5);
  doc.text('Instrumen', 105, y + 5);
  doc.text('Aspek BK', 130, y + 5);
  doc.text('Tanggal', 158, y + 5);
  doc.text('Skor', 185, y + 5);
  doc.text('Ringkasan Temuan', 200, y + 5);

  y += 9;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);

  results.forEach((item, index) => {
    if (y > pageHeight - 35) {
      doc.addPage();
      y = 20;
    }

    const tgl = item.tanggalPengerjaan.slice(0, 10);
    const splitSummary = doc.splitTextToSize(item.ringkasan, 80);

    doc.text(String(index + 1), 18, y + 4);
    doc.text(item.namaSiswa, 28, y + 4);
    doc.text(item.kelasSiswa, 80, y + 4);
    doc.text(item.jenisAsesmen, 105, y + 4);
    doc.text(item.aspekBK, 130, y + 4);
    doc.text(tgl, 158, y + 4);
    doc.text(String(item.skorTotal), 185, y + 4);
    doc.text(splitSummary, 200, y + 4);

    const rowH = Math.max(7, splitSummary.length * 3.8);
    y += rowH;
    doc.setDrawColor(240, 230, 220);
    doc.line(15, y, pageWidth - 15, y);
  });

  // Summary box
  if (y > pageHeight - 45) {
    doc.addPage();
    y = 20;
  } else {
    y += 6;
  }

  doc.setFillColor(250, 246, 240);
  doc.roundedRect(15, y, 120, 24, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(74, 53, 37);
  doc.text('Ringkasan Rekapitulasi:', 19, y + 5);

  const totalSiswa = new Set(results.map(r => r.idSiswa)).size;
  const countPribadi = results.filter(r => r.aspekBK === 'Pribadi').length;
  const countSosial = results.filter(r => r.aspekBK === 'Sosial').length;
  const countBelajar = results.filter(r => r.aspekBK === 'Belajar').length;
  const countKarier = results.filter(r => r.aspekBK === 'Karier').length;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text(`Total Peserta: ${totalSiswa} Siswa | Total Asesmen: ${results.length}`, 19, y + 11);
  doc.text(`Pribadi: ${countPribadi} | Sosial: ${countSosial} | Belajar: ${countBelajar} | Karier: ${countKarier}`, 19, y + 17);

  // Signature Block
  const signDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  doc.setFontSize(8.5);
  doc.text(`Tanggal Cetak: ${signDate}`, pageWidth - 70, y + 4);
  doc.text('Guru Bimbingan dan Konseling,', pageWidth - 70, y + 9);

  doc.setFont('helvetica', 'bold');
  doc.text(guruNama, pageWidth - 70, y + 24);
  doc.setFont('helvetica', 'normal');
  doc.text(`NIP: ${guruNip}`, pageWidth - 70, y + 28);

  // Save PDF
  const now = new Date();
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  doc.save(`Rekap_Hasil_Asesmen_BK_${monthStr}.pdf`);
};

// CSV Export for Recap
export const downloadRecapAssessmentCsv = (results: AssessmentResult[], role: UserRole) => {
  assertCanPrintOrDownload(role);

  const headers = ['No', 'ID Asesmen', 'Nama Siswa', 'Kelas', 'Jenis Kelamin', 'Jenis Asesmen', 'Aspek BK', 'Skor Total', 'Tanggal', 'Ringkasan', 'Catatan Guru'];
  const rows = results.map((r, i) => [
    i + 1,
    r.id,
    `"${r.namaSiswa.replace(/"/g, '""')}"`,
    `"${r.kelasSiswa}"`,
    r.jenisKelamin,
    r.jenisAsesmen,
    r.aspekBK,
    r.skorTotal,
    r.tanggalPengerjaan.slice(0, 10),
    `"${r.ringkasan.replace(/"/g, '""')}"`,
    `"${(r.catatanGuru || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const now = new Date();
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  link.setAttribute('download', `Rekap_Hasil_Asesmen_BK_${monthStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
