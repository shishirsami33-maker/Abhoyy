'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Pause,
  Play,
  PhoneOff,
  Globe,
  HelpCircle,
  Clock,
  Sparkles,
  Camera,
  AlertTriangle,
  X,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { Orb, OrbState } from '@/components/ui/Orb';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { useToast } from '@/lib/hooks/useToast';
import { api } from '@/lib/api';
import { InterviewSession, InterviewQuestion } from '@/types';
import { REQUIRE_CAMERA } from '@/config';

const SCRIPTED_QUESTIONS: InterviewQuestion[] = [
  {
    id: 1,
    en: 'Please introduce yourself in about a minute.',
    bn: 'অনুগ্রহ করে প্রায় এক মিনিটের মধ্যে নিজের পরিচয় দিন।',
  },
  {
    id: 2,
    en: 'Why did you choose this subject or role?',
    bn: 'আপনি কেন এই বিষয় বা পদটি বেছে নিলেন?',
  },
  {
    id: 3,
    en: 'Tell me about a project on your CV that you are proud of. What was your part in it?',
    bn: 'আপনার সিভির এমন একটি প্রজেক্ট সম্পর্কে বলুন যা নিয়ে আপনি গর্বিত। এতে আপনার ভূমিকা কী ছিল?',
  },
  {
    id: 4,
    en: 'Describe a time you faced a difficulty and how you handled it.',
    bn: 'এমন একটি সময়ের কথা বলুন যখন আপনি কোনো কঠিন পরিস্থিতির মুখোমুখি হয়েছিলেন এবং কীভাবে তা সামলেছিলেন?',
  },
  {
    id: 5,
    en: 'What is your biggest strength, and where do you still need to improve?',
    bn: 'আপনার সবচেয়ে বড় শক্তি কী এবং কোথায় এখনও উন্নতি প্রয়োজন?',
  },
  {
    id: 6,
    en: 'Why do you want to join this organization or program?',
    bn: 'আপনি কেন এই প্রতিষ্ঠান বা প্রোগ্রামে যোগ দিতে চান?',
  },
  {
    id: 7,
    en: 'Where do you see yourself in five years?',
    bn: 'আগামী পাঁচ বছরে নিজেকে কোথায় দেখতে চান?',
  },
  {
    id: 8,
    en: 'Do you have any questions for us?',
    bn: 'আমাদের প্যানেলের কাছে আপনার কি কোনো প্রশ্ন আছে?',
  },
];

