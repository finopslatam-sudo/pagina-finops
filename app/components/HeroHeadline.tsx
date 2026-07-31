'use client';

import { useEffect, useState } from 'react';

const WORDS = ['Controla', 'Visualiza', 'Optimiza', 'Gobierna', 'Maximiza', 'Monitorea'];

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
        className={`inline-block font-black text-blue-800 transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
        }`}
        style={{
          WebkitTextStroke: '1.5px black',
          paintOrder: 'stroke fill',
          textShadow: '0 0 6px rgba(0,0,0,0.5)',
        }}
      >
        {word}
      </span>{' '}
      costos en la nube
    </h1>
  );
}
