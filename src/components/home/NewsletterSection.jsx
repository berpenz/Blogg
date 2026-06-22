import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    await base44.entities.NewsletterSubscriber.create({ email, subscribed: true });
    setStatus('success');
    setEmail('');
  };

  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-lg mx-auto text-center"
      >
        <h3 className="font-heading text-2xl font-semibold">Gedanken begleiten</h3>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed italic font-heading">
          „Wenn dich diese Gedanken begleiten sollen."
        </p>

        {status === 'success' ? (
          <p className="mt-8 text-primary text-sm">Danke. Du hörst von mir.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Deine E-Mail-Adresse"
              className="flex-1 px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-primary transition-colors"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 bg-primary text-primary-foreground text-sm tracking-wide hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}