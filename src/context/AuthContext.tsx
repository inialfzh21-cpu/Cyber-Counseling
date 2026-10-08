import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { storage } from '../lib/storage';

interface AuthContextValue {
  currentUser: User | null;
  role: UserRole | null;
  activeGroupCode: string;
  login: (username: string, passwordPlain: string, kodeDatabase?: string) => Promise<{ success: boolean; message: string }>;
  registerSiswa: (data: {
    nama: string;
    jenisKelamin: 'Laki-laki' | 'Perempuan';
    email: string;
    username: string;
    passwordPlain: string;
    kelas: string;
    kodeDatabase: string;
  }) => Promise<{ success: boolean; message: string }>;
  registerGuru: (data: {
    nama: string;
    jenisKelamin: 'Laki-laki' | 'Perempuan';
    email: string;
    username: string;
    passwordPlain: string;
    nipNik: string;
    kodeDatabase: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateCurrentUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => storage.getCurrentUser());
  const [activeGroupCode, setActiveGroupCode] = useState<string>(() => storage.getActiveGroupCode());

  useEffect(() => {
    const handleStorageUpdate = () => {
      setCurrentUser(storage.getCurrentUser());
      setActiveGroupCode(storage.getActiveGroupCode());
    };
    window.addEventListener('cyber_storage_updated', handleStorageUpdate);
    return () => window.removeEventListener('cyber_storage_updated', handleStorageUpdate);
  }, []);

  const login = async (username: string, passwordPlain: string, kodeDatabaseInput?: string): Promise<{ success: boolean; message: string }> => {
    const trimmedUser = username.trim();
    const trimmedPass = passwordPlain.trim();

    // Check system admin
    if (trimmedUser === 'admincybercounseling' && trimmedPass === 'saacounseling') {
      let admin = storage.getUsers().find(u => u.username === 'admincybercounseling');
      if (!admin) {
        admin = {
          id: 'usr_admin',
          nama: 'Administrator Utama BK',
          jenisKelamin: 'Laki-laki',
          email: 'admin.cyber@sekolah.sch.id',
          username: 'admincybercounseling',
          passwordHash: 'saacounseling',
          role: 'admin',
          fotoProfil: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          statusAkun: 'aktif',
          tanggalDibuat: new Date().toISOString(),
          groupCode: storage.getActiveGroupCode()
        };
        storage.saveUser(admin);
      }
      storage.setCurrentUser(admin);
      setCurrentUser(admin);
      return { success: true, message: 'Selamat datang di Dashboard Admin CYBER-COUNSELING.' };
    }

    const allUsers = storage.getUsers();
    const user = allUsers.find(u => u.username.toLowerCase() === trimmedUser.toLowerCase());

    if (!user) {
      return { success: false, message: 'Username tidak ditemukan dalam sistem.' };
    }

    if (user.statusAkun !== 'aktif') {
      return { success: false, message: 'Akun Anda saat ini sedang dinonaktifkan oleh Administrator.' };
    }

    // Verify password (plain check or hash check)
    const enteredHash = await storage.hashPassword(trimmedPass);
    const isValid = user.passwordHash === trimmedPass || user.passwordHash === enteredHash;

    if (!isValid) {
      return { success: false, message: 'Password yang Anda masukkan salah.' };
    }

    // Check grouping code if provided
    const sysSettings = storage.getSettings();
    const targetGroup = kodeDatabaseInput?.trim() || user.groupCode || sysSettings.kodeDatabase;
    if (user.role !== 'admin' && kodeDatabaseInput && kodeDatabaseInput.trim().toUpperCase() !== user.groupCode.toUpperCase()) {
      return { 
        success: false, 
        message: `Kode Lembaga/Database tidak cocok dengan data terdaftar Anda (${user.groupCode}).` 
      };
    }

    storage.setActiveGroupCode(targetGroup);
    storage.setCurrentUser(user);
    setCurrentUser(user);

    return { 
      success: true, 
      message: `Selamat datang kembali, ${user.nama} (${user.role === 'guru_bk' ? 'Guru BK' : 'Siswa'}).` 
    };
  };

  const registerSiswa = async (data: {
    nama: string;
    jenisKelamin: 'Laki-laki' | 'Perempuan';
    email: string;
    username: string;
    passwordPlain: string;
    kelas: string;
    kodeDatabase: string;
  }): Promise<{ success: boolean; message: string }> => {
    const existing = storage.getUsers().find(u => u.username.toLowerCase() === data.username.trim().toLowerCase());
    if (existing) {
      return { success: false, message: 'Username sudah digunakan oleh akun lain. Silakan pilih username berbeda.' };
    }

    const emailExist = storage.getUsers().find(u => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (emailExist) {
      return { success: false, message: 'Alamat email sudah terdaftar dalam sistem.' };
    }

    const passwordHash = await storage.hashPassword(data.passwordPlain);
    const groupCode = data.kodeDatabase.trim() || storage.getActiveGroupCode();

    const newUser: User = {
      id: 'usr_siswa_' + Date.now(),
      nama: data.nama.trim(),
      jenisKelamin: data.jenisKelamin,
      email: data.email.trim(),
      username: data.username.trim(),
      passwordHash,
      role: 'siswa',
      kelas: data.kelas.trim(),
      statusAkun: 'aktif',
      tanggalDibuat: new Date().toISOString(),
      groupCode,
      fotoProfil: data.jenisKelamin === 'Perempuan' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
    };

    storage.saveUser(newUser);
    storage.setCurrentUser(newUser);
    setCurrentUser(newUser);

    return { success: true, message: 'Pendaftaran Siswa berhasil! Anda telah masuk secara otomatis.' };
  };

  const registerGuru = async (data: {
    nama: string;
    jenisKelamin: 'Laki-laki' | 'Perempuan';
    email: string;
    username: string;
    passwordPlain: string;
    nipNik: string;
    kodeDatabase: string;
  }): Promise<{ success: boolean; message: string }> => {
    const existing = storage.getUsers().find(u => u.username.toLowerCase() === data.username.trim().toLowerCase());
    if (existing) {
      return { success: false, message: 'Username sudah digunakan oleh akun lain. Silakan pilih username berbeda.' };
    }

    const passwordHash = await storage.hashPassword(data.passwordPlain);
    const groupCode = data.kodeDatabase.trim() || storage.getActiveGroupCode();

    const newUser: User = {
      id: 'usr_guru_' + Date.now(),
      nama: data.nama.trim(),
      jenisKelamin: data.jenisKelamin,
      email: data.email.trim(),
      username: data.username.trim(),
      passwordHash,
      role: 'guru_bk',
      nipNik: data.nipNik.trim(),
      tersediaKonseling: true,
      statusAkun: 'aktif',
      tanggalDibuat: new Date().toISOString(),
      groupCode,
      fotoProfil: data.jenisKelamin === 'Perempuan' 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
    };

    storage.saveUser(newUser);
    storage.setCurrentUser(newUser);
    setCurrentUser(newUser);

    return { success: true, message: 'Pendaftaran Guru BK berhasil! Anda telah masuk ke dashboard layanan BK.' };
  };

  const logout = () => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
  };

  const updateCurrentUser = (updated: Partial<User>) => {
    if (!currentUser) return;
    const fullUpdated = { ...currentUser, ...updated };
    storage.saveUser(fullUpdated);
    setCurrentUser(fullUpdated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        activeGroupCode,
        login,
        registerSiswa,
        registerGuru,
        logout,
        updateCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
