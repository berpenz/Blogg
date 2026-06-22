import React, { useEffect, useState } from 'react';

const WORDS = [
  'Erinnerung', 'Zeit', 'Zuhause', 'Vater', 'Kreativität', 'Zufall',
  'Stille', 'Veränderung', 'Licht', 'Anfang', 'Moment', 'Horizont',
  'Fragen', 'Heimat', 'Wachstum', 'Klang', 'Perspektive', 'Atem',
  'Neugier', 'Verbindung', 'Zwischenraum', 'Morgen', 'Schatten',
  'Wunder', 'Weg', 'Gedanke', 'Wahrheit', 'Tiefe', 'Rhythmus',
  'Beobachtung', 'Herz', 'Wandel', 'Farbe', 'Geschichte'
];

export default function Gedankenstrom() {
  const [thoughts, setThoughts] = useState([]);

  useEffect(() => {
    const initial = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      word: WORDS[Math.floor(Math.random() * WORDS.length)],
      left: Math.random() * 90 + 5,
      duration: 35 + Math.random() * 30,
      delay: Math.random() * -40,
      size: 14 + Math.random() * 10,
    }));
    setThoughts(initial);

    const interval = setInterval(() => {
      setThoughts(prev => {
        const next = [...prev];
        const idx = Math.floor(Math.random() * next.length);
        next[idx] = {
          ...next[idx],
          id: Date.now(),
          word: WORDS[Math.floor(Math.random() * WORDS.length)],
          left: Math.random() * 90 + 5,
          duration: 35 + Math.random() * 30,
          delay: 0,
        };
        return next;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {thoughts.map(t => (
        <span
          key={t.id}
          className="thought-word text-foreground/[0.04]"
          style={{
            left: `${t.left}%`,
            fontSize: `${t.size}px`,
            animationDuration: `${t.duration}s`,
            animationDelay: `${t.delay}s`,
          }}
        >
          {t.word}
        </span>
      ))}
    </div>
  );
}