import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HeaderNav } from './components/layout/HeaderNav';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { LoginModal, RegisterModal } from './components/auth/AuthModals';

// Student Components
import { SiswaDashboard } from './components/siswa/SiswaDashboard';
import { AsesmenBK } from './components/siswa/AsesmenBK';
import { RefleksiSiswa } from './components/siswa/RefleksiSiswa';
import { RoomChatSiswa } from './components/siswa/RoomChatSiswa';
import { JanjiKonselingSiswa } from './components/siswa/JanjiKonselingSiswa';
import { DiarySiswa } from './components/siswa/DiarySiswa';
import { TodoListSiswa } from './components/siswa/TodoListSiswa';
import { ProfilSiswa } from './components/siswa/ProfilSiswa';

// Counselor (Guru BK) Components
import { GuruDashboard } from './components/guru/GuruDashboard';
import { ManajemenBK } from './components/guru/ManajemenBK';
import { DataSiswaGuru } from './components/guru/DataSiswaGuru';
import { HasilAsesmenGuru } from './components/guru/HasilAsesmenGuru';
import { RekapHasilAsesmenGuru } from './components/guru/RekapHasilAsesmenGuru';
import { RoomChatGuru } from './components/guru/RoomChatGuru';
import { JanjiKonselingGuru } from './components/guru/JanjiKonselingGuru';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { KelolaGuru } from './components/admin/KelolaGuru';
import { KelolaSiswa } from './components/admin/KelolaSiswa';
import { KelolaAsesmen } from './components/admin/KelolaAsesmen';
import { DatabaseGoogleSheets } from './components/admin/DatabaseGoogleSheets';
import { PengaturanSistem } from './components/admin/PengaturanSistem';

// Print Modal View
import { PrintDocumentView } from './components/common/PrintDocumentView';
import { AssessmentResult } from './types';

