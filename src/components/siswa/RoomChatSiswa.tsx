import React, { useState, useEffect, useRef } from 'react';
import { Send, UserCheck, MessageSquare, Clock, Check, CheckCheck, Smile } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storage } from '../../lib/storage';
import { User, ChatMessage } from '../../types';
import { Breadcrumb } from '../common/Breadcrumb';

export const RoomChatSiswa: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const guruList = storage.getUsersByGroup().filter(u => u.role === 'guru_bk' && u.statusAkun === 'aktif' && u.tersediaKonseling !== false);
  const [selectedGuruId, setSelectedGuruId] = useState<string>(guruList[0]?.id || '');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  if (!currentUser) return null;

  const selectedGuru = guruList.find(g => g.id === selectedGuruId) || guruList[0];

  const loadMessages = () => {
    if (selectedGuru) {
      const chats = storage.getChats(currentUser.id, selectedGuru.id);
      setMessages(chats);
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedGuruId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedGuru) return;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      idPercakapan: `conv_${currentUser.id}_${selectedGuru.id}`,
      idSiswa: currentUser.id,
      idGuru: selectedGuru.id,
      namaPengirim: currentUser.nama,
      pengirim: 'siswa',
      pesan: inputMessage.trim(),
      waktu: new Date().toISOString(),
      statusPesan: 'terkirim',
      groupCode: currentUser.groupCode
    };

    storage.saveChat(newMsg);
    setInputMessage('');
    loadMessages();

    // Auto-reply simulation from Counselor after 2.5 seconds if this is student's inquiry
    setTimeout(() => {
      const autoResponses = [
        'Terima kasih sudah berbagi, nak. Ibu/Bapak memahami perasaanmu. Jangan ragu untuk bercerita lebih lanjut ya.',
        'Pesanmu sudah kami terima dengan baik. Mari kita diskusikan lebih lanjut pada jadwal konseling atau melalui ruang chat ini.',
        'Tetap semangat ya! Kamu sudah melakukan langkah yang hebat dengan berani mengekspresikan apa yang kamu rasakan hari ini.'
      ];
      const replyText = autoResponses[Math.floor(Math.random() * autoResponses.length)];

      const counselorReply: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        idPercakapan: `conv_${currentUser.id}_${selectedGuru.id}`,
        idSiswa: currentUser.id,
        idGuru: selectedGuru.id,
        namaPengirim: selectedGuru.nama,
        pengirim: 'guru_bk',
        pesan: replyText,
        waktu: new Date().toISOString(),
        statusPesan: 'terkirim',
        groupCode: currentUser.groupCode
      };
      storage.saveChat(counselorReply);
      loadMessages();
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Room Chat Konseling' }]} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">
            Room Chat Konseling Siswa
          </h1>
          <p className="text-xs sm:text-sm text-[#8A674A] dark:text-[#BA9B81] mt-0.5">
            Komunikasi tertutup dan rahasia langsung dengan Guru Bimbingan dan Konseling.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[560px]">
        {/* Left: Counselor List */}
        <div className="bg-white dark:bg-[#251B13] rounded-3xl p-4 border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs flex flex-col">
          <p className="text-xs font-bold text-[#8A674A] dark:text-[#BA9B81] uppercase tracking-wider px-2 mb-3">
            Pilih Guru BK:
          </p>

          <div className="flex-1 overflow-y-auto space-y-2">
            {guruList.map(guru => {
              const isSelected = guru.id === selectedGuruId;
              return (
                <button
                  key={guru.id}
                  onClick={() => setSelectedGuruId(guru.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-[#FAF2E8] dark:bg-[#342419] border-[#8B5E3C] shadow-sm'
                      : 'bg-white dark:bg-[#251B13] border-[#E8DEC8] dark:border-[#3E2D20] hover:bg-[#FAF5EE]'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={guru.fotoProfil || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'}
                      alt={guru.nama}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-[#C89D7C]"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] truncate">
                      {guru.nama}
                    </p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                      Aktif Konseling
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Window */}
        <div className="md:col-span-2 bg-white dark:bg-[#251B13] rounded-3xl border border-[#E8DEC8] dark:border-[#3E2D20] shadow-xs flex flex-col overflow-hidden">
          {selectedGuru ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-[#E8DEC8] dark:border-[#3E2D20] bg-[#FDFBF7] dark:bg-[#2A1E16] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedGuru.fotoProfil || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'}
                    alt={selectedGuru.nama}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#C89D7C]"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-[#4A3525] dark:text-[#F3E9DD]">
                      {selectedGuru.nama}
                    </h3>
                    <p className="text-[11px] text-[#8C6D53] dark:text-[#BA9B81]">
                      NIP: {selectedGuru.nipNik || '-'} • Ruang Konseling Terjaga
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF7F2]/50 dark:bg-[#1E1611]/50">
                {messages.length === 0 ? (
                  <div className="py-16 text-center text-xs text-[#8C6D53]">
                    Belum ada percakapan dengan {selectedGuru.nama}.<br />
                    Mulai obrolan untuk mencurahkan pertanyaan atau masalahmu.
                  </div>
                ) : (
                  messages.map(msg => {
                    const isSelf = msg.pengirim === 'siswa';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm shadow-xs ${
                            isSelf
                              ? 'bg-[#8B5E3C] text-white rounded-br-none'
                              : 'bg-white dark:bg-[#2C1E15] text-[#4A3525] dark:text-[#F3E9DD] border border-[#E8DEC8] dark:border-[#443122] rounded-bl-none'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.pesan}</p>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-[#A08168] mt-1 px-1">
                          <span>
                            {new Date(msg.waktu).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isSelf && <CheckCheck className="w-3 h-3 text-[#8B5E3C]" />}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-[#251B13] border-t border-[#E8DEC8] dark:border-[#3E2D20] flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ketik pesan konseling di sini..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2E2017] border border-[#E5DAC8] dark:border-[#4B3728] text-xs sm:text-sm text-[#4A3525] dark:text-[#F3E9DD] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-2.5 rounded-xl bg-[#8B5E3C] hover:bg-[#724B2E] disabled:bg-stone-300 disabled:cursor-not-allowed text-white shadow-md shadow-[#8B5E3C]/20 transition-all shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-xs text-[#8A674A]">
              Pilih Guru BK di sebelah kiri untuk memulai percakapan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
