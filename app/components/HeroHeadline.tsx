'use client';

import { useEffect, useState } from 'react';

const WORDS = [
  { text: 'Controla', color: 'text-blue-400' },
  { text: 'Visualiza', color: 'text-purple-400' },
  { text: 'Optimiza', color: 'text-emerald-400' },
  { text: 'Gobierna', color: 'text-amber-400' },
  { text: 'Maximiza', color: 'text-pink-400' },
  { text: 'Monitorea', color: 'text-cyan-400' },
];

const ROTATE_MS = 2200;
const FADE_MS = 300;

export default function HeroHeadline() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, FADE_MS);
    }, ROTATE_MS);

    return () => clearInterval(interval);
  }, []);

  const word = WORDS[index];

  return (
    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-8 [text-shadow:0_2px_6px_rgba(0,0,0,0.9),0_4px_20px_rgba(0,0,0,0.8)]">
      FinOpsLatam{' '}
      <span
        className={`inline-block transition-all duration-300 ${word.color} ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
        }`}
      >
        {word.text}
      </span>{' '}
      costos en la nube
    </h1>
  );
}
