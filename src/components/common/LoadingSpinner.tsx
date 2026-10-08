import React from 'react';

export const LoadingSpinner: React.FC<{ text?: string }> = ({ text = 'Memuat data...' }) => {
  return (
    <div className="py-12 flex flex-col items-center justify-center gap-3">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-[#EADAC8] dark:border-[#3E2D20] border-t-[#8B5E3C] dark:border-t-[#D4A373] animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-[#C89D7C] animate-ping opacity-25" />
      </div>
      <p className="text-xs font-medium text-[#8A674A] dark:text-[#BA9B81] animate-pulse">
        {text}
      </p>
    </div>
  );
};
