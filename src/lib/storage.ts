import { 
  User, 
  UserRole,
  AssessmentQuestion, 
  AssessmentResult, 
  CounselingAppointment, 
  BkServiceRecord, 
  BkProgram,
  DiaryEntry,
  TodoItem,
  ChatMessage,
  AppNotification,
  SystemSettings,
  GoogleSheetsConfig
} from '../types';
import { 
  DEFAULT_GROUP_CODE,
  INITIAL_SETTINGS, 
  INITIAL_USERS, 
  INITIAL_QUESTIONS, 
  INITIAL_ASSESSMENT_RESULTS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_BK_SERVICES, 
  INITIAL_PROGRAMS, 
  INITIAL_DIARY, 
  INITIAL_TODOS, 
  INITIAL_CHATS 
} from './seedData';

const STORAGE_KEYS = {
  CURRENT_USER: 'cyber_current_user',
  SETTINGS: 'cyber_settings',
  USERS: 'cyber_users',
  QUESTIONS: 'cyber_questions',
  RESULTS: 'cyber_results',
  APPOINTMENTS: 'cyber_appointments',
  SERVICES: 'cyber_services',
  PROGRAMS: 'cyber_programs',
  DIARY: 'cyber_diary',
  TODOS: 'cyber_todos',
  CHATS: 'cyber_chats',
  NOTIFICATIONS: 'cyber_notifications',
  GSHEETS: 'cyber_gsheets_config',
  ACTIVE_GROUP_CODE: 'cyber_active_group_code'
};

// Safe JSON parser
function safeParse<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key}:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('cyber_storage_updated'));
  } catch (e) {
    console.error(`Error writing ${key}:`, e);
  }
}

// Storage manager class
class StorageService {
  private initialized = false;

  public init() {
    if (this.initialized) return;

    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      safeSet(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      safeSet(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
      safeSet(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.RESULTS)) {
      safeSet(STORAGE_KEYS.RESULTS, INITIAL_ASSESSMENT_RESULTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      safeSet(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      safeSet(STORAGE_KEYS.SERVICES, INITIAL_BK_SERVICES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROGRAMS)) {
      safeSet(STORAGE_KEYS.PROGRAMS, INITIAL_PROGRAMS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DIARY)) {
      safeSet(STORAGE_KEYS.DIARY, INITIAL_DIARY);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TODOS)) {
      safeSet(STORAGE_KEYS.TODOS, INITIAL_TODOS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CHATS)) {
      safeSet(STORAGE_KEYS.CHATS, INITIAL_CHATS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.GSHEETS)) {
      const defaultGSheets: GoogleSheetsConfig = {
        connected: false,
        sharedEmails: [],
        autoSync: true
      };
      safeSet(STORAGE_KEYS.GSHEETS, defaultGSheets);
    }

    this.initialized = true;
  }

  // Active Group Code (multi-tenant code)
  public getActiveGroupCode(): string {
    const settings = this.getSettings();
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_GROUP_CODE) || settings.kodeDatabase || DEFAULT_GROUP_CODE;
  }

  public setActiveGroupCode(code: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_GROUP_CODE, code);
    window.dispatchEvent(new Event('cyber_storage_updated'));
  }

