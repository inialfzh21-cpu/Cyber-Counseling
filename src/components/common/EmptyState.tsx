import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="py-12 px-4 text-center rounded-2xl border-2 border-dashed border-[#E5DAC8] dark:border-[#3E2D20] bg-[#FAF5EE]/50 dark:bg-[#231912]/50 flex flex-col items-center justify-center my-4">
      <div className="w-14 h-14 rounded-2xl bg-[#EFE3D5] dark:bg-[#342419] flex items-center justify-center text-[#8B5E3C] dark:text-[#D4A373] mb-3 shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-bold text-base text-[#4A3525] dark:text-[#F3E9DD]">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[#8A674A] dark:text-[#BA9B81] max-w-sm mt-1 mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#8B5E3C] text-white hover:bg-[#724B2E] transition-all shadow-md shadow-[#8B5E3C]/20"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
