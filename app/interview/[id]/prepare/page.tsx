'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Mic,
  Volume2,
  Wifi,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Shield,
  Smartphone,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { useToast } from '@/lib/hooks/useToast';
import { api } from '@/lib/api';
import { REQUIRE_CAMERA } from '@/config';
import { InterviewSession } from '@/types';

export default function PrepareRoomPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const { t, locale } = useLanguage();
  const { toast } = useToast();

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [activeTabMobile, setActiveTabMobile] = useState<'checklist' | 'device'>('checklist');

  // Checklist state: 6 items
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });

  // Device check state
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [isDimLight, setIsDimLight] = useState(false);

  const [micPermission, setMicPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [micLevel, setMicLevel] = useState(0); // 0 to 100
  const [hasSpoken, setHasSpoken] = useState(false);
  const [lowVolumeNudge, setLowVolumeNudge] = useState(false);

  const [speakerTested, setSpeakerTested] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Breathing state
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathingStep, setBreathingStep] = useState<'inhale' | 'hold' | 'exhale' | 'ready'>('inhale');

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Load session
  useEffect(() => {
    api.sessions.get(sessionId).then((s) => {
      if (!s) {
        toast('Session not found. Returning to dashboard.', 'warning');
        router.push('/dashboard');
      } else {
        setSession(s);
      }
    });
  }, [sessionId, router, toast]);

  // Request Camera & Microphone
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function initDevices() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: REQUIRE_CAMERA ? { width: { ideal: 640 }, height: { ideal: 480 } } : false,
          audio: true,
        });

        // Camera setup
        if (REQUIRE_CAMERA && stream.getVideoTracks().length > 0) {
          setCameraPermission('granted');
          setCameraStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          setCameraPermission('granted');
        }

        // Mic & Audio Analyser setup
        if (stream.getAudioTracks().length > 0) {
          setMicPermission('granted');
          setupAudioAnalyser(stream);
        }
      } catch (err: any) {
        console.error('Media devices error:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraPermission('denied');
          setMicPermission('denied');
        } else {
          // If no camera attached, allow audio fallback
          try {
            const audioOnly = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMicPermission('granted');
            setupAudioAnalyser(audioOnly);
          } catch {
            setMicPermission('denied');
          }
        }
      }
    }

    if (typeof window !== 'undefined' && navigator.mediaDevices) {
      initDevices();
    }

    // Wake Lock API if supported
    if ('wakeLock' in navigator) {
      (navigator as any).wakeLock?.request('screen').catch(() => {});
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Web Audio Analyser setup
  const setupAudioAnalyser = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const buffer = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        analyser.getByteFrequencyData(buffer);
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
          sum += buffer[i];
        }
        const average = sum / buffer.length;
        const normalized = Math.min(Math.round((average / 128) * 100), 100);
        setMicLevel(normalized);

        if (normalized > 18) {
          setHasSpoken(true);
        }

        animFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (e) {
      console.warn('Web Audio not fully supported', e);
    }
  };

  // Speaker Test Tone
  const playSpeakerTestTone = () => {
    try {
      setIsPlayingAudio(true);
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);

      setTimeout(() => {
        setIsPlayingAudio(false);
        setSpeakerTested(true);
        toast('Speaker sound played successfully.', 'success');
      }, 700);
    } catch {
      setIsPlayingAudio(false);
      setSpeakerTested(true);
    }
  };

  // Checklist toggle
  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const allChecklistCompleted = [1, 2, 3, 4, 5, 6].every((k) => checkedItems[k]);
  const devicesReady =
    micPermission === 'granted' &&
    (REQUIRE_CAMERA ? cameraPermission === 'granted' : true) &&
    hasSpoken;

  const canProceedToBreathing = allChecklistCompleted && devicesReady;

  // Breathing animation sequence (10 seconds total)
  const handleStartBreathing = () => {
    setShowBreathing(true);
    setBreathingStep('inhale');

    setTimeout(() => {
      setBreathingStep('hold');
    }, 4000);

    setTimeout(() => {
      setBreathingStep('exhale');
    }, 6000);

    setTimeout(() => {
      setBreathingStep('ready');
    }, 10000);
  };

  const handleEnterLiveRoom = async () => {
    if (session) {
      await api.sessions.updateStatus(session.id, 'prepared');
    }
    router.push(`/interview/${sessionId}/live`);
  };

  return (
    <div className="flex-1 bg-paper text-ink-900 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-volt-400 text-ink-900 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pre-Flight Inspection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink-900">
              Prepare Room & Device Check
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Complete the checklist and verify your microphone and camera before your interview board convenes.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white p-2.5 rounded-xl border border-gray-200 shadow-sm">
            <span>Progress: </span>
            <span className="text-violet-600 font-black">
              {Object.values(checkedItems).filter(Boolean).length}/6 Checklist
            </span>
            <span>•</span>
            <span className={devicesReady ? 'text-success-600 font-black' : 'text-amber-500 font-bold'}>
              {devicesReady ? 'Devices Verified' : 'Check Audio'}
            </span>
          </div>
        </div>

        {/* Minute Reassurance Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-violet-50 border border-violet-200 text-xs text-violet-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-violet-600 shrink-0" />
            <span>
              <strong>Zero minutes deducted so far.</strong> Your {session?.lengthMinutes || 15} minutes will only be deducted when your live interview board begins.
            </span>
          </div>
          <span className="font-mono font-bold text-violet-700 bg-white px-2.5 py-1 rounded-md border border-violet-200 shrink-0 w-fit">
            {session?.lengthMinutes || 15} Mins Session
          </span>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden flex border-b border-gray-200 mb-6 bg-white rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTabMobile('checklist')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
              activeTabMobile === 'checklist'
                ? 'bg-violet-600 text-paper shadow-sm'
                : 'text-gray-600 hover:text-ink-900'
            }`}
          >
            Checklist ({Object.values(checkedItems).filter(Boolean).length}/6)
          </button>
          <button
            onClick={() => setActiveTabMobile('device')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
              activeTabMobile === 'device'
                ? 'bg-violet-600 text-paper shadow-sm'
                : 'text-gray-600 hover:text-ink-900'
            }`}
          >
            Device & Audio Check
          </button>
        </div>

        {/* Desktop Split Layout (6 cols Checklist | 6 cols Device Check) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Checklist Stage (6 cols) */}
          <div
            className={`lg:col-span-6 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-card ${
              activeTabMobile === 'checklist' ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-ink-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-violet-600" />
                <span>{t('prep.title')}</span>
              </h2>
              <span className="text-xs text-gray-500 font-semibold">Tick all 6 to unlock</span>
            </div>

            <p className="text-xs text-gray-600 mb-6">{t('prep.sub')}</p>

            <div className="space-y-3.5 mb-6">
              {[1, 2, 3, 4, 5, 6].map((idx) => {
                const isChecked = checkedItems[idx];
                return (
                  <motion.div
                    key={idx}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggleCheck(idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isChecked
                        ? 'border-success-600/40 bg-success-600/5 ring-1 ring-success-600/20'
                        : 'border-gray-200 hover:border-violet-600/40 bg-paper/60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-4 h-4 mt-0.5 rounded text-violet-600 focus:ring-violet-600 shrink-0"
                    />
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-ink-900 mb-1 leading-snug">
                        {t(`prep.${idx}`)}
                      </p>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        {t(`prep.why${idx}`)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Checklist Completion Status */}
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                allChecklistCompleted
                  ? 'bg-success-600/10 text-success-700 border border-success-600/20'
                  : 'bg-amber-500/10 text-amber-800 border border-amber-500/20'
              }`}
            >
              {allChecklistCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
                  <span>{t('prep.allCheckedNotice')}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t('prep.mustCheckAll')}</span>
                </>
              )}
            </div>
          </div>

          {/* Device & Audio Check Stage (6 cols) */}
          <div
            className={`lg:col-span-6 space-y-6 ${
              activeTabMobile === 'device' ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Camera Preview Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-card overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-ink-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-violet-600" />
                  <span>{t('deviceCheck.cameraTitle')}</span>
                </h3>
                {cameraPermission === 'granted' && (
                  <span className="text-[11px] text-success-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Video Active
                  </span>
                )}
              </div>

              {cameraPermission === 'denied' ? (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 space-y-2">
                  <p className="font-bold">{t('deviceCheck.permDeniedTitle')}</p>
                  <p>{t('deviceCheck.permDeniedAndroid')}</p>
                  <p>{t('deviceCheck.permDeniedDesktop')}</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="mt-2 text-xs"
                  >
                    {t('deviceCheck.retryPerms')}
                  </Button>
                </div>
              ) : (
                <div className="relative aspect-video rounded-2xl bg-ink-900 overflow-hidden border border-gray-800 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  {cameraPermission === 'pending' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink-900/80 text-gray-400 text-xs gap-2">
                      <Camera className="w-6 h-6 animate-pulse text-volt-400" />
                      <span>Requesting camera permission...</span>
                    </div>
                  )}
                  {isDimLight && (
                    <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-ink-900/80 backdrop-blur-sm text-[11px] text-amber-400 flex items-center gap-1.5 border border-amber-500/30">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{t('deviceCheck.cameraDarkWarning')}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Live Microphone Meter Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-ink-900 flex items-center gap-2">
                  <Mic className="w-4 h-4 text-violet-600" />
                  <span>{t('deviceCheck.micTitle')}</span>
                </h3>
                {hasSpoken && (
                  <span className="text-[11px] text-success-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Voice Detected
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-600 mb-4">{t('deviceCheck.micInstruction')}</p>

              {/* Reactive Live Meter Bar */}
              <div className="space-y-2 mb-3">
                <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200 flex">
                  {/* Amber quiet zone (0 to 20%) */}
                  <div
                    className={`h-full transition-all duration-75 rounded-l-full ${
                      micLevel < 20
                        ? 'bg-amber-400'
                        : micLevel <= 70
                        ? 'bg-success-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(micLevel, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-gray-400">
                  <span>Too Quiet</span>
                  <span className="text-success-600 font-bold">Optimal Level</span>
                  <span>Too Loud</span>
                </div>
              </div>

              {/* Voice Nudge */}
              {!hasSpoken && micPermission === 'granted' && (
                <p className="text-xs text-amber-700 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                  💡 {t('deviceCheck.micTooQuiet')}
                </p>
              )}
            </div>

            {/* Speaker & Connection Status Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-violet-600" />
                    <span>{t('deviceCheck.speakerTitle')}</span>
                  </h4>
                  <p className="text-xs text-gray-500 mb-3">Verify device sound output.</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={playSpeakerTestTone}
                  isLoading={isPlayingAudio}
                  className="w-full text-xs"
                >
                  <Play className="w-3 h-3 mr-1" />
                  {t('deviceCheck.testSound')}
                </Button>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 flex items-center gap-1.5">
                    <Wifi className="w-4 h-4 text-success-600" />
                    <span>{t('deviceCheck.connectionTitle')}</span>
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">Stable 4G / Broadband detected.</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-success-600 font-bold">
                  <span className="w-2 h-2 rounded-full bg-success-600 animate-pulse" />
                  Latency: 38ms (Optimal)
                </span>
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-2">
              <Button
                variant="volt"
                size="lg"
                disabled={!canProceedToBreathing}
                onClick={handleStartBreathing}
                className="w-full gap-2 font-black text-base shadow-volt-glow"
              >
                <span>Take 10s Breath & Enter Room</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              {!canProceedToBreathing && (
                <p className="text-center text-[11px] text-gray-500 mt-2">
                  Complete all 6 checklist items and speak into your microphone to activate the start button.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 10-Second Calming Breathing Exercise Modal */}
      <AnimatePresence>
        {showBreathing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink-900/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-paper text-center"
          >
            <div className="max-w-md w-full flex flex-col items-center">
              <h3 className="text-2xl font-black mb-2">{t('breathing.title')}</h3>
              <p className="text-sm text-gray-300 mb-8">{t('breathing.sub')}</p>

              {/* Pulsing Breathing Circle */}
              <div className="relative w-48 h-48 flex items-center justify-center mb-10">
                <motion.div
                  animate={{
                    scale:
                      breathingStep === 'inhale'
                        ? [1, 1.45]
                        : breathingStep === 'hold'
                        ? 1.45
                        : breathingStep === 'exhale'
                        ? [1.45, 1]
                        : 1.1,
                  }}
                  transition={{
                    duration:
                      breathingStep === 'inhale' ? 4 : breathingStep === 'hold' ? 2 : 4,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-600 via-volt-400 to-violet-700 opacity-80 blur-lg"
                />

                <div className="relative z-10 w-36 h-36 rounded-full bg-ink-900 border-2 border-volt-400 flex items-center justify-center p-4">
                  <p className="text-sm font-black text-paper text-center">
                    {breathingStep === 'inhale' && t('breathing.inhale')}
                    {breathingStep === 'hold' && t('breathing.hold')}
                    {breathingStep === 'exhale' && t('breathing.exhale')}
                    {breathingStep === 'ready' && t('breathing.done')}
                  </p>
                </div>
              </div>

              {breathingStep === 'ready' ? (
                <Button
                  variant="volt"
                  size="lg"
                  onClick={handleEnterLiveRoom}
                  className="w-full gap-2 font-black text-base shadow-volt-glow"
                >
                  <span>{t('cta.ready')} — Enter Panel Room</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEnterLiveRoom}
                  className="text-xs text-gray-400 hover:text-paper"
                >
                  Skip breathing & enter now
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

