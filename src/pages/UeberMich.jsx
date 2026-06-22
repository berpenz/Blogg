import React from 'react';
import { motion } from 'framer-motion';

const TIMELINE = [
  { year: 'Frühe Jahre', title: 'Neugier und Beobachtung', text: 'Schon als Kind fasziniert von Geschichten, Bildern und Klängen. Die Welt als unendliches Notizbuch.' },
  { year: 'Ausbildung', title: 'Mediengestalter Bild und Ton', text: 'Erlernen des Handwerks – wie Geschichten visuell und auditiv zum Leben erweckt werden.' },
  { year: 'Kreative Laufbahn', title: 'Kommunikationsdesigner & Audioengineer', text: 'Verbindung von visuellem Design und Sounddesign. Kommunikation als Kunstform.' },
  { year: 'Berufliche Weiterentwicklung', title: 'Customer Success Manager', text: 'Menschen verstehen, Beziehungen aufbauen. Die Kunst des Zuhörens in der Arbeitswelt.' },
  { year: 'Privates Kapitel', title: 'Vater werden', text: 'Die größte kreative Herausforderung. Die Welt noch einmal mit neuen Augen sehen.' },
  { year: 'Heute', title: 'BERPEN', text: 'Gedanken sammeln, Geschichten erzählen, Perspektiven teilen. Ein digitales Arbeitszimmer für Ideen.' },
];

export default function UeberMich() {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Über mich</span>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold mt-2">
            Der Mensch hinter den Gedanken
          </h1>
        </motion.div>

        {/* Portrait & Intro */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-24"
        >
          <div className="md:col-span-2">
            <div className="aspect-[3/4] bg-muted flex items-center justify-center">
              <span className="font-display text-6xl text-muted-foreground/20 tracking-[0.2em]">B</span>
            </div>
          </div>
          <div className="md:col-span-3 flex flex-col justify-center">
            <p className="text-lg leading-relaxed text-foreground/85 mb-6">
              Ich bin Kommunikationsdesigner, Audioengineer, Mediengestalter Bild und Ton, 
              Customer Success Manager – und Vater. Ich beobachte die Welt, sammle Geschichten 
              und versuche, in den kleinen Dingen das Große zu finden.
            </p>
            <p className="text-lg leading-relaxed text-foreground/85 mb-6">
              BERPEN ist mein digitales Arbeitszimmer. Hier schreibe ich über das Leben, 
              Kreativität, Technologie, Familie und alles, was mich bewegt. Keine Tipps, 
              keine Lifehacks – nur ehrliche Gedanken und Beobachtungen.
            </p>
            <p className="text-lg leading-relaxed text-foreground/85">
              Ich glaube daran, dass die besten Geschichten im Alltag stecken. 
              Man muss nur genau genug hinsehen.
            </p>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="mb-24">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-12">Lebensweg</h2>
          <div className="relative">
            {/* Line */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-12">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-12 md:pl-20"
                >
                  {/* Dot */}
                  <div className="absolute left-2.5 md:left-6.5 top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                  
                  <span className="text-xs uppercase tracking-[0.15em] text-primary font-medium">
                    {item.year}
                  </span>
                  <h3 className="font-heading text-xl font-semibold mt-1">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed text-sm">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center py-16 border-t border-border/50"
        >
          <blockquote className="font-heading text-2xl md:text-3xl italic text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            „Die Welt aufmerksam beobachten – das ist vielleicht die wichtigste kreative Fähigkeit."
          </blockquote>
        </motion.div>
      </div>
    </div>
  );
}