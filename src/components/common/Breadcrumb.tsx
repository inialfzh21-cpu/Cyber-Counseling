import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  items: { label: string; onClick?: () => void }[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#8A674A] dark:text-[#BA9B81] mb-4">
      <div className="flex items-center gap-1 text-[#6A4728] dark:text-[#E2C7B0] font-semibold">
        <Home className="w-3.5 h-3.5" />
        <span>BK</span>
      </div>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3 h-3 text-[#C89D7C] shrink-0" />
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="hover:text-[#4A3525] dark:hover:text-[#F3E9DD] hover:underline font-medium"
            >
              {item.label}
            </button>
          ) : (
            <span className={`font-semibold ${index === items.length - 1 ? 'text-[#4A3525] dark:text-[#F3E9DD]' : ''}`}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
