'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type OrbState = 'idle' | 'speaking' | 'listening' | 'thinking' | 'paused';

interface OrbProps {
  state?: OrbState;
  micLevel?: number; // 0 to 100
  size?: number; // diameter in pixels
  className?: string;
}

export function Orb({
  state = 'idle',
  micLevel = 0,
  size = 180,
  className = '',
}: OrbProps) {
  // Compute reactive scale factor for listening state
  const normalizedLevel = Math.min(Math.max(micLevel / 100, 0), 1);
  const audioPulseScale = 1 + normalizedLevel * 0.45;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      aria-label={`AI Interviewer Orb: ${state}`}
      role="img"
    >
      {/* Outer ambient glow */}
      <motion.div
        animate={{
          scale: state === 'speaking' ? [1, 1.25, 1] : state === 'listening' ? audioPulseScale : [1, 1.1, 1],
          opacity: state === 'paused' ? 0.15 : state === 'listening' ? 0.4 + normalizedLevel * 0.5 : 0.35,
        }}
        transition={{
          duration: state === 'speaking' ? 1.4 : 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-full bg-violet-600/30 blur-2xl"
      />

      {/* Volt secondary energy aura */}
      <motion.div
        animate={{
          scale: state === 'speaking' ? [1.1, 0.9, 1.1] : [1, 1.05, 1],
          opacity: state === 'speaking' ? 0.35 : state === 'listening' && normalizedLevel > 0.3 ? 0.4 : 0.15,
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-4 rounded-full bg-volt-400/25 blur-xl"
      />

      {/* SVG Canvas for concentric reactive rings and orbital swooshes */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        <defs>
          <radialGradient id="orbCoreGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#D7FF3F" />
            <stop offset="25%" stopColor="#7B4BFF" />
            <stop offset="70%" stopColor="#5B2EFF" />
            <stop offset="100%" stopColor="#1B1B2E" />
          </radialGradient>

          <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D7FF3F" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#5B2EFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4520D6" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Orbit Swoosh (Active when thinking or speaking) */}
        <motion.g
          animate={{
            rotate: state === 'thinking' ? 360 : [0, 360],
          }}
          transition={{
            duration: state === 'thinking' ? 2 : 16,
            repeat: Infinity,
            ease: state === 'thinking' ? 'linear' : 'linear',
          }}
          style={{ originX: '100px', originY: '100px' }}
        >
          <ellipse
            cx="100"
            cy="100"
            rx="82"
            ry="40"
            stroke="url(#orbitGrad)"
            strokeWidth={state === 'thinking' ? 3.5 : 2}
            strokeDasharray={state === 'thinking' ? '20 15' : '8 6'}
            transform="rotate(-28 100 100)"
            opacity={state === 'paused' ? 0.2 : 0.8}
          />
          {/* Orbital Sparkle Satellite */}
          <circle cx="170" cy="80" r="3" fill="#D7FF3F">
            <animate
              attributeName="opacity"
              values="0.4;1;0.4"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        </motion.g>

        {/* Core Sphere */}
        <motion.circle
          cx="100"
          cy="100"
          r="54"
          fill="url(#orbCoreGrad)"
          animate={{
            scale:
              state === 'listening'
                ? audioPulseScale
                : state === 'speaking'
                ? [1, 1.08, 0.96, 1.05, 1]
                : [1, 1.03, 1],
            opacity: state === 'paused' ? 0.45 : 1,
          }}
          transition={{
            duration: state === 'speaking' ? 0.8 : 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ originX: '100px', originY: '100px' }}
        />

        {/* Dynamic sound ripple rings for speaking */}
        {state === 'speaking' && (
          <>
            <motion.circle
              cx="100"
              cy="100"
              r="62"
              stroke="#D7FF3F"
              strokeWidth="2"
              fill="none"
              animate={{
                scale: [1, 1.45],
                opacity: [0.8, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              style={{ originX: '100px', originY: '100px' }}
            />
            <motion.circle
              cx="100"
              cy="100"
              r="70"
              stroke="#5B2EFF"
              strokeWidth="2"
              fill="none"
              animate={{
                scale: [1, 1.35],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 0.4,
              }}
              style={{ originX: '100px', originY: '100px' }}
            />
          </>
        )}

        {/* Dynamic reaction for listening */}
        {state === 'listening' && normalizedLevel > 0.05 && (
          <circle
            cx="100"
            cy="100"
            r={58 + normalizedLevel * 18}
            stroke="#D7FF3F"
            strokeWidth={1.5 + normalizedLevel * 2}
            fill="none"
            opacity={0.4 + normalizedLevel * 0.5}
          />
        )}

        {/* Center Mic / A subtle emblem */}
        <g opacity={state === 'paused' ? 0.3 : 0.85} transform="translate(88, 88)">
          <path
            d="M12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2Z"
            fill="#FFFFFF"
          />
          <path
            d="M6 10V11C6 14.31 8.69 17 12 17C15.31 17 18 14.31 18 11V10"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <line x1="12" y1="17" x2="12" y2="21" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