const MainApp: React.FC = () => {
  const { currentUser, role, login } = useAuth();
  const { showToast } = useToast();

  const [activeMenu, setActiveMenu] = useState<string>('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('cyber_dark_mode') === 'true';
  });

  // Landing & Auth modal states
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [registerRoleTab, setRegisterRoleTab] = useState<'siswa' | 'guru'>('siswa');

  // Print Document View States
  const [printDocumentState, setPrintDocumentState] = useState<{
    isOpen: boolean;
    type: 'individual' | 'recap';
    individualResult?: AssessmentResult;
    recapResults?: AssessmentResult[];
    recapFilterDetails?: any;
  }>({
    isOpen: false,
    type: 'individual'
  });

  // Dark Mode toggle effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('cyber_dark_mode', String(darkMode));
  }, [darkMode]);

  // Reset active menu to Dashboard when role changes
  useEffect(() => {
    setActiveMenu('Dashboard');
  }, [role]);

  const handleOpenPrintIndividual = (result: AssessmentResult) => {
    setPrintDocumentState({
      isOpen: true,
      type: 'individual',
      individualResult: result
    });
  };

  const handleOpenPrintRecap = (filteredResults: AssessmentResult[], filterDetails: any) => {
    setPrintDocumentState({
      isOpen: true,
      type: 'recap',
      recapResults: filteredResults,
      recapFilterDetails: filterDetails
    });
  };

  // If user is not logged in, render the Landing Page
  if (!currentUser) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <LandingPage
          onOpenLogin={() => setLoginModalOpen(true)}
          onOpenRegister={(roleTab = 'siswa') => {
            setRegisterRoleTab(roleTab);
            setRegisterModalOpen(true);
          }}
        />

        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onSwitchToRegister={() => setRegisterModalOpen(true)}
        />

        <RegisterModal
          isOpen={registerModalOpen}
          onClose={() => setRegisterModalOpen(false)}
          onSwitchToLogin={() => setLoginModalOpen(true)}
          defaultTab={registerRoleTab}
        />
      </div>
    );
  }

  // Render role-based active menu content
  const renderContent = () => {
    // 1. SISWA VIEWS
    if (role === 'siswa') {
      switch (activeMenu) {
        case 'Dashboard':
          return <SiswaDashboard onNavigate={(menu) => setActiveMenu(menu)} />;
        case 'Asesmen BK':
          return <AsesmenBK />;
        case 'Refleksi Siswa':
          return <RefleksiSiswa />;
        case 'Room Chat Konseling':
          return <RoomChatSiswa />;
        case 'Janji Konseling':
          return <JanjiKonselingSiswa />;
        case 'Diary / Self Journal':
          return <DiarySiswa />;
        case 'To-Do List':
          return <TodoListSiswa />;
        case 'Profil':
          return <ProfilSiswa />;
        default:
          return <SiswaDashboard onNavigate={(menu) => setActiveMenu(menu)} />;
      }
    }

    // 2. GURU BK VIEWS
    if (role === 'guru_bk') {
      switch (activeMenu) {
        case 'Dashboard':
          return (
            <GuruDashboard
              onNavigate={(menu) => setActiveMenu(menu)}
              onOpenRecapFilterModal={() => setActiveMenu('Rekap Hasil Asesmen')}
            />
          );
        case 'Manajemen BK':
        case 'Program/Layanan BK':
          return <ManajemenBK initialSubmenu="program" />;
        case 'Catatan Layanan BK':
          return <ManajemenBK initialSubmenu="catatan" />;
        case 'Tindak Lanjut Siswa':
          return <ManajemenBK initialSubmenu="tindak_lanjut" />;
        case 'Rekap Layanan BK':
          return <ManajemenBK initialSubmenu="rekap" />;
        case 'Data Siswa':
          return <DataSiswaGuru />;
        case 'Hasil Asesmen':
          return (
            <HasilAsesmenGuru
              onOpenPrintIndividual={handleOpenPrintIndividual}
              onOpenPrintRecap={handleOpenPrintRecap}
            />
          );
        case 'Rekap Hasil Asesmen':
          return (
            <RekapHasilAsesmenGuru
              onOpenPrintRecap={handleOpenPrintRecap}
            />
          );
        case 'Room Chat':
          return <RoomChatGuru />;
        case 'Janji Konseling':
          return <JanjiKonselingGuru />;
        case 'Profil':
          return <ProfilSiswa />;
        default:
          return (
            <GuruDashboard
              onNavigate={(menu) => setActiveMenu(menu)}
              onOpenRecapFilterModal={() => setActiveMenu('Rekap Hasil Asesmen')}
            />
          );
      }
    }

    // 3. ADMIN VIEWS
    if (role === 'admin') {
      switch (activeMenu) {
        case 'Dashboard':
          return <AdminDashboard onNavigate={(menu) => setActiveMenu(menu)} />;
        case 'Data Guru':
          return <KelolaGuru />;
        case 'Data Siswa':
          return <KelolaSiswa />;
        case 'Data Asesmen & Soal':
          return <KelolaAsesmen />;
        case 'Database & Google Sheets':
          return <DatabaseGoogleSheets />;
        case 'Pengaturan Sistem':
          return <PengaturanSistem />;
        case 'Profil':
          return <ProfilSiswa />;
        default:
          return <AdminDashboard onNavigate={(menu) => setActiveMenu(menu)} />;
      }
    }

    return null;
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#FDFBF7] dark:bg-[#1C140E] text-[#3D2C1E] dark:text-[#F1E4D6] transition-colors ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar for Desktop and Mobile Drawer */}
      <Sidebar
        activeMenu={activeMenu}
        onSelectMenu={(menu) => setActiveMenu(menu)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main App Container */}
      <div className="lg:pl-72 flex flex-col flex-1 min-h-screen">
        {/* Header Navigation Bar */}
        <HeaderNav
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activeMenu={activeMenu}
          onSelectMenu={(menu) => setActiveMenu(menu)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />

        {/* Main Body View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in">
          {renderContent()}
        </main>

        {/* Footer with ALFZH branding */}
        <Footer />
      </div>

      {/* Official Print View (Triggered by Guru BK) */}
      {printDocumentState.isOpen && (
        <PrintDocumentView
          type={printDocumentState.type}
          individualResult={printDocumentState.individualResult}
          recapResults={printDocumentState.recapResults}
          recapFilterDetails={printDocumentState.recapFilterDetails}
          guruNama={currentUser.nama}
          guruNip={currentUser.nipNik}
          onClose={() => setPrintDocumentState(prev => ({ ...prev, isOpen: false }))}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}