  // Current session
  public getCurrentUser(): User | null {
    return safeParse<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  public setCurrentUser(user: User | null): void {
    if (user) {
      safeSet(STORAGE_KEYS.CURRENT_USER, user);
      this.setActiveGroupCode(user.groupCode);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      window.dispatchEvent(new Event('cyber_storage_updated'));
    }
  }

  // Settings
  public getSettings(): SystemSettings {
    this.init();
    return safeParse<SystemSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  public updateSettings(settings: Partial<SystemSettings>): SystemSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    safeSet(STORAGE_KEYS.SETTINGS, updated);
    if (settings.kodeDatabase) {
      this.setActiveGroupCode(settings.kodeDatabase);
    }
    return updated;
  }

  // Users
  public getUsers(): User[] {
    this.init();
    return safeParse<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  public getUsersByGroup(groupCode?: string): User[] {
    const code = groupCode || this.getActiveGroupCode();
    return this.getUsers().filter(u => u.role === 'admin' || u.groupCode === code);
  }

  public saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    safeSet(STORAGE_KEYS.USERS, users);

    // Update current session if editing self
    const curr = this.getCurrentUser();
    if (curr && curr.id === user.id) {
      safeSet(STORAGE_KEYS.CURRENT_USER, user);
    }
  }

  public deleteUser(userId: string): void {
    const users = this.getUsers().filter(u => u.id !== userId);
    safeSet(STORAGE_KEYS.USERS, users);
  }

  // Assessment Questions
  public getQuestions(): AssessmentQuestion[] {
    this.init();
    return safeParse<AssessmentQuestion[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
  }

  public saveQuestion(question: AssessmentQuestion): void {
    const questions = this.getQuestions();
    const index = questions.findIndex(q => q.id === question.id);
    if (index >= 0) {
      questions[index] = question;
    } else {
      questions.push(question);
    }
    safeSet(STORAGE_KEYS.QUESTIONS, questions);
  }

  public deleteQuestion(questionId: string): void {
    const questions = this.getQuestions().filter(q => q.id !== questionId);
    safeSet(STORAGE_KEYS.QUESTIONS, questions);
  }

  // Assessment Results
  public getResults(groupCode?: string): AssessmentResult[] {
    this.init();
    const code = groupCode || this.getActiveGroupCode();
    const all = safeParse<AssessmentResult[]>(STORAGE_KEYS.RESULTS, INITIAL_ASSESSMENT_RESULTS);
    return all.filter(r => !r.groupCode || r.groupCode === code);
  }

  public getResultsBySiswa(siswaId: string): AssessmentResult[] {
    return this.getResults().filter(r => r.idSiswa === siswaId);
  }

  public saveResult(result: AssessmentResult): void {
    const all = safeParse<AssessmentResult[]>(STORAGE_KEYS.RESULTS, INITIAL_ASSESSMENT_RESULTS);
    const index = all.findIndex(r => r.id === result.id);
    if (index >= 0) {
      all[index] = result;
    } else {
      all.unshift(result);
    }
    safeSet(STORAGE_KEYS.RESULTS, all);

    // Add notification for Guru BK
    this.createNotification({
      userId: 'usr_guru_1',
      judul: 'Hasil Asesmen Baru',
      pesan: `Siswa ${result.namaSiswa} telah menyelesaikan asesmen ${result.jenisAsesmen} (${result.aspekBK}).`,
      tipe: 'asesmen',
      linkMenu: 'Hasil Asesmen'
    });
  }

  // Appointments
  public getAppointments(groupCode?: string): CounselingAppointment[] {
    this.init();
    const code = groupCode || this.getActiveGroupCode();
    const all = safeParse<CounselingAppointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    return all.filter(a => !a.groupCode || a.groupCode === code);
  }

  public saveAppointment(appointment: CounselingAppointment): void {
    const all = safeParse<CounselingAppointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    const index = all.findIndex(a => a.id === appointment.id);
    if (index >= 0) {
      all[index] = appointment;
    } else {
      all.unshift(appointment);
    }
    safeSet(STORAGE_KEYS.APPOINTMENTS, all);
  }

  public deleteAppointment(appointmentId: string): void {
    const all = safeParse<CounselingAppointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    safeSet(STORAGE_KEYS.APPOINTMENTS, all.filter(a => a.id !== appointmentId));
  }

  // BK Services & Follow-ups
  public getServices(groupCode?: string): BkServiceRecord[] {
    this.init();
    const code = groupCode || this.getActiveGroupCode();
    const all = safeParse<BkServiceRecord[]>(STORAGE_KEYS.SERVICES, INITIAL_BK_SERVICES);
    return all.filter(s => !s.groupCode || s.groupCode === code);
  }

  public saveService(service: BkServiceRecord): void {
    const all = safeParse<BkServiceRecord[]>(STORAGE_KEYS.SERVICES, INITIAL_BK_SERVICES);
    const index = all.findIndex(s => s.id === service.id);
    if (index >= 0) {
      all[index] = service;
    } else {
      all.unshift(service);
    }
    safeSet(STORAGE_KEYS.SERVICES, all);
  }

  public deleteService(serviceId: string): void {
    const all = safeParse<BkServiceRecord[]>(STORAGE_KEYS.SERVICES, INITIAL_BK_SERVICES);
    safeSet(STORAGE_KEYS.SERVICES, all.filter(s => s.id !== serviceId));
  }

  // BK Programs
  public getPrograms(groupCode?: string): BkProgram[] {
    this.init();
    const code = groupCode || this.getActiveGroupCode();
    const all = safeParse<BkProgram[]>(STORAGE_KEYS.PROGRAMS, INITIAL_PROGRAMS);
    return all.filter(p => !p.groupCode || p.groupCode === code);
  }

  public saveProgram(program: BkProgram): void {
    const all = safeParse<BkProgram[]>(STORAGE_KEYS.PROGRAMS, INITIAL_PROGRAMS);
    const index = all.findIndex(p => p.id === program.id);
    if (index >= 0) {
      all[index] = program;
    } else {
      all.unshift(program);
    }
    safeSet(STORAGE_KEYS.PROGRAMS, all);
  }

  public deleteProgram(programId: string): void {
    const all = safeParse<BkProgram[]>(STORAGE_KEYS.PROGRAMS, INITIAL_PROGRAMS);
    safeSet(STORAGE_KEYS.PROGRAMS, all.filter(p => p.id !== programId));
  }

  // Diary (Private to Student)
  public getDiary(siswaId: string): DiaryEntry[] {
    this.init();
    const all = safeParse<DiaryEntry[]>(STORAGE_KEYS.DIARY, INITIAL_DIARY);
    return all.filter(d => d.idSiswa === siswaId);
  }

  public saveDiary(entry: DiaryEntry): void {
    const all = safeParse<DiaryEntry[]>(STORAGE_KEYS.DIARY, INITIAL_DIARY);
    const index = all.findIndex(d => d.id === entry.id);
    if (index >= 0) {
      all[index] = entry;
    } else {
      all.unshift(entry);
    }
    safeSet(STORAGE_KEYS.DIARY, all);
  }

  public deleteDiary(entryId: string): void {
    const all = safeParse<DiaryEntry[]>(STORAGE_KEYS.DIARY, INITIAL_DIARY);
    safeSet(STORAGE_KEYS.DIARY, all.filter(d => d.id !== entryId));
  }

  // To-Do List (Student)
  public getTodos(siswaId: string): TodoItem[] {
    this.init();
    const all = safeParse<TodoItem[]>(STORAGE_KEYS.TODOS, INITIAL_TODOS);
    return all.filter(t => t.idSiswa === siswaId);
  }

  public saveTodo(item: TodoItem): void {
    const all = safeParse<TodoItem[]>(STORAGE_KEYS.TODOS, INITIAL_TODOS);
    const index = all.findIndex(t => t.id === item.id);
    if (index >= 0) {
      all[index] = item;
    } else {
      all.unshift(item);
    }
    safeSet(STORAGE_KEYS.TODOS, all);
  }

  public deleteTodo(itemId: string): void {
    const all = safeParse<TodoItem[]>(STORAGE_KEYS.TODOS, INITIAL_TODOS);
    safeSet(STORAGE_KEYS.TODOS, all.filter(t => t.id !== itemId));
  }

  // Chat
  public getChats(idSiswa: string, idGuru?: string): ChatMessage[] {
    this.init();
    const all = safeParse<ChatMessage[]>(STORAGE_KEYS.CHATS, INITIAL_CHATS);
    return all.filter(c => {
      if (idGuru) {
        return (c.idSiswa === idSiswa && c.idGuru === idGuru);
      }
      return c.idSiswa === idSiswa;
    });
  }

  public saveChat(msg: ChatMessage): void {
    const all = safeParse<ChatMessage[]>(STORAGE_KEYS.CHATS, INITIAL_CHATS);
    all.push(msg);
    safeSet(STORAGE_KEYS.CHATS, all);

    // If sent by student, notify teacher
    if (msg.pengirim === 'siswa') {
      this.createNotification({
        userId: msg.idGuru,
        judul: 'Pesan Chat Baru',
        pesan: `Pesan baru dari ${msg.namaPengirim}: "${msg.pesan.slice(0, 40)}..."`,
        tipe: 'chat',
        linkMenu: 'Room Chat'
      });
    } else {
      // If sent by teacher, notify student
      this.createNotification({
        userId: msg.idSiswa,
        judul: 'Balasan Chat Konseling',
        pesan: `Guru BK telah membalas pesan konseling Anda.`,
        tipe: 'chat',
        linkMenu: 'Room Chat Konseling'
      });
    }
  }

  // Notifications
  public getNotifications(userId: string): AppNotification[] {
    const all = safeParse<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    return all.filter(n => n.userId === userId);
  }

  public createNotification(data: Omit<AppNotification, 'id' | 'waktu' | 'dibaca'>): void {
    const all = safeParse<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const newNotif: AppNotification = {
      ...data,
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      waktu: new Date().toISOString(),
      dibaca: false
    };
    all.unshift(newNotif);
    // Keep last 50
    safeSet(STORAGE_KEYS.NOTIFICATIONS, all.slice(0, 50));
  }

  public markNotificationRead(notifId: string): void {
    const all = safeParse<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const target = all.find(n => n.id === notifId);
    if (target) {
      target.dibaca = true;
      safeSet(STORAGE_KEYS.NOTIFICATIONS, all);
    }
  }

  public markAllNotificationsRead(userId: string): void {
    const all = safeParse<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    all.forEach(n => {
      if (n.userId === userId) n.dibaca = true;
    });
    safeSet(STORAGE_KEYS.NOTIFICATIONS, all);
  }

  // Google Sheets Config
  public getGoogleSheetsConfig(): GoogleSheetsConfig {
    return safeParse<GoogleSheetsConfig>(STORAGE_KEYS.GSHEETS, {
      connected: false,
      sharedEmails: [],
      autoSync: true
    });
  }

  public saveGoogleSheetsConfig(config: Partial<GoogleSheetsConfig>): GoogleSheetsConfig {
    const current = this.getGoogleSheetsConfig();
    const updated = { ...current, ...config };
    safeSet(STORAGE_KEYS.GSHEETS, updated);
    return updated;
  }

  // RBAC Permission Guards (Security Requirement)
  public canPrintOrDownloadAssessment(role: UserRole): boolean {
    // STRICT RULE: Only Guru BK is authorized to print or download assessment results and recaps
    return role === 'guru_bk';
  }

  public canManageAssessmentQuestions(role: UserRole): boolean {
    return role === 'admin';
  }

  public canManageSystemSettings(role: UserRole): boolean {
    return role === 'admin';
  }

  // Export & Import Database
  public exportDatabaseJson(): string {
    const data = {
      exportedAt: new Date().toISOString(),
      groupCode: this.getActiveGroupCode(),
      settings: this.getSettings(),
      users: this.getUsers(),
      questions: this.getQuestions(),
      results: safeParse(STORAGE_KEYS.RESULTS, []),
      appointments: safeParse(STORAGE_KEYS.APPOINTMENTS, []),
      services: safeParse(STORAGE_KEYS.SERVICES, []),
      programs: safeParse(STORAGE_KEYS.PROGRAMS, []),
      diary: safeParse(STORAGE_KEYS.DIARY, []),
      todos: safeParse(STORAGE_KEYS.TODOS, []),
      chats: safeParse(STORAGE_KEYS.CHATS, [])
    };
    return JSON.stringify(data, null, 2);
  }

  public importDatabaseJson(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) safeSet(STORAGE_KEYS.SETTINGS, data.settings);
      if (data.users) safeSet(STORAGE_KEYS.USERS, data.users);
      if (data.questions) safeSet(STORAGE_KEYS.QUESTIONS, data.questions);
      if (data.results) safeSet(STORAGE_KEYS.RESULTS, data.results);
      if (data.appointments) safeSet(STORAGE_KEYS.APPOINTMENTS, data.appointments);
      if (data.services) safeSet(STORAGE_KEYS.SERVICES, data.services);
      if (data.programs) safeSet(STORAGE_KEYS.PROGRAMS, data.programs);
      if (data.diary) safeSet(STORAGE_KEYS.DIARY, data.diary);
      if (data.todos) safeSet(STORAGE_KEYS.TODOS, data.todos);
      if (data.chats) safeSet(STORAGE_KEYS.CHATS, data.chats);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }

  // Reset all data to factory seed
  public resetAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    this.init();
    window.dispatchEvent(new Event('cyber_storage_updated'));
  }

  // Simple Hash Simulator for Password Security
  public async hashPassword(password: string): Promise<string> {
    try {
      const enc = new TextEncoder().encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      return btoa(password); // fallback
    }
  }
}

export const storage = new StorageService();
storage.init();
