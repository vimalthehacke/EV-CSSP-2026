import { useSettingsStore } from '../store/settingsStore';

// Safe singleton wrapper for AudioContext to avoid issues with restricted browser policies
let audioContextInstance: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContextInstance) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContextInstance = new AudioContextClass();
  }
  return audioContextInstance;
}

/**
 * Returns a programmatically synthesized WAV representation of a loopable cyberpunk technical hum.
 * Keeping sample rate low (8kHz) and duration compact (3s) ensures instant rendering and tiny memory foot-print.
 */
export function getAmbientDroneDataUri(): string {
  const sampleRate = 8000;
  const duration = 4.0;
  const numSamples = sampleRate * duration;
  const buffer = new Uint8Array(44 + numSamples);

  // WAV Format Header
  // "RIFF"
  buffer[0] = 0x52; buffer[1] = 0x49; buffer[2] = 0x46; buffer[3] = 0x46;
  const size = 36 + numSamples;
  buffer[4] = size & 0xFF;
  buffer[5] = (size >> 8) & 0xFF;
  buffer[6] = (size >> 16) & 0xFF;
  buffer[7] = (size >> 24) & 0xFF;
  // "WAVE"
  buffer[8] = 0x57; buffer[9] = 0x41; buffer[10] = 0x56; buffer[11] = 0x45;
  // "fmt " chunk
  buffer[12] = 0x66; buffer[13] = 0x6D; buffer[14] = 0x74; buffer[15] = 0x20;
  buffer[16] = 16; buffer[17] = 0; buffer[18] = 0; buffer[19] = 0; // Chunck size (16)
  buffer[20] = 1; buffer[21] = 0; // PCM format (1)
  buffer[22] = 1; buffer[23] = 0; // Channels count (Mono)
  buffer[24] = sampleRate & 0xFF; // Sample rate
  buffer[25] = (sampleRate >> 8) & 0xFF;
  buffer[26] = (sampleRate >> 16) & 0xFF;
  buffer[27] = (sampleRate >> 24) & 0xFF;
  // Byte rate (sampleRate * 1 channel * 1 byte)
  buffer[28] = sampleRate & 0xFF;
  buffer[29] = (sampleRate >> 8) & 0xFF;
  buffer[30] = (sampleRate >> 16) & 0xFF;
  buffer[31] = (sampleRate >> 24) & 0xFF;
  buffer[32] = 1; buffer[33] = 0; // Block align (1)
  buffer[34] = 8; buffer[35] = 0; // Bits per sample (8-bit)
  // "data" chunk
  buffer[36] = 0x64; buffer[37] = 0x61; buffer[38] = 0x74; buffer[39] = 0x61;
  buffer[40] = numSamples & 0xFF;
  buffer[41] = (numSamples >> 8) & 0xFF;
  buffer[42] = (numSamples >> 16) & 0xFF;
  buffer[43] = (numSamples >> 24) & 0xFF;

  // Render cozy sci-fi ambient drone
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    
    // Low frequency drone harmonics (55Hz and minor 4th 73.4Hz)
    const baseFreq = 51.91; // G#1 / G1
    const harmonicFreq = 103.82; // G#2 octave
    
    // Subtle LFO sweep at 0.5Hz adding a space feel
    const lfo = Math.sin(2 * Math.PI * 0.5 * t);
    const modulation = 1.2 * lfo;

    const wave = 0.55 * Math.sin(2 * Math.PI * (baseFreq + modulation) * t) + 
                 0.35 * Math.sin(2 * Math.PI * (harmonicFreq - modulation) * t) +
                 0.10 * Math.sin(2 * Math.PI * 155.56 * t); // Eb3 fifth

    // Smooth limits boundary fade to prevent clicking triggers
    let fade = 1.0;
    const fadeLimit = 0.25;
    if (t < fadeLimit) {
      fade = t / fadeLimit;
    } else if (t > duration - fadeLimit) {
      fade = (duration - t) / fadeLimit;
    }

    // Convert value representing amplitude to unsigned 8-bit center index 128
    const sampleVal = 128 + Math.round(wave * 25 * fade);
    buffer[44 + i] = sampleVal;
  }

  // Convert binary buffer directly to Base64 String
  let binary = '';
  const len = buffer.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
}

/**
 * Play a synthesized cyberpunk technical clicking sound effect
 * (Great for buttons hover, keystrokes, and tabs switching)
 */
export function playCpsClick(isKeystroke = false): void {
  const { soundEffectsEnabled, volume } = useSettingsStore.getState();
  if (!soundEffectsEnabled) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Synthesis of high-frequency noise burst for realistic click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = isKeystroke ? 'triangle' : 'sine';
    
    // Randomize pitch slightly of key hits for hyper realism
    const pitch = isKeystroke 
      ? 180 + Math.random() * 220 
      : 880 + Math.random() * 40;
      
    osc.frequency.setValueAtTime(pitch, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + (isKeystroke ? 0.05 : 0.08));

    // Sharp linear decay profile
    gain.gain.setValueAtTime(volume * (isKeystroke ? 0.25 : 0.4), ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (isKeystroke ? 0.06 : 0.1));

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (error) {
    // Suppress silent exceptions under browser sandbox iframe constraints
  }
}

/**
 * Play a cool sci-fi cyber sound whenever interactive categories are hovered/focused
 */
export function playCpsHover(): void {
  const { soundEffectsEnabled, volume } = useSettingsStore.getState();
  if (!soundEffectsEnabled) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') return; // Do not resume on hover to avoid aggressive warning logs

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 540 + Math.random() * 60;
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.setValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.02);

    gain.gain.setValueAtTime(volume * 0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  } catch (err) {}
}

/**
 * Play successful telemetry unlock cue sounds (Lab solved, XP unlocked etc)
 */
export function playCpsSuccessFanfare(): void {
  const { soundEffectsEnabled, volume } = useSettingsStore.getState();
  if (!soundEffectsEnabled) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const t = ctx.currentTime;
    
    // Play a shiny pentatonic sci-fi chord cadence
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 1046.50]; // C4, E4, G4, C5, E5, C6
    
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + index * 0.065);
      
      // Sweep pitch up slightly for additional shiny arcade polish
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, t + index * 0.065 + 0.25);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(volume * 0.35, t + index * 0.065 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + index * 0.065 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t + index * 0.065);
      osc.stop(t + index * 0.065 + 0.45);
    });
  } catch (error) {}
}

/**
 * Play failure / block code sounds (Wrong flag submission, locks clicked)
 */
export function playCpsError(): void {
  const { soundEffectsEnabled, volume } = useSettingsStore.getState();
  if (!soundEffectsEnabled) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    subOsc.type = 'sine';

    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(75, ctx.currentTime + 0.25);

    subOsc.frequency.setValueAtTime(70, ctx.currentTime);
    subOsc.frequency.linearRampToValueAtTime(35, ctx.currentTime + 0.25);

    // Filter to sweep low-pass
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    subOsc.start();
    osc.stop(ctx.currentTime + 0.3);
    subOsc.stop(ctx.currentTime + 0.3);
  } catch (error) {}
}
