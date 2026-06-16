class SoundSystem {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  private init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  setEnabled(val: boolean) {
    this.enabled = val;
  }

  isEnabled() {
    return this.enabled;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, delay = 0) {
    this.init();
    if (!this.ctx || !this.enabled) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

      // Volume envelope to avoid audio clipping/popping
      gainNode.gain.setValueAtTime(0.12, this.ctx.currentTime + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + delay + duration);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration);
    } catch (e) {
      console.warn("Failed to play synth sound:", e);
    }
  }

  playCoin() {
    // Retro double-beep high pitch
    this.playTone(987.77, 'square', 0.08, 0);
    this.playTone(1318.51, 'square', 0.15, 0.08);
  }

  playSuccess() {
    // Bright major chord arpeggio
    this.playTone(523.25, 'triangle', 0.1, 0);
    this.playTone(659.25, 'triangle', 0.1, 0.05);
    this.playTone(783.99, 'triangle', 0.1, 0.1);
    this.playTone(1046.50, 'triangle', 0.25, 0.15);
  }

  playFailure() {
    // Low pitch detuned buzz
    this.playTone(150, 'sawtooth', 0.15, 0);
    this.playTone(110, 'sawtooth', 0.3, 0.08);
  }

  playLevelUp() {
    // Rising arpeggio
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.15, idx * 0.08);
    });
  }

  playClick() {
    // Soft high-frequency snap
    this.playTone(1800, 'sine', 0.04, 0);
  }
}

export const soundSystem = new SoundSystem();
