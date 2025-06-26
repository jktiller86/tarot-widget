// src/components/TarotCardWidget.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface Card {
  number: number;
  url: string;
}

interface Props {
  subscribeEndpoint: string;
}

const COVER_URL =
  'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a124b1a11a779600fb94_Cover.jpg';

const cards: Card[] = [
  { number: 1, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbcdf8/6837a123832438a378bbcdf8_01.jpg' },
  { number: 2, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a1234d1200b08de1c01f_02.jpg' },
  { number: 3, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a123b1a11a779600fa88_03.jpg' },
  { number: 4, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a1234dc40f413a7af36d_04.jpg' },
  { number: 5, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a1236162caf82d36eb95_05.jpg' },
  { number: 6, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a1236bc543b6e36ace9f_06.jpg' },
  { number: 7, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a1234dc40f413a7af371_07.jpg' },
  { number: 8, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a123a3e295a38760f1c8_08.jpg' },
  { number: 9, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a12366615a6d9df7f7f8_09.jpg' },
  { number: 10, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a12385654504f913473b_10.jpg' },
  { number: 11, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a1233bfe284ebd489faf_11.jpg' },
  { number: 12, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a12327c38ba1f2678d26_12.jpg' },
  { number: 13, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a123936359963d0588f1_13.jpg' },
  { number: 14, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a123a38bc135fdca926b_14.jpg' },
  { number: 15, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a123a47a74cd5b88126b_15.jpg' },
  { number: 16, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a1240a1d5c1664c1737e_16.jpg' },
  { number: 17, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a123ccb2139df0446b49_17.jpg' },
  { number: 18, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a1240a1d5c1664c17392_18.jpg' },
  { number: 19, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a123d6be3ee12d063e5e_19.jpg' },
  { number: 20, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a124a45d9392ce70797a_20.jpg' },
  { number: 21, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a123ff082011cf44220b_21.jpg' },
  { number: 22, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a124ead8cf6533c45891_22.jpg' },
  { number: 23, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a124d3cbc65f78bbf26f_23.jpg' },
  { number: 24, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a124a38bc135fdca92b7_24.jpg' },
  { number: 25, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a124a3e295a38760f2e5_25.jpg' },
  { number: 26, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a1240bcfe07db2bed686_26.jpg' },
  { number: 27, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a124ff082011cf44225f_27.jpg' },
  { number: 28, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a124cfa86f7c422ffeed_28.jpg' },
  { number: 29, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a124a38bc135fdca9326_29.jpg' },
  { number: 30, url: 'https://cdn.prod.website-files.com/68379778f107ba359adbbfe8/6837a124c6d9eb99f2692c64_30.jpg' },
];

const TarotCardWidget: React.FC<Props> = ({ subscribeEndpoint }) => {
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [step, setStep] = useState<'idle' | 'shuffle' | 'flip' | 'form'>('idle');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const isFlipped = step === 'flip' || step === 'form';

  const draw = () => {
    if (step === 'idle' || step === 'form') {
      const next = cards[Math.floor(Math.random() * cards.length)];
      setCurrentCard(next);
      setStep('shuffle');
      setStatus('idle');
    }
  };

  useEffect(() => {
    if (step === 'shuffle') {
      const t1 = setTimeout(() => setStep('flip'), 2000);
      return () => clearTimeout(t1);
    }
  }, [step]);

  useEffect(() => {
    if (step === 'flip') {
      const t2 = setTimeout(() => setStep('form'), 800);
      return () => clearTimeout(t2);
    }
  }, [step]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentCard) return;

    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;

    setStatus('loading');
    try {
      const res = await fetch(subscribeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          cardNumber: currentCard.number,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setStatus('success');
      } else {
        console.error(json);
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <p style={{ color: '#666', marginBottom: 20 }}>Click the deck to draw your card</p>
      <div onClick={draw} style={{ cursor: 'pointer', perspective: 1000, marginBottom: 20 }}>
        <div style={{ position: 'relative', width: 280, height: 420, margin: '0 auto' }}>
          {[0, 1, 2].map((_, i) => {
            const backImage = COVER_URL;
            const frontImage =
              i === 0 && isFlipped && currentCard ? currentCard.url : COVER_URL;
            return (
              <motion.div
                key={i}
                animate={
                  step === 'shuffle'
                    ? {
                        x: [0, -30, 40, -20, 30, 0],
                        y: [0, -20, -10, -15, -5, 0],
                        rotate: [0, -5, 3, -2, 4, 0],
                      }
                    : { rotateY: isFlipped ? 180 : 0 }
                }
                transition={{
                  duration: step === 'shuffle' ? 2 : 0.8,
                  ease: 'easeInOut',
                  delay: step === 'shuffle' ? i * 0.1 : 0,
                }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  zIndex: 3 - i,
                }}
              >
                {/* back */}
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    borderRadius: 12,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    background: `url(${backImage}) center/cover no-repeat`,
                  }}
                />
                {/* front */}
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    borderRadius: 12,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    background: `url(${frontImage}) center/cover no-repeat`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {step === 'form' && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#f5f5f5',
            padding: 20,
            borderRadius: 12,
            marginTop: 20,
            textAlign: 'left',
            maxWidth: 280,
            margin: '20px auto',
          }}
        >
          <input
            name="name"
            type="text"
            placeholder="Your Name"
            required
            style={{
              width: '100%',
              padding: 10,
              fontSize: 16,
              borderRadius: 6,
              border: '1px solid #ddd',
              marginBottom: 12,
            }}
          />
          <input
            name="email"
            type="email"
            placeholder="Your Email"
            required
            style={{
              width: '100%',
              padding: 10,
              fontSize: 16,
              borderRadius: 6,
              border: '1px solid #ddd',
              marginBottom: 12,
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              background: '#333',
              color: '#fff',
              padding: 12,
              fontSize: 16,
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Get My Reading
          </button>
        </form>
      )}

      {/* status messages */}
      {status === 'loading' && <p>Sending…</p>}
      {status === 'success' && <p style={{ color: 'green' }}>✅ Check your email soon!</p>}
      {status === 'error' && <p style={{ color: 'red' }}>❌ Something went wrong.</p>}

      {/* draw again */}
      {step === 'form' && (
        <button
          onClick={draw}
          style={{
            marginTop: 16,
            background: '#333',
            color: '#fff',
            padding: '12px 30px',
            fontSize: 16,
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Draw Another Card
        </button>
      )}
    </div>
  );
};

export default TarotCardWidget;
