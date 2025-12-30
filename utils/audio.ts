import { AppSettings } from "../types";

// Sound Assets
const SOUNDS = {
    // UI Click / Cell Selection (Soft Pop)
    click: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_c8b84d53de.mp3', 
    
    // Correct Move (Swapped as requested)
    correct: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3',

    // Error / Wrong Move (Swapped as requested)
    error: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_c6ccf3232f.mp3',
    
    // Win Game (Success Chime/Fanfare)
    win: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c153e2.mp3',
    
    // Lose Game (Retro Game Over)
    loss: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_982b68c07e.mp3',
    
    // Pencil/Note Mode (Scratchy sound)
    pencil: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_273e82b3d6.mp3',
    
    // Ambient Music Loop
    bgm: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'
};

class AudioManager {
    private bgmAudio: HTMLAudioElement | null = null;
    private sounds: Map<string, HTMLAudioElement> = new Map();
    private isMusicEnabled: boolean = false;
    private isSoundEnabled: boolean = true;

    constructor() {
        // Preload sound effects
        if (typeof window !== 'undefined') {
            Object.entries(SOUNDS).forEach(([key, src]) => {
                if (key !== 'bgm') {
                    const audio = new Audio(src);
                    audio.volume = key === 'click' ? 0.2 : 0.4; // Clicks are softer
                    this.sounds.set(key, audio);
                }
            });

            this.bgmAudio = new Audio(SOUNDS.bgm);
            this.bgmAudio.loop = true;
            this.bgmAudio.volume = 0.15; // Ambient volume
        }
    }

    public updateSettings(settings: AppSettings) {
        this.isMusicEnabled = settings.music;
        this.isSoundEnabled = settings.sound;
        
        this.handleMusicState();
    }

    private handleMusicState() {
        if (!this.bgmAudio) return;

        if (this.isMusicEnabled) {
            // Only play if not already playing to avoid restarts
            if (this.bgmAudio.paused) {
                const playPromise = this.bgmAudio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        // Auto-play was prevented by browser
                        console.log("Audio playback waiting for interaction");
                    });
                }
            }
        } else {
            this.bgmAudio.pause();
        }
    }

    // Ensures music starts after first user interaction (browser policy)
    public initAudioContext() {
        if (this.isMusicEnabled && this.bgmAudio?.paused) {
            this.bgmAudio.play().catch(() => {});
        }
    }

    public playSound(type: 'click' | 'correct' | 'error' | 'win' | 'loss' | 'pencil') {
        if (!this.isSoundEnabled) return;

        const sound = this.sounds.get(type);
        if (sound) {
            // Clone node to allow overlapping sounds (fast typing)
            const clone = sound.cloneNode() as HTMLAudioElement;
            clone.volume = sound.volume;
            clone.play().catch(() => {});
        }
    }
}

export const audioManager = new AudioManager();