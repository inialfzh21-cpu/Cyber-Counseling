import React, { useState, useEffect, useRef } from 'react';
import { 
  Wind, 
  Heart, 
  BookOpen, 
  Gamepad2, 
  Headphones, 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  RotateCcw, 
  Info,
  CheckCircle2,
  Sparkles,
  Palette,
  Layers,
  Smile,
  CircleDot
} from 'lucide-react';
import { audioSynthesizer } from '../../lib/audioSynthesizer';
import { Breadcrumb } from '../common/Breadcrumb';

export const RefleksiSiswa: React.FC = () => {
  const [subTab, setSubTab] = useState<'pernapasan' | 'dzikir' | 'quran' | 'game' | 'sound'>('pernapasan');

  // Pernapasan State
  const [breathPhase, setBreathPhase] = useState<'Tarik Napas' | 'Tahan' | 'Buang Napas' | 'Siap'>('Siap');
  const [breathTimer, setBreathTimer] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathCycles, setBreathCycles] = useState(0);

  // Audio State
  const [activeSound, setActiveSound] = useState<'rain' | 'nature' | 'whitenoise' | 'instrumental' | null>(null);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [soundVolume, setSoundVolume] = useState(0.6);

  // Dzikir State
  const [selectedDzikirIndex, setSelectedDzikirIndex] = useState(0);
  const [dzikirCount, setDzikirCount] = useState(0);

  // Mini Game State
  const [activeGame, setActiveGame] = useState<'gelembung' | 'gambar' | 'cocok' | 'sort' | 'puzzle'>('gelembung');

  // Bubble Game State
  const [bubbles, setBubbles] = useState<{ id: number; popped: boolean }[]>(() =>
    Array.from({ length: 24 }, (_, i) => ({ id: i, popped: false }))
  );
  const [poppedCount, setPoppedCount] = useState(0);

  // Canvas Drawing State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#8B5E3C');
  const [brushSize, setBrushSize] = useState(4);

  // Card Match Game State
  const [matchCards, setMatchCards] = useState<{ id: number; symbol: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);

  // Sliding Puzzle State
  const [puzzleTiles, setPuzzleTiles] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 0]);

  // Pernapasan Loop Effect
  useEffect(() => {
    let timerId: any = null;
    if (isBreathingActive) {
      timerId = setInterval(() => {
        setBreathTimer(prev => {
          if (prev <= 1) {
            // Transition phase
            if (breathPhase === 'Tarik Napas') {
              setBreathPhase('Tahan');
              return 4;
            } else if (breathPhase === 'Tahan') {
              setBreathPhase('Buang Napas');
              return 4;
            } else if (breathPhase === 'Buang Napas') {
              setBreathPhase('Tarik Napas');
              setBreathCycles(c => c + 1);
              return 4;
            } else {
              setBreathPhase('Tarik Napas');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isBreathingActive, breathPhase]);

  const toggleBreathing = () => {
    if (isBreathingActive) {
      setIsBreathingActive(false);
      setBreathPhase('Siap');
      setBreathTimer(4);
    } else {
      setIsBreathingActive(true);
      setBreathPhase('Tarik Napas');
      setBreathTimer(4);
    }
  };

  // Sound Controls
  const handlePlaySound = (type: 'rain' | 'nature' | 'whitenoise' | 'instrumental') => {
    if (activeSound === type && isPlayingSound) {
      audioSynthesizer.pause();
      setIsPlayingSound(false);
    } else {
      setActiveSound(type);
      audioSynthesizer.play(type);
      setIsPlayingSound(true);
    }
  };

  const handleStopSound = () => {
    audioSynthesizer.stop();
    setIsPlayingSound(false);
    setActiveSound(null);
  };

  const handleVolumeChange = (v: number) => {
    setSoundVolume(v);
    audioSynthesizer.setVolume(v);
  };

  // Dzikir Data
  const dzikirList = [
    {
      arab: 'سُبْحَانَ اللَّهِ',
      latin: 'Subhanallah',
      arti: 'Maha Suci Allah dari segala kekurangan dan kepenatan dunia.',
      target: 33
    },
    {
      arab: 'الْحَمْدُ لِلَّهِ',
      latin: 'Alhamdulillah',
      arti: 'Segala puji hanya bagi Allah atas segala nikmat dan perlindungan.',
      target: 33
    },
    {
      arab: 'لَا إِلَهَ إِلَّا اللَّهُ',
      latin: 'Laa ilaaha illallah',
      arti: 'Tiada Tuhan selain Allah Yang Maha Menenangkan Jiwa.',
      target: 33
    },
    {
      arab: 'اللَّهُ أَكْبَرُ',
      latin: 'Allahu Akbar',
      arti: 'Allah Maha Besar melampaui segala beban dan kegelisahan kita.',
      target: 33
    },
    {
      arab: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ',
      latin: 'Astaghfirullahal ‘Adzim',
      arti: 'Aku memohon ampun kepada Allah Yang Maha Agung.',
      target: 33
    },
    {
      arab: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
      latin: 'Laa hawla wa laa quwwata illa billah',
      arti: 'Tiada daya dan kekuatan kecuali dengan pertolongan Allah.',
      target: 33
    }
  ];

  // Quran Verses Data
  const quranVerses = [
    {
      surah: 'QS. Ar-Ra’d: 28',
      arab: 'الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُمْ بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
      terjemahan: '(Yaitu) orang-orang yang beriman dan hati mereka menjadi tenteram dengan mengingat Allah. Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.',
      refleksi: 'Ketika pikiranmu penuh dan hatimu terasa gelisah, ambillah jeda sejenak untuk bersujud dan menenangkan jiwa.'
    },
    {
      surah: 'QS. Al-Insyirah: 5-6',
      arab: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا',
      terjemahan: 'Maka sesungguhnya beserta kesulitan ada kemudahan, sesungguhnya beserta kesulitan itu ada kemudahan.',
      refleksi: 'Setiap tantangan dan ujian tugas sekolah yang sedang kamu hadapi pasti memiliki jalan keluar yang terbaik.'
    },
    {
      surah: 'QS. Al-Baqarah: 286',
      arab: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
      terjemahan: 'Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.',
      refleksi: 'Percayalah pada potensi dirimu. Kamu jauh lebih tangguh daripada yang kamu bayangkan saat ini.'
    },
    {
      surah: 'QS. Thaha: 46',
      arab: 'قَالَ لَا تَخَافَا ۖ إِنَّنِي مَعَكُمَا أَسْمَعُ وَأَرَىٰ',
      terjemahan: 'Dia (Allah) berfirman: "Janganlah kamu berdua khawatir, sesungguhnya Aku bersama kamu berdua, Aku mendengar dan melihat."',
      refleksi: 'Kamu tidak pernah benar-benar sendirian. Selalu ada harapan dan pertolongan dalam setiap doamu.'
    }
  ];

  // Bubble Click
  const handlePopBubble = (id: number) => {
    setBubbles(prev =>
      prev.map(b => (b.id === id ? { ...b, popped: true } : b))
    );
    setPoppedCount(c => c + 1);
  };

  const handleResetBubbles = () => {
    setBubbles(Array.from({ length: 24 }, (_, i) => ({ id: i, popped: false })));
  };

  // Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Memory Card Match Init
  useEffect(() => {
    const symbols = ['🌟', '🌱', '☀️', '🕊️', '🌸', '🌊'];
    const paired = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, idx) => ({
        id: idx,
        symbol,
        flipped: false,
        matched: false
      }));
    setMatchCards(paired);
  }, []);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || matchCards[index].flipped || matchCards[index].matched) return;

    const newCards = [...matchCards];
    newCards[index].flipped = true;
    setMatchCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (newCards[first].symbol === newCards[second].symbol) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setMatchCards(newCards);
        setFlippedIndices([]);
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setMatchCards([...newCards]);
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  // Puzzle Tile Click
  const handleTileClick = (index: number) => {
    const zeroIndex = puzzleTiles.indexOf(0);
    const validMoves = [zeroIndex - 1, zeroIndex + 1, zeroIndex - 3, zeroIndex + 3];

    // Prevent wrapping around grid rows
    const isAdjacentRow = Math.abs(Math.floor(index / 3) - Math.floor(zeroIndex / 3)) <= 1;
    const isAdjacentCol = Math.abs((index % 3) - (zeroIndex % 3)) <= 1;

    if (validMoves.includes(index) && (isAdjacentRow || isAdjacentCol)) {
      const newTiles = [...puzzleTiles];
      newTiles[zeroIndex] = newTiles[index];
      newTiles[index] = 0;
      setPuzzleTiles(newTiles);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Refleksi Siswa' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">
            Ruang Refleksi & Ketenangan Siswa
          </h1>
          <p className="text-xs sm:text-sm text-[#8A674A] dark:text-[#BA9B81] mt-0.5">
            Latihan pernapasan, ketenangan batin, doa, audio menenangkan, dan permainan antistres.
          </p>
        </div>

        {/* Disclaimer Card Reminder */}
        <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-[11px] flex items-center gap-1.5 font-medium shrink-0">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Media pendukung, bukan pengganti konseling profesional.</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[#FAF4ED] dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20]">
        <button
          onClick={() => setSubTab('pernapasan')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            subTab === 'pernapasan'
              ? 'bg-[#8B5E3C] text-white shadow-sm'
              : 'text-[#7A5B40] dark:text-[#C5A893] hover:text-[#4A3525]'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>Atur Pernapasan</span>
        </button>

        <button
          onClick={() => setSubTab('dzikir')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            subTab === 'dzikir'
              ? 'bg-[#8B5E3C] text-white shadow-sm'
              : 'text-[#7A5B40] dark:text-[#C5A893] hover:text-[#4A3525]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Dzikir Refleksi</span>
        </button>

        <button
          onClick={() => setSubTab('quran')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            subTab === 'quran'
              ? 'bg-[#8B5E3C] text-white shadow-sm'
              : 'text-[#7A5B40] dark:text-[#C5A893] hover:text-[#4A3525]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Ayat Al-Qur'an</span>
        </button>

        <button
          onClick={() => setSubTab('sound')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            subTab === 'sound'
              ? 'bg-[#8B5E3C] text-white shadow-sm'
              : 'text-[#7A5B40] dark:text-[#C5A893] hover:text-[#4A3525]'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Sound Menenangkan</span>
        </button>

        <button
          onClick={() => setSubTab('game')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            subTab === 'game'
              ? 'bg-[#8B5E3C] text-white shadow-sm'
              : 'text-[#7A5B40] dark:text-[#C5A893] hover:text-[#4A3525]'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Mini Game Antistres</span>
        </button>
      </div>

      {/* SUBTAB 1: MENGATUR PERNAPASAN */}
      {subTab === 'pernapasan' && (
        <div className="bg-white dark:bg-[#251B13] rounded-3xl p-6 sm:p-10 border border-[#E8DEC8] dark:border-[#3E2D20] text-center max-w-xl mx-auto shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-black text-[#4A3525] dark:text-[#F3E9DD]">
              Relaksasi Pernapasan Segitiga (Box Breathing)
            </h2>
            <p className="text-xs text-[#8A674A] dark:text-[#BA9B81] mt-1">
              Tarik napas perlahan (4s) • Tahan (4s) • Hembuskan lembut (4s)
            </p>
          </div>

          {/* Animated Visual Circle */}
          <div className="py-8 flex items-center justify-center">
            <div className="relative flex items-center justify-center w-64 h-64">
              {/* Outer Pulsing Glow */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                  breathPhase === 'Tarik Napas'
                    ? 'scale-110 bg-[#8B5E3C]/20 blur-xl'
                    : breathPhase === 'Tahan'
                    ? 'scale-105 bg-amber-500/20 blur-xl'
                    : breathPhase === 'Buang Napas'
                    ? 'scale-90 bg-emerald-500/20 blur-xl'
                    : 'scale-95 bg-[#8B5E3C]/10 blur-md'
                }`}
              />

              {/* Expanding / Contracting Main Ring */}
              <div
                className={`rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 shadow-xl ${
                  breathPhase === 'Tarik Napas'
                    ? 'w-56 h-56 border-[#8B5E3C] bg-gradient-to-br from-[#FAF5EE] to-[#EFE3D5] dark:from-[#35251A] dark:to-[#221710] scale-105'
                    : breathPhase === 'Tahan'
                    ? 'w-52 h-52 border-amber-600 bg-gradient-to-br from-[#FFF9EE] to-[#FCECCB] dark:from-[#3B2D19] dark:to-[#281D10] scale-100'
                    : breathPhase === 'Buang Napas'
                    ? 'w-44 h-44 border-emerald-600 bg-gradient-to-br from-[#EEF9F2] to-[#D7EEDF] dark:from-[#1E3326] dark:to-[#14241B] scale-95'
                    : 'w-48 h-48 border-[#D8C4B0] bg-[#FAF5EE] dark:bg-[#2B1E16]'
                }`}
              >
                <Wind className={`w-8 h-8 mb-1 ${
                  breathPhase === 'Tarik Napas' ? 'text-[#8B5E3C] animate-bounce' :
                  breathPhase === 'Tahan' ? 'text-amber-600' :
                  breathPhase === 'Buang Napas' ? 'text-emerald-600' : 'text-stone-400'
                }`} />
                <span className="text-lg font-extrabold text-[#4A3525] dark:text-[#F3E9DD]">
                  {breathPhase}
                </span>
                <span className="text-3xl font-black text-[#8B5E3C] dark:text-[#D4A373] mt-1">
                  {breathTimer}s
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-[#8C6D53]">
            <span>Siklus Selesai: <strong>{breathCycles} kali</strong></span>
          </div>

          <div>
            <button
              onClick={toggleBreathing}
              className={`px-8 py-3 rounded-2xl text-sm font-bold text-white shadow-lg transition-all ${
                isBreathingActive
                  ? 'bg-rose-700 hover:bg-rose-800 shadow-rose-700/20'
                  : 'bg-[#8B5E3C] hover:bg-[#724B2E] shadow-[#8B5E3C]/20'
              }`}
            >
              {isBreathingActive ? 'Hentikan Latihan' : 'Mulai Latihan Pernapasan'}
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 2: DZIKIR REFLEKSI */}
      {subTab === 'dzikir' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Dzikir Selector */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#8A674A] dark:text-[#BA9B81] uppercase tracking-wider">
              Pilihan Kalimat Dzikir:
            </h3>
            {dzikirList.map((dzikir, idx) => (
              <button
                key={idx}
                onClick={() => { setSelectedDzikirIndex(idx); setDzikirCount(0); }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                  selectedDzikirIndex === idx
                    ? 'bg-[#8B5E3C] text-white border-[#8B5E3C] shadow-md shadow-[#8B5E3C]/20 font-bold'
                    : 'bg-white dark:bg-[#251B13] text-[#4A3525] dark:text-[#F3E9DD] border-[#E8DEC8] dark:border-[#3E2D20] hover:bg-[#FAF4ED]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{dzikir.latin}</span>
                  <span className="text-xs opacity-80">{dzikir.target}x</span>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Interactive Dzikir Counter */}
          <div className="md:col-span-2 bg-white dark:bg-[#251B13] rounded-3xl p-6 sm:p-8 border border-[#E8DEC8] dark:border-[#3E2D20] shadow-sm flex flex-col items-center justify-center text-center space-y-6">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FAF5EE] dark:bg-[#342419] text-[#8B5E3C] border border-[#E8DEC8] dark:border-[#3E2D20]">
              Target: {dzikirList[selectedDzikirIndex].target} Kali
            </span>

            {/* Arabic Text with Traditional Font */}
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#4A3525] dark:text-[#F3E9DD] tracking-wide py-2 leading-loose">
              {dzikirList[selectedDzikirIndex].arab}
            </h2>

            <p className="text-base font-bold text-[#8B5E3C] dark:text-[#D4A373]">
              "{dzikirList[selectedDzikirIndex].latin}"
            </p>

            <p className="text-xs text-[#70543E] dark:text-[#BA9B81] max-w-md italic">
              {dzikirList[selectedDzikirIndex].arti}
            </p>

            {/* Tap Button Counter */}
            <div className="pt-2">
              <button
                onClick={() => setDzikirCount(c => c + 1)}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-[#8B5E3C] to-[#5C3B1E] text-white shadow-xl shadow-[#8B5E3C]/30 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center"
              >
                <span className="text-3xl font-black">{dzikirCount}</span>
                <span className="text-[11px] font-semibold text-stone-200 mt-1">Ketuk (Hitung)</span>
              </button>
            </div>

            <button
              onClick={() => setDzikirCount(0)}
              className="px-3.5 py-1.5 rounded-xl border border-[#E0D2C0] text-[#7A5B40] dark:text-[#B6967D] text-xs font-semibold hover:bg-[#FAF4ED] flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Hitungan</span>
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 3: AYAT AL-QUR'AN PENENANG HATI */}
      {subTab === 'quran' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quranVerses.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20] shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#3E2D20]">
                  <span className="px-3 py-1 rounded-full bg-[#FAF5EE] dark:bg-[#342419] text-[#8B5E3C] dark:text-[#D4A373] text-xs font-bold">
                    {item.surah}
                  </span>
                  <BookOpen className="w-4 h-4 text-[#8B5E3C]" />
                </div>

                <p className="text-2xl sm:text-3xl font-serif text-right text-[#4A3525] dark:text-[#F3E9DD] py-4 leading-loose">
                  {item.arab}
                </p>

                <p className="text-xs sm:text-sm text-[#5C3F28] dark:text-[#E2C7B0] font-medium leading-relaxed">
                  "{item.terjemahan}"
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF5EE] dark:bg-[#2C1E15] border border-[#E8DCCB] dark:border-[#402E20] text-xs text-[#70543E] dark:text-[#B6967E]">
                <strong className="text-[#8B5E3C] dark:text-[#D4A373] block mb-0.5">Renungan Hati:</strong>
                {item.refleksi}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 4: SOUND MENENANGKAN (PROCEDURAL WEB AUDIO API) */}
      {subTab === 'sound' && (
        <div className="bg-white dark:bg-[#251B13] rounded-3xl p-6 sm:p-8 border border-[#E8DEC8] dark:border-[#3E2D20] shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-black text-[#4A3525] dark:text-[#F3E9DD]">
              Audio Menenangkan & Meditasi Fokus
            </h2>
            <p className="text-xs text-[#8A674A] dark:text-[#BA9B81] mt-1">
              Dihasilkan secara prosedural (tanpa perlu koneksi streaming berat) untuk relaksasi belajar.
            </p>
          </div>

          {/* Sound Choices */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { type: 'rain' as const, title: 'Suara Hujan', desc: 'Rintik hujan lembut yang meredakan stres' },
              { type: 'nature' as const, title: 'Suara Alam & Angin', desc: 'Hutan damai dan nada angin alami' },
              { type: 'whitenoise' as const, title: 'White Noise', desc: 'Frekuensi fokus untuk konsentrasi belajar' },
              { type: 'instrumental' as const, title: 'Musik Instrumental', desc: 'Harmoni akustik yang menyejukkan' }
            ].map(item => {
              const isSelected = activeSound === item.type;
              return (
                <button
                  key={item.type}
                  onClick={() => handlePlaySound(item.type)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected && isPlayingSound
                      ? 'bg-[#8B5E3C] text-white border-[#8B5E3C] shadow-md shadow-[#8B5E3C]/20'
                      : 'bg-[#FAF5EE] dark:bg-[#2E2017] text-[#4A3525] dark:text-[#F3E9DD] border-[#E8DCCB] dark:border-[#443122] hover:bg-[#F2E5D4]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm">{item.title}</span>
                    {isSelected && isPlayingSound ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                    ) : (
                      <Play className="w-4 h-4 text-[#8B5E3C]" />
                    )}
                  </div>
                  <p className={`text-xs ${isSelected && isPlayingSound ? 'text-stone-200' : 'text-[#8C6D53] dark:text-[#A88C76]'}`}>
                    {item.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Master Audio Controls */}
          <div className="p-4 rounded-2xl bg-[#FAF5EE] dark:bg-[#2E2017] border border-[#E8DCCB] dark:border-[#443122] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5C3F28] dark:text-[#E2C7B0]">
                Status Pemutar:{' '}
                <span className="text-[#8B5E3C] dark:text-[#D4A373]">
                  {isPlayingSound ? `Sedang Memutar: ${activeSound}` : 'Berhenti'}
                </span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleStopSound}
                  disabled={!isPlayingSound}
                  className="px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold hover:bg-stone-300 disabled:opacity-40 transition-colors flex items-center gap-1"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Stop</span>
                </button>
              </div>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-[#8B5E3C] shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={soundVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-[#8B5E3C]"
              />
              <span className="text-xs font-bold text-[#7A5B40] dark:text-[#BA9B81] w-10 text-right">
                {Math.round(soundVolume * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: MINI GAMES ANTISTRES */}
      {subTab === 'game' && (
        <div className="space-y-6">
          {/* Game Switcher Tabs */}
          <div className="flex flex-wrap gap-2 p-1 rounded-2xl bg-[#FAF5EE] dark:bg-[#251B13] border border-[#E8DEC8] dark:border-[#3E2D20]">
            <button
              onClick={() => setActiveGame('gelembung')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeGame === 'gelembung'
                  ? 'bg-[#8B5E3C] text-white shadow-xs'
                  : 'text-[#7D5C40] dark:text-[#C5A893]'
              }`}
            >
              🫧 Tekan Gelembung
            </button>
            <button
              onClick={() => setActiveGame('gambar')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeGame === 'gambar'
                  ? 'bg-[#8B5E3C] text-white shadow-xs'
                  : 'text-[#7D5C40] dark:text-[#C5A893]'
              }`}
            >
              🎨 Gambar Bebas
            </button>
            <button
              onClick={() => setActiveGame('cocok')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeGame === 'cocok'
                  ? 'bg-[#8B5E3C] text-white shadow-xs'
                  : 'text-[#7D5C40] dark:text-[#C5A893]'
              }`}
            >
              🎴 Cocokkan Bentuk
            </button>
            <button
              onClick={() => setActiveGame('puzzle')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeGame === 'puzzle'
                  ? 'bg-[#8B5E3C] text-white shadow-xs'
                  : 'text-[#7D5C40] dark:text-[#C5A893]'
              }`}
            >
              🧩 Puzzle Angka
            </button>
          </div>

          {/* GAME 1: GELEMBUNG */}
          {activeGame === 'gelembung' && (
            <div className="bg-white dark:bg-[#251B13] rounded-3xl p-6 sm:p-8 border border-[#E8DEC8] dark:border-[#3E2D20] text-center max-w-xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                    Pop The Bubbles (Pereda Cemas)
                  </h3>
                  <p className="text-xs text-[#8A674A]">Ketuk gelembung untuk meletuskannya dan lepaskan ketegangan.</p>
                </div>
                <button
                  onClick={handleResetBubbles}
                  className="px-3 py-1 rounded-xl bg-[#FAF5EE] dark:bg-[#32231A] text-xs font-bold text-[#8B5E3C]"
                >
                  Ulangi
                </button>
              </div>

              <div className="grid grid-cols-6 gap-3 py-4">
                {bubbles.map(b => (
                  <button
                    key={b.id}
                    onClick={() => handlePopBubble(b.id)}
                    className={`h-12 rounded-full border-2 transition-all flex items-center justify-center ${
                      b.popped
                        ? 'bg-[#EADBCB]/30 border-transparent scale-90 opacity-40 shadow-inner'
                        : 'bg-gradient-to-tr from-[#E6D0BE] to-[#FFF3E8] border-[#8B5E3C]/40 hover:scale-105 active:scale-75 shadow-sm'
                    }`}
                  >
                    {!b.popped && <span className="w-2.5 h-2.5 rounded-full bg-white/70" />}
                  </button>
                ))}
              </div>

              <p className="text-xs font-semibold text-[#8C6D53]">
                Total Diletuskan: <strong>{poppedCount} kali</strong>
              </p>
            </div>
          )}

          {/* GAME 2: GAMBAR BEBAS */}
          {activeGame === 'gambar' && (
            <div className="bg-white dark:bg-[#251B13] rounded-3xl p-6 border border-[#E8DEC8] dark:border-[#3E2D20] max-w-2xl mx-auto space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                    Kanvas Menggambar & Mewarnai Bebas
                  </h3>
                  <p className="text-xs text-[#8A674A]">Ekspresikan perasaanmu melalui garis dan warna tenang.</p>
                </div>

                <div className="flex items-center gap-2">
                  {['#8B5E3C', '#4A3525', '#2D6A4F', '#1D4ED8', '#D97706', '#E11D48'].map(color => (
                    <button
                      key={color}
                      onClick={() => setBrushColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 rounded-full transition-transform ${brushColor === color ? 'ring-2 ring-offset-2 ring-stone-400 scale-110' : ''}`}
                    />
                  ))}
                  <button
                    onClick={clearCanvas}
                    className="ml-2 px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-200"
                  >
                    Hapus
                  </button>
                </div>
              </div>

              <div className="border border-[#E8DEC8] dark:border-[#3E2D20] rounded-2xl overflow-hidden bg-white">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={320}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full h-80 cursor-crosshair touch-none"
                />
              </div>
            </div>
          )}

          {/* GAME 3: COCOKKAN BENTUK (MEMORY MATCH) */}
          {activeGame === 'cocok' && (
            <div className="bg-white dark:bg-[#251B13] rounded-3xl p-6 border border-[#E8DEC8] dark:border-[#3E2D20] text-center max-w-md mx-auto space-y-4">
              <h3 className="font-bold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                Mencocokkan Simbol & Bentuk
              </h3>
              <p className="text-xs text-[#8A674A]">Latih konsentrasi lembut dan ketenangan pikiran.</p>

              <div className="grid grid-cols-4 gap-3 py-3">
                {matchCards.map((card, idx) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(idx)}
                    className={`h-16 rounded-2xl text-2xl font-bold transition-all flex items-center justify-center border ${
                      card.flipped || card.matched
                        ? 'bg-[#FAF5EE] dark:bg-[#342419] border-[#8B5E3C]'
                        : 'bg-gradient-to-br from-[#8B5E3C] to-[#5C3B1E] text-transparent border-transparent shadow-sm'
                    }`}
                  >
                    {(card.flipped || card.matched) ? card.symbol : '❓'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GAME 4: PUZZLE ANGKA */}
          {activeGame === 'puzzle' && (
            <div className="bg-white dark:bg-[#251B13] rounded-3xl p-6 border border-[#E8DEC8] dark:border-[#3E2D20] text-center max-w-xs mx-auto space-y-4">
              <h3 className="font-bold text-base text-[#4A3525] dark:text-[#F3E9DD]">
                Puzzle Sederhana (3x3)
              </h3>
              <p className="text-xs text-[#8A674A]">Geser angka untuk menyusun urutan 1 sampai 8.</p>

              <div className="grid grid-cols-3 gap-2 p-2 bg-[#FAF5EE] dark:bg-[#2E2017] rounded-2xl border border-[#E8DEC8] dark:border-[#3E2D20]">
                {puzzleTiles.map((tile, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTileClick(idx)}
                    className={`h-16 rounded-xl font-black text-lg transition-all flex items-center justify-center ${
                      tile === 0
                        ? 'bg-transparent border-2 border-dashed border-stone-300 dark:border-stone-700'
                        : 'bg-[#8B5E3C] text-white shadow-sm hover:bg-[#724B2E]'
                    }`}
                  >
                    {tile === 0 ? '' : tile}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
