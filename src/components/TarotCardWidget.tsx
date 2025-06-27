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

const COVER_URL = 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca3702c235f2a66649a3_Cover.png';

const cards: Card[] = [
  { number: 1, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca373a57d2bb22c1157b_01.jpg' },
  { number: 2, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca37e156927b94d2aad2_02.jpg' },
  { number: 3, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca378f4e6bf31201eb30_03.jpg' },
  { number: 4, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca37c2bbae07b74e40b4_04.jpg' },
  { number: 5, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca37c7982e63b5709623_05.jpg' },
  { number: 6, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca377733015bf72e48b8_06.jpg' },
  { number: 7, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca375befeff4eb64b014_07.jpg' },
  { number: 8, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca3748a523c6ae832fbb_08.jpg' },
  { number: 9, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca37191bfa3d534ad5f2_09.jpg' },
  { number: 10, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca3763d3c11bd2e9f369_10.jpg' },
  { number: 11, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca37c7982e63b5709620_11.jpg' },
  { number: 12, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca378f4e6bf31201eb2c_12.jpg' },
  { number: 13, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca37d20fec6ec1af2d79_13.jpg' },
  { number: 14, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca375befeff4eb64b017_14.jpg' },
  { number: 15, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca37191bfa3d534ad5ed_15.jpg' },
  { number: 16, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca37b794d13f5228ea18_16.jpg' },
  { number: 17, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca37635d4dd619fcf6bd_17.jpg' },
  { number: 18, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca37e156927b94d2aace_18.jpg' },
  { number: 19, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca3754e0d26f7342786b_19.jpg' },
  { number: 20, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca3719c25c58254caa0c_20.jpg' },
  { number: 21, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca3741a9e6315fe77e26_21.jpg' },
  { number: 22, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca374cca8bcff3eb2852_22.jpg' },
  { number: 23, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca37655150a2d9ab96c4_23.jpg' },
  { number: 24, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca37a413b67bdd94fc23_24.jpg' },
  { number: 25, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca3710189fdb16da59fa_25.jpg' },
  { number: 26, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca37294d83177498a07c_26.jpg' },
  { number: 27, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca37cce3b03060904379_27.jpg' },
  { number: 28, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca373bb8933cf32b8d1c_28.jpg' },
  { number: 29, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca37a4ccec34fb14a221_29.jpg' },
  { number: 30, url: 'https://cdn.prod.website-files.com/6854749882081e20db95c3a1/685cca373a57d2bb22c1157f_30.jpg' },
];

const TarotCardWidget: React.FC<Props> = ({ subscribeEndpoint }) => {
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [step, setStep] = useState<'idle' | 'shuffle' | 'flip' | 'form'>('idle');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isFlipped = step === 'flip' || step === 'form';

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const draw = () => {
    // Only allow drawing if user hasn't drawn yet
    if (!hasDrawn && step === 'idle') {
      const next = cards[Math.floor(Math.random() * cards.length)];
      setCurrentCard(next);
      setStep('shuffle');
      setStatus('idle');
      setHasDrawn(true);
    }
  };

  useEffect(() => {
    if (step === 'shuffle') {
      // Extended shuffle animation from 2s to 3.5s
      const t1 = setTimeout(() => setStep('flip'), 3500);
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

  const shareCard = async () => {
    if (!currentCard) return;
    
    const shareText = `I just drew card #${currentCard.number} from the Seea Tarot deck! Get your own reading at seea.co`;
    
    // Use Web Share API if available (works for both Instagram and Facebook stories on mobile)
    if (navigator.share) {
      try {
        // Check if we can share files
        if (navigator.canShare && navigator.canShare({ files: [new File([], 'test')] })) {
          // Fetch and share the card image
          const response = await fetch(currentCard.url);
          const blob = await response.blob();
          const file = new File([blob], `seea-tarot-card-${currentCard.number}.jpg`, { type: 'image/jpeg' });
          
          await navigator.share({
            files: [file],
            title: 'My Seea Tarot Card',
            text: shareText,
          });
        } else {
          // Share without files if file sharing not supported
          await navigator.share({
            title: 'My Seea Tarot Card',
            text: shareText,
            url: 'https://seea.co',
          });
        }
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    }
  };

  return (
    <div style={{ 
      maxWidth: 600, 
      margin: '0 auto', 
      textAlign: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Neue Haas Grotesk Display", "Space Grotesk", sans-serif'
    }}>
      <div onClick={draw} style={{ cursor: hasDrawn ? 'default' : 'pointer', perspective: 1000, marginBottom: 20 }}>
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
                  duration: step === 'shuffle' ? 1.2 : 0.8,
                  ease: 'easeInOut',
                  delay: step === 'shuffle' ? i * 0.1 : 0,
                  repeat: step === 'shuffle' ? 2 : 0,
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
        <>
          <form
            onSubmit={handleSubmit}
            style={{
              background: 'rgba(206, 246, 100, 0.1)',
              padding: 24,
              borderRadius: 16,
              marginTop: 20,
              textAlign: 'left',
              maxWidth: 280,
              margin: '20px auto',
              border: '2px solid rgba(206, 246, 100, 0.3)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h3 style={{ 
                margin: '0 0 12px 0', 
                fontSize: 36, 
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 500,
                color: '#cef664',
                letterSpacing: '0px',
                textTransform: 'uppercase',
                lineHeight: '110%'
              }}>Want the full message?</h3>
              <p style={{ 
                margin: '0 0 16px 0', 
                fontSize: 16, 
                color: '#13122f',
                fontFamily: '"Space Mono", monospace',
                fontWeight: 400,
                textAlign: 'center'
              }}>
                Pop your name & email below. Then check your inbox (and your junk).
              </p>
              <p style={{ 
                margin: '0 auto', 
                fontSize: 14, 
                color: '#f94c16',
                fontStyle: 'italic',
                fontFamily: '"Space Mono", monospace',
                lineHeight: '1.4',
                backgroundColor: 'rgba(89, 89, 201, 0.8)',
                padding: '12px 16px',
                borderRadius: 8,
                textAlign: 'center',
                maxWidth: '90%'
              }}>
                (You'll get your divine message <strong>and</strong> be first to know when Seea launches in September. Good energy only, no spam. Promise.)
              </p>
            </div>
            <input
              name="name"
              type="text"
              placeholder="First Name"
              required
              style={{
                width: '100%',
                padding: 12,
                fontSize: 16,
                fontFamily: '"Space Mono", monospace',
                borderRadius: 8,
                border: '2px solid #cef664',
                marginBottom: 12,
                outline: 'none',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#5959c9';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#cef664';
              }}
            />
            <input
              name="email"
              type="email"
              placeholder="Your Email"
              required
              style={{
                width: '100%',
                padding: 12,
                fontSize: 16,
                fontFamily: '"Space Mono", monospace',
                borderRadius: 8,
                border: '2px solid #cef664',
                marginBottom: 12,
                outline: 'none',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#5959c9';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#cef664';
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                background: '#cef664',
                color: '#13122f',
                padding: 14,
                fontSize: 18,
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 500,
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                letterSpacing: '0.5px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#5959c9';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#cef664';
                e.currentTarget.style.color = '#13122f';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Send My Message
            </button>
          </form>

          {/* Social sharing button - mobile only */}
          {isMobile && (
            <div style={{ marginTop: 20, marginBottom: 20 }}>
              <button
                onClick={shareCard}
                style={{
                  background: '#fda61e',
                  color: '#f94c16',
                  padding: '12px 24px',
                  fontSize: 16,
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 500,
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ef38a6';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#5959c9';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                }}
              >
                Share Your Card
              </button>
            </div>
          )}
        </>
      )}

      {/* status messages */}
      {status === 'loading' && <p style={{ color: '#5959c9', fontFamily: '"Space Mono", monospace' }}>Sending…</p>}
      {status === 'success' && <p style={{ color: '#cef664', fontFamily: '"Space Mono", monospace', fontWeight: 500 }}>✨ Check your email soon!</p>}
      {status === 'error' && <p style={{ color: '#f94c16', fontFamily: '"Space Mono", monospace' }}>❌ Something went wrong.</p>}
    </div>
  );
};

export default TarotCardWidget;