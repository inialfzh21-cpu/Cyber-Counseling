import React, { useState, useEffect, useRef } from 'react';
import { Send, UserCheck, MessageSquare, CheckCheck, Clock, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../lib/storage';
import { ChatMessage, User } from '../../types';
import { Breadcrumb } from '../common/Breadcrumb';

export const RoomChatGuru: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const students = storage.getUsersByGroup().filter(u => u.role === 'siswa');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  if (!currentUser) return null;

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const loadMessages = () => {
    if (selectedStudent) {
      const chats = storage.getChats(selectedStudent.id, currentUser.id);
      setMessages(chats);
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedStudentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedStudent) return;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      idPercakapan: `conv_${selectedStudent.id}_${currentUser.id}`,
      idSiswa: selectedStudent.id,
      idGuru: currentUser.id,
      namaPengirim: currentUser.nama,
      pengirim: 'guru_bk',
      pesan: inputMessage.trim(),
      waktu: new Date().toISOString(),
      statusPesan: 'terkirim',
      groupCode: currentUser.groupCode
    };

    storage.saveChat(newMsg);
    setInputMessage('');
    loadMessages();
    showToast('Balasan pesan konseling terkirim.', 'success');
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Room Chat' }]} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">
            Ruang Percakapan Konseling Guru BK
          </h1>
          <p className="text-xs sm:text-sm text-[#8A674A] dark:text-[#BA9B81] mt-0.5">
            Komunikasi tertutup satu-lawan-satu dengan masing-masing siswa yang membutuhkan bimbingan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[560px]">
        {/* Left: Students Thread List */}
        <div className="bg-white dark:bg-[#251B13] rounded-3xl p-4 border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs flex flex-col">
          <p className="text-xs font-bold text-[#8A674A] dark:text-[#BA9B81] uppercase tracking-wider px-2 mb-3">
            Daftar Siswa Berkonseling:
          </p>

          <div className="flex-1 overflow-y-auto space-y-2">
            {students.map(student => {
              const isSelected = student.id === selectedStudentId;
              const studentChats = storage.getChats(student.id, currentUser.id);
              const lastMsg = studentChats[studentChats.length - 1];

              return (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-[#FAF2E8] dark:bg-[#342419] border-[#8B5E3C] shadow-sm'
                      : 'bg-white dark:bg-[#251B13] border-[#E8DEC8] dark:border-[#3E2D20] hover:bg-[#FAF5EE]'
                  }`}
                >
                  <img
                    src={student.fotoProfil || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={student.nama}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#C89D7C] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-extrabold text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] truncate">
                        {student.nama}
                      </p>
                    </div>
                    <p className="text-[11px] text-[#8C6D53] truncate">
                      {student.kelas} • {lastMsg ? `"${lastMsg.pesan.slice(0, 25)}..."` : 'Mulai sesi baru'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat View */}
        <div className="md:col-span-2 bg-white dark:bg-[#251B13] rounded-3xl border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs flex flex-col overflow-hidden">
          {selectedStudent ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-[#E8DEC8] dark:border-[#3E2D20] bg-[#FDFBF7] dark:bg-[#2A1E16] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedStudent.fotoProfil || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={selectedStudent.nama}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#C89D7C]"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-[#4A3525] dark:text-[#F3E9DD]">
                      {selectedStudent.nama}
                    </h3>
                    <p className="text-[11px] text-[#8C6D53]">
                      Kelas: {selectedStudent.kelas} • Email: {selectedStudent.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Message Box */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF7F2]/50 dark:bg-[#1E1611]/50">
                {messages.length === 0 ? (
                  <div className="py-16 text-center text-xs text-[#8C6D53]">
                    Belum ada percakapan dengan {selectedStudent.nama}.<br />
                    Kirim sapaan pembuka atau tanggapan untuk memulai bimbingan.
                  </div>
                ) : (
                  messages.map(msg => {
                    const isSelf = msg.pengirim === 'guru_bk';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm shadow-xs ${
                            isSelf
                              ? 'bg-[#5C4033] text-white rounded-br-none'
                              : 'bg-white dark:bg-[#2C1E15] text-[#4A3525] dark:text-[#F3E9DD] border border-[#E8DEC8] dark:border-[#443122] rounded-bl-none'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.pesan}</p>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-[#A08168] mt-1 px-1">
                          <span>
                            {new Date(msg.waktu).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isSelf && <CheckCheck className="w-3 h-3 text-[#5C4033]" />}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-[#251B13] border-t border-[#E8DEC8] dark:border-[#3E2D20] flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Ketik pesan bimbingan untuk ${selectedStudent.nama}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-2.5 rounded-xl bg-[#5C4033] hover:bg-[#473026] disabled:bg-stone-300 disabled:cursor-not-allowed text-white shadow-md shadow-[#5C4033]/20 transition-all shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-xs text-[#8A674A]">
              Pilih siswa di sebelah kiri untuk melihat pesan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
