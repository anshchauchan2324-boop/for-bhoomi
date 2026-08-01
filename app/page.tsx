'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaEnvelope, FaTimes, FaGift, FaLock, FaClock } from 'react-icons/fa';
import confetti from 'canvas-confetti';

const PASSCODE = "0928";
const START_DATE = "2025-06-13";

const PHOTOS = [
  { src: "/photo1.jpg", caption: "Mayank & Bhoomi Photo 1" },
  { src: "/photo2.jpg", caption: "Mayank & Bhoomi Photo 2" }
];

const PROMISES = [
  "I promise to always listen to you, even when you're rambling about tiny things.",
  "I promise to make you laugh whenever you are feeling down.",
  "I promise to support every single dream and ambition of yours.",
  "I promise to hold your hand through every thick and thin.",
  "I promise to never let us go to sleep on an unresolved fight."
];

const MESSAGES = [
  { id: 1, title: "To My Soulmate", teaser: "A tiny secret about us...", text: "From the second you walked into my life, everything turned into bright colors. Thank you for being my anchor." },
  { id: 2, title: "My Safe Haven", teaser: "When life gets crazy...", text: "In a world that never stops rushing, you are my quiet place. Holding you feels like coming home." },
  { id: 3, title: "Forever & Always", teaser: "A gentle reminder...", text: "You are braver than you know and loved more than words could ever describe. Happy Girlfriend Day!" }
];

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const [elementsCount, setElementsCount] = useState(0);
  const [selectedMsg, setSelectedMsg] = useState<null | typeof MESSAGES[0]>(null);
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);
  const [daysTogether, setDaysTogether] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const gardenRef = useRef<any[]>([]);

  useEffect(() => {
    const start = new Date(START_DATE).getTime();
    const now = new Date().getTime();
    const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    setDaysTogether(diff > 0 ? diff : 0);
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === PASSCODE) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const colors = ['#FF4D8D', '#FF7EB3', '#6A1B9A', '#FFB6C1'];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];

    gardenRef.current.push({
      x, y, size: 0, maxSize: 18 + Math.random() * 20,
      color: chosenColor, petals: 5 + Math.floor(Math.random() * 3)
    });
    setElementsCount(gardenRef.current.length);

    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      particlesRef.current.push({
        x, y, vx: Math.cos(angle) * 2, vy: Math.sin(angle) * 2 - 1,
        size: 5, alpha: 1, color: chosenColor
      });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = canvas.parentElement?.clientHeight || 280;

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      gardenRef.current.forEach((item) => {
        if (item.size < item.maxSize) item.size += 0.5;
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.fillStyle = item.color;
        for (let i = 0; i < item.petals; i++) {
          ctx.rotate((Math.PI * 2) / item.petals);
          ctx.beginPath();
          ctx.ellipse(0, item.size * 0.5, item.size * 0.3, item.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(0, 0, item.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx; p.y += p.vy; p.alpha -= 0.02;
        if (p.alpha <= 0) { particlesRef.current.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, [isAuthenticated]);

  const triggerSurprise = () => {
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    setShowSurpriseModal(true);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f0f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '30px', borderRadius: '24px', border: '1px solid #fbcfe8', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', maxWidth: '360px', width: '100%', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: '#fce7f3', color: '#e65c8a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '20px' }}>
            <FaLock />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Private Corner</h2>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>Enter Secret Passcode to unlock Bhoomi's world</p>
          
          <form onSubmit={handlePinSubmit} style={{ marginTop: '20px' }}>
            <input
              type="password"
              placeholder="Enter PIN"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #d1d5db', textAlign: 'center', fontSize: '16px', letterSpacing: '4px', outline: 'none', boxSizing: 'border-box' }}
            />
            {pinError && <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '8px', margin: '8px 0 0 0' }}>Incorrect Passcode! Try again ❤️</p>}
            <button type="submit" style={{ width: '100%', marginTop: '16px', backgroundColor: '#e65c8a', color: '#fff', fontWeight: 'bold', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              Unlock Website
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8f5f8', padding: '30px 15px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '750px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Top Banner */}
        <div style={{ backgroundColor: '#e65c8a', color: '#fff', textAlign: 'center', padding: '12px 20px', borderRadius: '16px', fontWeight: 'bold', fontSize: '14px' }}>
          Mayank ki side se girlfriend day prr bhoomi ke liye ek choti se website ❤️
        </div>

        {/* Togetherness Counter */}
        <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '16px', border: '1px solid #fbcfe8', display: 'flex', alignItems: 'center', justifyContent: 'between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', backgroundColor: '#fdf2f8', color: '#e65c8a', borderRadius: '12px' }}>
              <FaClock style={{ fontSize: '16px' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontWeight: 'bold', color: '#1f2937', fontSize: '13px' }}>Togetherness Counter</h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>Every single day with you is special</p>
            </div>
          </div>
          <div style={{ backgroundColor: '#fdf2f8', border: '1px solid #fbcfe8', padding: '8px 14px', borderRadius: '10px', fontWeight: 'bold', color: '#e65c8a', fontSize: '12px', marginLeft: 'auto' }}>
            {daysTogether} Days & Counting 💕
          </div>
        </div>

        {/* Memories / Photos */}
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid #fbcfe8', textAlign: 'center' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#e65c8a', marginBottom: '20px' }}>
            📷 Our Memories
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {PHOTOS.map((photo, i) => (
              <div key={i} style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '16px', border: '1px solid #f3f4f6' }}>
                <div style={{ width: '100%', height: '220px', overflow: 'hidden', borderRadius: '12px' }}>
                  <img src={photo.src} alt={photo.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                </div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '10px', fontWeight: '500' }}>{photo.caption}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Song Player */}
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid #fbcfe8', textAlign: 'center' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#e65c8a' }}>
            🎵 Song Written For Bhoomi
          </h2>
          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', marginBottom: '16px' }}>Special track created by Mayank ❤️</p>
          <div style={{ maxWidth: '400px', margin: '0 auto', backgroundColor: '#f9fafb', padding: '10px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <audio controls src="/song1.mp3" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Heart Garden Canvas */}
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid #fbcfe8', textAlign: 'center' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#e65c8a' }}>
            🌷 Heart Garden & Special Messages
          </h2>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Click inside the box below to grow blooming flowers! 🌸</p>

          <div style={{ position: 'relative', width: '100%', height: '260px', marginTop: '16px', marginBottom: '10px', borderRadius: '16px', backgroundColor: '#fdf2f8', border: '1px solid #fbcfe8', overflow: 'hidden', cursor: 'pointer' }}>
            <canvas ref={canvasRef} onClick={handleCanvasClick} style={{ width: '100%', height: '100%' }} />
            {elementsCount === 0 && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', fontSize: '12px', color: '#9ca3af' }}>
                Tap here to grow flowers! 🌷
              </div>
            )}
          </div>
          <p style={{ fontSize: '12px', color: '#9ca3af' }}>Blooms planted: {elementsCount}</p>
        </div>

        {/* Secret Love Letters */}
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid #fbcfe8', textAlign: 'center' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#e65c8a', marginBottom: '16px' }}>💌 Secret Letters</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            {MESSAGES.map((msg) => (
              <div key={msg.id} onClick={() => setSelectedMsg(msg)} style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '12px', border: '1px solid #fbcfe8', cursor: 'pointer', textAlign: 'left' }}>
                <FaEnvelope style={{ fontSize: '20px', color: '#e65c8a', marginBottom: '8px' }} />
                <h3 style={{ fontWeight: 'bold', fontSize: '13px', color: '#1f2937' }}>{msg.title}</h3>
                <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>{msg.teaser}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Promises */}
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid #fbcfe8' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#e65c8a', textAlign: 'center', marginBottom: '16px' }}>💖 My Promises To You</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {PROMISES.map((promise, index) => (
              <div key={index} style={{ backgroundColor: '#f9fafb', padding: '12px 16px', borderRadius: '12px', border: '1px solid #fdf2f8', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e65c8a', fontSize: '12px', flexShrink: 0 }}>
                  <FaHeart />
                </div>
                <p style={{ fontSize: '12px', color: '#374151', fontWeight: '500', margin: 0 }}>{promise}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Surprise Button */}
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <button onClick={triggerSurprise} style={{ backgroundColor: '#e65c8a', color: '#fff', fontWeight: 'bold', padding: '12px 30px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <FaGift /> Click For A Surprise!
          </button>
        </div>

      </div>

      {/* Secret Letter Modal */}
      {selectedMsg && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px', zIndex: 50 }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '20px', maxWidth: '380px', width: '100%', position: 'relative', border: '1px solid #fbcfe8' }}>
            <button onClick={() => setSelectedMsg(null)} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', cursor: 'pointer', color: '#9ca3af' }}>
              <FaTimes />
            </button>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#e65c8a', margin: 0 }}>{selectedMsg.title}</h3>
            <p style={{ marginTop: '12px', fontSize: '13px', color: '#4b5563', lineHeight: '1.6' }}>{selectedMsg.text}</p>
          </div>
        </div>
      )}

      {/* Surprise Message Modal */}
      {showSurpriseModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px', zIndex: 50 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', maxWidth: '340px', width: '100%', textAlign: 'center', position: 'relative', border: '1px solid #fbcfe8' }}>
            <button onClick={() => setShowSurpriseModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', cursor: 'pointer', color: '#9ca3af' }}>
              <FaTimes />
            </button>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>💖</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#e65c8a', margin: 0 }}>I love you sweetheart!</h3>
            <p style={{ marginTop: '10px', fontSize: '12px', color: '#6b7280' }}>You mean the absolute world to me. Happy Girlfriend Day! ❤️</p>
            <button onClick={() => setShowSurpriseModal(false)} style={{ marginTop: '20px', backgroundColor: '#e65c8a', color: '#fff', padding: '10px 24px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
              Close ❤️
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
