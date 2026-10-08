// Procedural Web Audio API sound generator for relaxing audio
// Guarantees 100% offline, immediate playback without broken external mp3 links

type SoundType = 'rain' | 'nature' | 'whitenoise' | 'instrumental';

class AudioSynthesizerService {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private currentType: SoundType | null = null;
  private isPlaying = false;
  private intervalId: any = null;
  private activeNodes: (AudioNode | { stop?: () => void })[] = [];
  private volumeLevel = 0.6;

  private ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.gainNode && this.ctx) {
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volumeLevel, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
  }

  public play(type: SoundType) {
    this.stop();
    this.ensureContext();
    if (!this.ctx || !this.gainNode) return;

    this.currentType = type;
    this.isPlaying = true;

    if (type === 'rain') {
      this.startRain();
    } else if (type === 'nature') {
      this.startNature();
    } else if (type === 'whitenoise') {
      this.startWhiteNoise();
    } else if (type === 'instrumental') {
      this.startInstrumental();
    }
  }

  public pause() {
    if (this.ctx && this.isPlaying) {
      this.ctx.suspend();
      this.isPlaying = false;
    }
  }

  public resume() {
    if (this.ctx && !this.isPlaying && this.currentType) {
      this.ctx.resume();
      this.isPlaying = true;
    }
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.activeNodes.forEach(node => {
      try {
        if ('stop' in node && typeof node.stop === 'function') {
          node.stop();
        }
        if ('disconnect' in node && typeof (node as any).disconnect === 'function') {
          (node as any).disconnect();
        }
      } catch (e) {
        // ignore
      }
    });
    this.activeNodes = [];
    this.isPlaying = false;
  }

  public setVolume(val: number) {
    this.volumeLevel = Math.max(0, Math.min(1, val));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(this.volumeLevel, this.ctx.currentTime, 0.05);
    }
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentType: this.currentType,
      volume: this.volumeLevel
    };
  }

  // RAIN SYNTHESIZER
  private startRain() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Pink/Brown noise curve
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    whiteNoise.start();
    this.activeNodes.push(whiteNoise);

    // Random droplet resonant impulses
    this.intervalId = setInterval(() => {
      if (!this.ctx || !this.gainNode || !this.isPlaying) return;
      const osc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();
      const freq = 1200 + Math.random() * 1400;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + 0.08);

      dropGain.gain.setValueAtTime(0.04 * Math.random(), this.ctx.currentTime);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

      osc.connect(dropGain);
      dropGain.connect(this.gainNode);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    }, 180);
  }

  // NATURE / FOREST SYNTHESIZER
  private startNature() {
    if (!this.ctx || !this.gainNode) return;
    // Gentle wind ambient
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const windGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(124, this.ctx.currentTime);

    windGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    osc1.connect(windGain);
    osc2.connect(windGain);
    windGain.connect(this.gainNode);

    osc1.start();
    osc2.start();
    this.activeNodes.push(osc1, osc2);

    // Periodic gentle calming forest bird chimes
    const chimeFreqs = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    this.intervalId = setInterval(() => {
      if (!this.ctx || !this.gainNode || !this.isPlaying) return;
      const chimeOsc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      const f = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];

      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(f, this.ctx.currentTime);
      chimeGain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.gainNode);
      chimeOsc.start();
      chimeOsc.stop(this.ctx.currentTime + 1.3);
    }, 2800);
  }

  // WHITE NOISE SYNTHESIZER
  private startWhiteNoise() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    whiteNoise.start();
    this.activeNodes.push(whiteNoise);
  }

  // INSTRUMENTAL SOFT SYNTHESIZER
  private startInstrumental() {
    if (!this.ctx || !this.gainNode) return;
    const chords = [
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [261.63, 329.63, 392.00, 523.25], // C
      [196.00, 246.94, 293.66, 392.00]  // G
    ];

    let chordIdx = 0;
    const playChord = () => {
      if (!this.ctx || !this.gainNode || !this.isPlaying) return;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      currentChord.forEach((freq) => {
        if (!this.ctx || !this.gainNode) return;
        const osc = this.ctx.createOscillator();
        const padGain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        padGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        padGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 1.2);
        padGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.8);

        osc.connect(padGain);
        padGain.connect(this.gainNode);
        osc.start();
        osc.stop(this.ctx.currentTime + 4.0);
      });
    };

    playChord();
    this.intervalId = setInterval(playChord, 4000);
  }
}

export const audioSynthesizer = new AudioSynthesizerService();
