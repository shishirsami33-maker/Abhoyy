'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  FileText,
  AlertTriangle,
  ArrowLeft,
  Clock,
  Sparkles,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Trash2,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Orb } from '@/components/ui/Orb';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { useToast } from '@/lib/hooks/useToast';
import { api } from '@/lib/api';
import { SessionRecording, TranscriptEntry } from '@/types';
import { RECORDING_RETENTION_DAYS } from '@/config';

function RecordingContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.id as string;
  const initialTime = parseInt(searchParams.get('t') || '0', 10);

  const { t, locale } = useLanguage();
  const { toast } = useToast();

  const [recording, setRecording] = useState<SessionRecording | null>(null);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeFlagFilter, setActiveFlagFilter] = useState<'all' | 'flagged'>('all');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadWarning, setShowDownloadWarning] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    api.recordings.get(sessionId).then((rec) => {
      setRecording(rec);
    });
  }, [sessionId]);

  // Playback simulation
  useEffect(() => {
    if (isPlaying && recording && !recording.isDeleted) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (recording && prev >= recording.durationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, recording]);

  const handleSeek = (seconds: number) => {
    if (recording?.isDeleted) return;
    setCurrentTime(seconds);
  };

  const handleConfirmDownloadAndPurge = async () => {
    setIsDownloading(true);
    try {
      const res = await api.recordings.downloadAndPurge(sessionId);
      toast(res.message, 'success');
      setShowDownloadWarning(false);
      // Refresh recording state
      const updated = await api.recordings.get(sessionId);
      setRecording(updated);
      setIsPlaying(false);
    } catch (err: any) {
      toast(err.message || 'Download failed.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const formatSec = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!recording) {
    return (
      <div className="flex-1 bg-paper text-ink-900 py-16 text-center">
        <p className="text-sm text-gray-500">Loading interview recording and synchronized transcript...</p>
      </div>
    );
  }

  const filteredTranscript =
    activeFlagFilter === 'flagged'
      ? recording.transcript.filter((entry) => entry.flagged)
      : recording.transcript;

  return (
    <div className="flex-1 bg-paper text-ink-900 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/interview/${sessionId}/report`}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-600 hover:text-ink-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Report</span>
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-xs font-mono font-bold text-volt-500 bg-ink-900 px-2.5 py-0.5 rounded-md">
              Session Recording #{sessionId.slice(-6)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!recording.isDeleted && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDownloadWarning(true)}
                className="gap-1.5 text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download & Purge</span>
              </Button>
            )}
            <Link href={`/interview/${sessionId}/report`}>
              <Button variant="primary" size="sm" className="gap-1.5 text-xs font-bold">
                <FileText className="w-3.5 h-3.5" />
                <span>View Full Report</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* 30-Day Retention & Single-Download Privacy Banner */}
        {recording.isDeleted ? (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Privacy Protected:</strong> This recording was permanently purged from our servers following your download. Your interactive transcript and AI Diagnostic Report remain permanently accessible.
              </span>
            </div>
            <span className="font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-md shrink-0">
              Purged
            </span>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-white border border-gray-200 text-xs text-gray-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-violet-600 shrink-0" />
              <span>
                <strong>Privacy Policy:</strong> Recording is retained for a maximum of {RECORDING_RETENTION_DAYS} days and will be automatically purged immediately after your first download.
              </span>
            </div>
            <span className="font-medium text-gray-500 shrink-0">
              Auto-delete in 30 days
            </span>
          </div>
        )}

        {/* Media Player + Interactive Transcript Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Player Stage (7 cols) */}
          <div className="lg:col-span-7 bg-ink-900 rounded-3xl border border-gray-800 p-4 sm:p-6 shadow-2xl flex flex-col justify-between min-h-[460px]">
            {/* Viewport */}
            <div className="relative aspect-video rounded-2xl bg-ink-950 border border-gray-800 flex items-center justify-center overflow-hidden mb-4">
              {recording.isDeleted ? (
                <div className="text-center p-6 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-ink-800 text-gray-400 flex items-center justify-center mx-auto mb-2">
                    <Trash2 className="w-6 h-6 text-gray-400" />
                  </div>
                  <h4 className="text-sm font-bold text-paper">Video Purged</h4>
                  <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                    The raw video file was purged upon download per our privacy policy. Use the transcript on the right to review questions and answers.
                  </p>
                </div>
              ) : (
                <>
                  <Orb
                    state={isPlaying ? 'speaking' : 'idle'}
                    size={140}
                    micLevel={isPlaying ? 45 : 0}
                  />

                  {/* Simulated Floating Camera preview tile */}
                  <div className="absolute bottom-3 right-3 w-28 h-20 bg-ink-800/90 rounded-xl border border-gray-700/80 flex flex-col items-center justify-center text-xs text-gray-400 shadow-md">
                    <Camera className="w-4 h-4 mb-1 text-gray-400" />
                    <span className="text-[10px]">Candidate Video</span>
                  </div>

                  {/* Active Speaker Subtitle */}
                  <div className="absolute top-3 left-3 bg-ink-900/80 px-2.5 py-1 rounded-md border border-gray-700 text-[11px] text-volt-400 font-mono">
                    {formatSec(currentTime)} / {formatSec(recording.durationSeconds)}
                  </div>
                </>
              )}
            </div>

            {/* Playback Controls Bar */}
            <div className="space-y-3 pt-2">
              {/* Scrubbing timeline */}
              <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden cursor-pointer">
                <div
                  className="h-full bg-volt-400 transition-all duration-200"
                  style={{
                    width: `${(currentTime / Math.max(recording.durationSeconds, 1)) * 100}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-paper pt-1">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={recording.isDeleted}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2.5 rounded-full bg-volt-400 text-ink-900 hover:bg-volt-500 transition-all cursor-pointer font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-ink-900" />}
                  </button>

                  <button
                    type="button"
                    disabled={recording.isDeleted}
                    onClick={() => handleSeek(0)}
                    className="p-2 text-gray-400 hover:text-paper transition-colors disabled:opacity-50"
                    title="Restart"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    disabled={recording.isDeleted}
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 text-gray-400 hover:text-paper transition-colors disabled:opacity-50"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="text-xs font-mono text-gray-400">
                  <span>{formatSec(currentTime)}</span> / <span>{formatSec(recording.durationSeconds)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Synchronized Interactive Transcript (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 shadow-card h-[540px] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-ink-900">Synchronized Transcript</h3>
                <p className="text-xs text-gray-500">Click any timestamp to seek</p>
              </div>

              <div className="flex items-center gap-1.5 bg-paper p-1 rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveFlagFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeFlagFilter === 'all'
                      ? 'bg-violet-600 text-paper shadow-sm'
                      : 'text-gray-600 hover:text-ink-900'
                  }`}
                >
                  All ({recording.transcript.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFlagFilter('flagged')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeFlagFilter === 'flagged'
                      ? 'bg-amber-500 text-ink-900 shadow-sm'
                      : 'text-gray-600 hover:text-ink-900'
                  }`}
                >
                  Flagged (3)
                </button>
              </div>
            </div>

            {/* Transcript scrollable items */}
            <div className="overflow-y-auto py-3 space-y-3 flex-1 pr-1">
              {filteredTranscript.map((entry, idx) => {
                const isCurrent =
                  currentTime >= entry.timeSeconds &&
                  (idx === filteredTranscript.length - 1 ||
                    currentTime < filteredTranscript[idx + 1]?.timeSeconds);

                return (
                  <div
                    key={idx}
                    onClick={() => handleSeek(entry.timeSeconds)}
                    className={`p-3.5 rounded-2xl border text-xs transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-violet-600 bg-violet-50/80 ring-2 ring-violet-600/30 shadow-sm'
                        : entry.flagged
                        ? 'border-amber-300 bg-amber-50/50 hover:border-amber-400'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          entry.speaker === 'interviewer'
                            ? 'bg-ink-900 text-volt-400'
                            : 'bg-violet-100 text-violet-700'
                        }`}
                      >
                        {entry.timestamp} • {entry.speaker === 'interviewer' ? 'AI Panel' : 'You'}
                      </span>

                      {entry.flagged && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Flagged</span>
                        </span>
                      )}
                    </div>

                    <p className="text-gray-800 leading-relaxed font-normal">
                      &ldquo;{entry.text}&rdquo;
                    </p>

                    {entry.flagTitle && (
                      <p className="text-[10px] font-bold text-amber-600 mt-1">
                        Notice: {entry.flagTitle}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-gray-100 text-center">
              <Link
                href={`/interview/${sessionId}/report`}
                className="text-xs text-violet-600 font-bold hover:underline"
              >
                Jump to detailed Diagnostic Score & Recommendations &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Download & Purge Confirmation Modal */}
      <AnimatePresence>
        {showDownloadWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-black text-ink-900">
                Download & Purge Recording?
              </h3>

              <p className="text-xs text-gray-600 leading-relaxed">
                Per Abhoyy&apos;s privacy design, downloading your recording will immediately purge the raw media from our servers so your video cannot be leaked or stored permanently.
              </p>

              <div className="p-3.5 rounded-xl bg-violet-50 text-violet-900 text-xs font-semibold text-left flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                <span>
                  Your AI Diagnostic Feedback Report will remain permanently saved in your dashboard.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setShowDownloadWarning(false)}
                  disabled={isDownloading}
                  className="text-gray-600 border border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleConfirmDownloadAndPurge}
                  isLoading={isDownloading}
                  className="font-black gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Confirm Download</span>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SessionRecordingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 bg-paper text-ink-900 py-16 text-center">
          <p className="text-sm text-gray-500 font-semibold">Loading recording session...</p>
        </div>
      }
    >
      <RecordingContent />
    </Suspense>
  );
}
