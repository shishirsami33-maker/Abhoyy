'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Orb } from '@/components/ui/Orb';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { useToast } from '@/lib/hooks/useToast';
import { api } from '@/lib/api';
import { SessionRecording, TranscriptEntry } from '@/types';

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

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    api.recordings.get(sessionId).then((rec) => {
      setRecording(rec);
    });
  }, [sessionId]);

  // Video playback simulation
  useEffect(() => {
    if (isPlaying) {
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
    setCurrentTime(seconds);
  };

  const handleDownload = () => {
    toast('Simulating local video download (MP4 container)...', 'info');
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
            <Button variant="secondary" size="sm" onClick={handleDownload} className="gap-1.5 text-xs">
              <Download className="w-3.5 h-3.5" />
              <span>Download Video</span>
            </Button>
            <Link href={`/interview/${sessionId}/report`}>
              <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                <FileText className="w-3.5 h-3.5" />
                <span>View Full Report</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Video Player + Synced Transcript Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Video Player (7 cols) */}
          <div className="lg:col-span-7 bg-ink-900 text-paper border border-gray-800 rounded-3xl p-5 sm:p-6 shadow-lifted space-y-4">
            {/* Stage Screen Area */}
            <div className="aspect-video bg-ink-800 rounded-2xl border border-gray-700/80 relative overflow-hidden flex items-center justify-center">
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <Orb
                  state={isPlaying ? 'speaking' : 'idle'}
                  size={140}
                  className="mb-3"
                />
                <span className="text-xs font-mono font-bold text-volt-400">
                  Candidate Practice Playback
                </span>
                <span className="text-[11px] text-gray-400 mt-1">
                  Private in-memory session preview
                </span>
              </div>

              {/* Floating Camera Preview Stamp */}
              <div className="absolute bottom-3 right-3 w-28 h-20 bg-ink-900 border border-gray-700 rounded-xl overflow-hidden flex items-center justify-center text-xs text-gray-400">
                <div className="flex flex-col items-center">
                  <Camera className="w-4 h-4 text-volt-400 mb-0.5" />
                  <span className="text-[10px]">Candidate</span>
                </div>
              </div>
            </div>

            {/* Scrubber & Controls */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={recording.durationSeconds}
                  value={currentTime}
                  onChange={(e) => handleSeek(parseInt(e.target.value, 10))}
                  className="w-full accent-volt-400 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-volt-400 text-ink-900 flex items-center justify-center font-bold hover:scale-105 transition-transform"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <button
                    onClick={() => handleSeek(0)}
                    className="p-2 text-gray-400 hover:text-paper"
                    title="Restart"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 text-gray-400 hover:text-paper"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="font-mono text-xs text-gray-300">
                  <span className="text-volt-400 font-bold">{formatSec(currentTime)}</span> /{' '}
                  <span>{formatSec(recording.durationSeconds)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Synchronized Transcript (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h2 className="text-base font-black text-ink-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-600" />
                <span>Synchronized Transcript</span>
              </h2>

              {/* Filter */}
              <div className="flex gap-1 p-0.5 bg-gray-100 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setActiveFlagFilter('all')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    activeFlagFilter === 'all'
                      ? 'bg-white text-ink-900 shadow-sm font-bold'
                      : 'text-gray-500 hover:text-ink-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveFlagFilter('flagged')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    activeFlagFilter === 'flagged'
                      ? 'bg-amber-500 text-ink-900 font-bold shadow-sm'
                      : 'text-gray-500 hover:text-ink-900'
                  }`}
                >
                  Flagged Only
                </button>
              </div>
            </div>

            {/* Transcript scroll area */}
            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredTranscript.map((entry, idx) => {
                const isCurrent =
                  currentTime >= entry.timeSeconds &&
                  (idx === filteredTranscript.length - 1 ||
                    currentTime < (filteredTranscript[idx + 1]?.timeSeconds ?? 9999));

                return (
                  <div
                    key={idx}
                    onClick={() => handleSeek(entry.timeSeconds)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs ${
                      isCurrent
                        ? 'border-violet-600 bg-violet-50/70 shadow-sm ring-1 ring-violet-600/30'
                        : entry.flagged
                        ? 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60'
                        : 'border-gray-200 bg-paper/50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[11px] font-bold text-gray-500">
                        {entry.timestamp}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          entry.speaker === 'interviewer'
                            ? 'bg-violet-100 text-violet-700'
                            : 'bg-ink-900 text-volt-400'
                        }`}
                      >
                        {entry.speaker === 'interviewer' ? 'AI Panel' : 'Candidate'}
                      </span>
                    </div>

                    <p className="text-gray-700 leading-relaxed font-medium">
                      {entry.text}
                    </p>

                    {entry.flagged && entry.flagTitle && (
                      <div className="mt-2 pt-1.5 border-t border-amber-500/20 text-amber-800 font-bold flex items-center gap-1.5 text-[11px]">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Flagged: {entry.flagTitle}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecordingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500 font-bold">Loading player...</div>}>
      <RecordingContent />
    </Suspense>
  );
}

