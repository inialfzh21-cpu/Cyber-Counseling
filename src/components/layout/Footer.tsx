import React from 'react';
import { storage } from '../../lib/storage';

export const Footer: React.FC = () => {
  const settings = storage.getSettings();

  return (
    <footer className="mt-auto py-5 px-6 sm:px-8 border-t border-[#EAE0D2] dark:border-[#382619] bg-[#FAF7F2] dark:bg-[#1A120D] text-[#806045] dark:text-[#BCA088] text-xs transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="font-extrabold text-[#362215] dark:text-[#F6EDE3] tracking-tight">CYBER-COUNSELING</span>
          <span className="text-[#C5A059]">•</span>
          <span className="font-medium text-[#5A3C24] dark:text-[#E2C7B0]">{settings.namaSekolah}</span>
        </div>

        <div className="flex items-center gap-4 text-center sm:text-right">
          <span className="text-[11px] text-[#8E6E54] dark:text-[#A88E77]">
            Media Pendukung Layanan BK © {new Date().getFullYear()}
          </span>
          {/* USER REQUIREMENT: Tambahkan tulisan ALFZH pada pojok bawah setiap halaman */}
          <span className="font-extrabold tracking-widest text-[#5C3B20] dark:text-[#E5CCA8] bg-[#EFE3D3] dark:bg-[#2B1D14] px-3 py-1 rounded-full text-[11px] border border-[#DECBB8] dark:border-[#4A3423] shadow-xs">
            ALFZH
          </span>
        </div>
      </div>
    </footer>
  );
};