export default function LiveInterviewRoomPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const { t, locale, toggleLanguage } = useLanguage();
  const { toast } = useToast();

  const [session, setSession] = useState<InterviewSession | null>(null);

  // Flow: 'waiting' | 'countdown' | 'interview' | 'phase1_complete'
  const [stage, setStage] = useState<'waiting' | 'countdown' | 'interview' | 'phase1_complete'>('waiting');
  const [waitingStep, setWaitingStep] = useState(0); // 0, 1, 2
  const [countdownNum, setCountdownNum] = useState(3);

  // Interview state
  const [questionIdx, setQuestionIdx] = useState(0);
  const [orbState, setOrbState] = useState<OrbState>('speaking');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showHelpSheet, setShowHelpSheet] = useState(false);

  // Timer: seconds elapsed
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Audio / Video reactive stream
  const [micLevel, setMicLevel] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captions, setCaptions] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Load session & check gating
  useEffect(() => {
    api.sessions.get(sessionId).then((s) => {
      if (!s) {
        toast('Session not found.', 'error');
        router.push('/dashboard');
        return;
      }
      setSession(s);
    });
  }, [sessionId, router, toast]);

  // Prevent accidental navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (stage === 'interview') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [stage]);

  // Step 1: Waiting Room sequence
  useEffect(() => {
    if (stage === 'waiting') {
      const timer1 = setTimeout(() => setWaitingStep(1), 1300);
      const timer2 = setTimeout(() => setWaitingStep(2), 2600);
      const timer3 = setTimeout(() => setStage('countdown'), 3900);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [stage]);

  // Step 2: 3, 2, 1 Countdown -> transitions to LIVE interview & deducts minutes
  useEffect(() => {
    if (stage === 'countdown') {
      if (countdownNum > 1) {
        const timer = setTimeout(() => setCountdownNum((prev) => prev - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(async () => {
          setStage('interview');
          setOrbState('speaking');

          // DEDUCT MINUTES EXACTLY WHEN LIVE BEGINS (Section 3 rule)
          try {
            const mins = (session?.lengthMinutes || 15) as 5 | 10 | 15 | 20;
            const res = await api.wallet.deductForLiveSession(sessionId, mins);
            toast(`${res.deducted} minutes deducted from wallet for this live session.`, 'info');
          } catch (err: any) {
            console.warn('Deduction notification:', err.message);
          }

          // Speak question then switch to listening
          setTimeout(() => setOrbState('listening'), 2500);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [stage, countdownNum, session, sessionId, toast]);

  // Setup media stream & local recorder in memory
  useEffect(() => {
    let localStream: MediaStream | null = null;

    async function startMedia() {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: REQUIRE_CAMERA ? { width: { ideal: 480 }, height: { ideal: 360 } } : false,
          audio: true,
        });
        setStream(localStream);

        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
        }

        // Web Audio analyser for reactive mic level
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = ctx.createMediaStreamSource(localStream);
        source.connect(analyser);

        const buffer = new Uint8Array(analyser.frequencyBinCount);

        const checkLevel = () => {
          if (!isMicMuted && !isPaused) {
            analyser.getByteFrequencyData(buffer);
            let sum = 0;
            for (let i = 0; i < buffer.length; i++) {
              sum += buffer[i];
            }
            const avg = sum / buffer.length;
            const norm = Math.min(Math.round((avg / 128) * 100), 100);
            setMicLevel(norm);
          } else {
            setMicLevel(0);
          }
          animFrameRef.current = requestAnimationFrame(checkLevel);
        };
        checkLevel();

        // Local In-Memory MediaRecorder (only if user explicitly opted in & consented)
        if (session?.recordingRequested && typeof MediaRecorder !== 'undefined') {
          const recorder = new MediaRecorder(localStream);
          mediaRecorderRef.current = recorder;
          recorder.start(1000);
        }
      } catch (e) {
        console.warn('Could not start real media streams in interview room', e);
      }
    }

    if (typeof window !== 'undefined' && navigator.mediaDevices) {
      startMedia();
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isMicMuted, isPaused]);

  // Interview room timer
  useEffect(() => {
    let interval: any;
    if (stage === 'interview' && !isPaused) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stage, isPaused]);

  // Format seconds to mm:ss
  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // User finished answer -> thinking state -> next question
  const handleDoneAnswering = () => {
    setOrbState('thinking');
    // Add simulated caption
    setCaptions((prev) => [
      ...prev,
      `Candidate response recorded for Question ${questionIdx + 1}.`,
    ]);

    setTimeout(() => {
      if (questionIdx + 1 < SCRIPTED_QUESTIONS.length) {
        setQuestionIdx((prev) => prev + 1);
        setOrbState('speaking');
        setTimeout(() => setOrbState('listening'), 2400);
      } else {
        // Finished all 8 scripted questions
        setStage('phase1_complete');
        if (session) {
          api.sessions.updateStatus(session.id, 'completed');
        }
      }
    }, 1500);
  };

  const handleEndConfirmed = async () => {
    if (session) {
      await api.sessions.updateStatus(session.id, 'completed');
    }
    router.push('/dashboard');
  };

  const currentQ = SCRIPTED_QUESTIONS[questionIdx];

  // -------------------------------------------------------------
  // RENDER: Stage 1 Waiting Room
  // -------------------------------------------------------------
  if (stage === 'waiting') {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 bg-ink-900 text-paper text-center">
        <div className="mb-8">
          <Orb state="thinking" size={170} />
        </div>

        <div className="max-w-md w-full space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-volt-400">
            <span className="w-2 h-2 rounded-full bg-volt-400 animate-ping" />
            <span>Establishing Secure Board Room</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-paper">
            {waitingStep === 0 && t('room.joining')}
            {waitingStep === 1 && t('room.reading')}
            {waitingStep === 2 && t('room.ready')}
          </h2>

          <div className="w-48 h-1.5 bg-ink-700 rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-volt-400"
              animate={{ width: `${((waitingStep + 1) / 3) * 100}%` }}
              transition={{ duration: 1.2 }}
            />
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Stage 2 Countdown (3, 2, 1)
  // -------------------------------------------------------------
  if (stage === 'countdown') {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 bg-ink-900 text-paper text-center">
        <div className="mb-8">
          <Orb state="idle" size={180} />
        </div>

        <motion.div
          key={countdownNum}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="text-7xl sm:text-9xl font-black text-volt-400 font-mono mb-4"
        >
          {countdownNum}
        </motion.div>

        <p className="text-base sm:text-xl font-bold text-gray-300">
          {t('room.breath')}
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Stage 4 End of Phase 1 Preview Screen
  // -------------------------------------------------------------
  if (stage === 'phase1_complete') {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 sm:p-10 bg-ink-900 text-paper text-center">
        <div className="max-w-xl w-full bg-ink-800 border border-gray-700 rounded-3xl p-8 sm:p-12 shadow-lifted">
          <div className="w-16 h-16 rounded-full bg-volt-400 text-ink-900 flex items-center justify-center mx-auto mb-6 shadow-volt-glow">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-mono font-bold uppercase tracking-wider text-volt-400 bg-ink-900 px-3 py-1 rounded-full mb-3 inline-block border border-gray-700">
            Phase 1 Milestone Complete
          </span>

          <h2 className="text-3xl font-black text-paper mb-3">
            {t('room.phase1PreviewTitle')}
          </h2>

          <p className="text-sm text-gray-300 leading-relaxed mb-8">
            {t('room.phase1PreviewBody')}
          </p>

          <div className="p-4 rounded-2xl bg-ink-700/60 border border-gray-700 text-xs text-gray-300 text-left space-y-2 mb-8">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Questions Completed:</span>
              <span className="font-bold text-paper">8 of 8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Duration Recorded:</span>
              <span className="font-bold text-paper">{formatTimer(secondsElapsed)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Audio/Video Memory Buffer:</span>
              <span className="font-bold text-success-500">Secure (Discarded per v1 spec)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <Button
              variant="volt"
              size="lg"
              onClick={() => router.push(`/interview/${sessionId}/report`)}
              className="w-full sm:flex-1 gap-2 font-black text-sm"
            >
              <span>View Diagnostic Report</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push(`/interview/${sessionId}/recording`)}
              className="w-full sm:flex-1 gap-2 text-sm"
            >
              <span>Playback Recording</span>
            </Button>
          </div>

          <div className="pt-4 text-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-xs text-gray-400 hover:text-paper underline"
            >
              {t('room.backToDashboard')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Stage 3 Active Live Interview Room
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-ink-900 text-paper flex flex-col justify-between relative overflow-hidden select-none">
      {/* Top Status & Security Bar */}
      <div className="bg-ink-800/80 border-b border-gray-800 px-4 sm:px-6 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          {/* Recording Badge based on user preference */}
          {session?.recordingRequested ? (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/60 border border-red-800/80 text-xs text-red-400 font-semibold cursor-help"
              title="Recording is active with your explicit consent. It will be purged after download or in 30 days."
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Recording Live (Optional)</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink-700 border border-gray-700 text-xs text-gray-400 font-medium"
              title="Recording is disabled per your setup selection."
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
              <span>Recording Off</span>
            </div>
          )}

          <span className="hidden sm:inline text-gray-600">|</span>

          <span className="hidden sm:inline text-xs text-gray-300 font-medium">
            Question {questionIdx + 1} of {SCRIPTED_QUESTIONS.length}
          </span>
        </div>

        {/* Elapsed Timer & Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-volt-400 bg-ink-900 px-3 py-1 rounded-lg border border-gray-700">
            <Clock className="w-3.5 h-3.5 text-volt-400" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          {/* Language Toggle in room */}
          <button
            onClick={toggleLanguage}
            className="text-xs font-bold text-gray-300 hover:text-paper px-2.5 py-1 rounded-md border border-gray-700 bg-ink-700"
          >
            {locale === 'en' ? 'বাংলা' : 'English'}
          </button>

          <button
            onClick={() => setShowHelpSheet(true)}
            className="text-gray-400 hover:text-paper"
            title="Interview quick tips"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Stage Grid (Desktop: Left AI Stage 8 cols, Right Camera & Captions 4 cols) */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: AI Interviewer Stage (8 cols) */}
        <div
          className={`lg:col-span-8 flex flex-col items-center justify-center p-6 sm:p-10 rounded-3xl bg-ink-800/60 border border-gray-800 shadow-2xl relative min-h-[460px] transition-all ${
            isPaused ? 'filter blur-md pointer-events-none' : ''
          }`}
        >
          {/* AI Orb */}
          <div className="mb-6 relative">
            <Orb state={orbState} size={190} micLevel={orbState === 'listening' ? micLevel : 0} />

            {/* Orb status pill */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-ink-900 border border-gray-700 text-volt-400 whitespace-nowrap shadow-sm">
              {orbState === 'speaking' && 'AI Panelist Speaking'}
              {orbState === 'listening' && 'Listening to Candidate'}
              {orbState === 'thinking' && t('room.panelThinking')}
              {orbState === 'idle' && 'Panel Ready'}
            </div>
          </div>

          {/* Current Question Text */}
          <div className="max-w-xl text-center mt-4">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              {t('room.questionNum')} {questionIdx + 1} {t('room.of')} {SCRIPTED_QUESTIONS.length}
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-paper leading-snug tracking-tight">
              &ldquo;{locale === 'bn' ? currentQ.bn : currentQ.en}&rdquo;
            </h2>
          </div>

          {/* Reactive Waveform Loop */}
          <div className="flex items-center gap-1.5 h-8 mt-6">
            {[40, 80, 95, 60, 90, 50, 85, 70, 45, 95, 65, 40].map((h, i) => (
              <motion.div
                key={i}
                animate={{
                  height:
                    orbState === 'speaking'
                      ? [`${h * 0.3}%`, `${h}%`, `${h * 0.4}%`]
                      : orbState === 'listening' && micLevel > 15
                      ? [`${Math.max(micLevel, 20)}%`, `${Math.min(micLevel * 1.2, 100)}%`]
                      : '20%',
                }}
                transition={{
                  duration: 0.6 + (i % 3) * 0.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={`w-1 rounded-full ${
                  orbState === 'listening' && micLevel > 15 ? 'bg-volt-400' : 'bg-violet-600'
                }`}
                style={{ height: '20%' }}
              />
            ))}
          </div>
        </div>

        {/* Right: Candidate Camera Tile & Captions (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Camera Tile */}
          <div className="rounded-2xl bg-ink-800 border border-gray-800 overflow-hidden relative aspect-video shadow-md flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            {/* Overlay tag */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-gray-200 font-semibold flex items-center gap-1.5 backdrop-blur-sm">
              <Camera className="w-3 h-3 text-volt-400" />
              <span>You (Candidate)</span>
            </div>
          </div>

          {/* Live Captions Box */}
          <div className="rounded-2xl bg-ink-800 border border-gray-800 p-4 min-h-[180px] max-h-[220px] flex flex-col justify-between shadow-md">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                {t('room.captionsTitle')}
              </p>
              <div className="space-y-2 text-xs text-gray-300 overflow-y-auto max-h-[130px] pr-1">
                {captions.length === 0 ? (
                  <p className="text-gray-500 italic text-[11px]">{t('room.captionsEmpty')}</p>
                ) : (
                  captions.map((cap, i) => (
                    <p key={i} className="leading-relaxed">
                      {cap}
                    </p>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700/60 flex items-center justify-between text-[10px] text-gray-400">
              <span>Speech recognition active</span>
              <span className="text-volt-400 font-mono">Input: {micLevel}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="bg-ink-800/90 border-t border-gray-800 p-4 sm:p-5 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          {/* Pause / Resume */}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              className="text-xs gap-1.5"
            >
              {isPaused ? <Play className="w-4 h-4 text-volt-400" /> : <Pause className="w-4 h-4" />}
              <span>{isPaused ? t('cta.resume') : t('cta.pause')}</span>
            </Button>

            {/* Mute Mic toggle */}
            <button
              onClick={() => setIsMicMuted(!isMicMuted)}
              className={`p-2.5 rounded-full border transition-colors ${
                isMicMuted
                  ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                  : 'bg-ink-700 text-gray-300 border-gray-700 hover:text-paper'
              }`}
              title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {/* Primary Action: Done Answering */}
          <Button
            variant="volt"
            size="md"
            disabled={isPaused || orbState === 'thinking'}
            onClick={handleDoneAnswering}
            className="gap-2 font-black px-6 sm:px-8 text-sm sm:text-base shadow-volt-glow"
          >
            <span>{t('cta.doneAnswering')}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          {/* End mock button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEndConfirm(true)}
            className="text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 gap-1.5"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="hidden sm:inline">{t('cta.end')}</span>
          </Button>
        </div>
      </div>

      {/* Paused Overlay */}
      {isPaused && (
        <div className="fixed inset-0 z-40 bg-ink-900/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-volt-400 text-ink-900 flex items-center justify-center mb-4">
            <Pause className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-paper mb-2">{t('room.pausedTitle')}</h3>
          <p className="text-sm text-gray-300 max-w-sm mb-6">{t('room.pausedBody')}</p>
          <Button variant="volt" size="lg" onClick={() => setIsPaused(false)}>
            {t('cta.resume')} Mock
          </Button>
        </div>
      )}

      {/* End Session Confirmation Modal */}
      <AnimatePresence>
        {showEndConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="bg-ink-800 border border-gray-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black text-paper mb-2">{t('room.confirmEndTitle')}</h4>
              <p className="text-xs sm:text-sm text-gray-300 mb-6 leading-relaxed">
                {t('room.confirmEndBody')}
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setShowEndConfirm(false)}
                  className="text-gray-300 border border-gray-700"
                >
                  {t('room.confirmEndNo')}
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleEndConfirmed}
                  className="bg-red-600 hover:bg-red-700 text-paper"
                >
                  {t('room.confirmEndYes')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Tips Drawer / Sheet */}
      <AnimatePresence>
        {showHelpSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelpSheet(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-md bg-ink-900 border-l border-gray-800 p-6 z-50 overflow-y-auto flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-6">
                  <h3 className="text-base font-bold text-paper flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-volt-400" />
                    <span>Quick Viva Tips</span>
                  </h3>
                  <button onClick={() => setShowHelpSheet(false)} className="text-gray-400 hover:text-paper">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs text-gray-300">
                  <div className="p-3.5 rounded-xl bg-ink-800 border border-gray-700">
                    <p className="font-bold text-paper mb-1">1. Structure with STAR method</p>
                    <p>Describe Situation, Task, Action, and the quantified Result.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-ink-800 border border-gray-700">
                    <p className="font-bold text-paper mb-1">2. Speak slightly louder</p>
                    <p>A clear projection signals inner calm and ensures high accuracy in transcription.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-ink-800 border border-gray-700">
                    <p className="font-bold text-paper mb-1">3. Don&apos;t rush your pause</p>
                    <p>Taking 2–3 seconds to collect your thoughts before answering is perceived as thoughtful, not weak.</p>
                  </div>
                </div>

                {/* Technical Failure Recovery (Section 3 Requirement) */}
                <div className="mt-6 pt-4 border-t border-gray-800">
                  <p className="text-xs font-bold text-gray-400 mb-1">Experiencing Technical Disruption?</p>
                  <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">
                    If a browser audio freeze or network failure prevents your interview, restore your deducted minutes back to your wallet.
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const res = await api.wallet.restoreMinutesForFailure(sessionId, 'Candidate reported technical difficulty');
                        toast(`Restored ${res.restored} minutes back to your wallet.`, 'success');
                        router.push('/dashboard');
                      } catch (err: any) {
                        toast(err.message || 'Failed to restore minutes.', 'error');
                      }
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all text-center"
                  >
                    Restore Deducted Minutes & Exit
                  </button>
                </div>
              </div>

              <Button variant="secondary" size="sm" onClick={() => setShowHelpSheet(false)} className="w-full mt-6">
                Close Tips
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

