'use client';
import { useEffect, useState } from 'react';

export default function Widget() {
  const params = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  );
  const brand = params.get('brand') || 'Mojo Insurance';
  const primary = params.get('primary') || '#0ea5e9';
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (typeof e.data === 'object' && e.data?.type === 'mojo:toggle') setOpen(o => !o);
      if (typeof e.data === 'object' && e.data?.type === 'mojo:open') setOpen(true);
      if (typeof e.data === 'object' && e.data?.type === 'mojo:close') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Only render the chat UI if open
  if (open) return null;

  return (
    <div
      className="z-[9999] font-sans w-[360px] max-w-full h-[520px] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-black/10 bg-white"
    >
      <div
        className="flex items-center justify-between px-4 py-3 font-semibold text-white"
        style={{ background: 'var(--purple-gradient)' }}
      >
        <span>{brand} — Quote Assistant</span>
        <button
          className="ml-2 text-white hover:text-gray-200 focus:outline-none cursor-pointer"
          aria-label="Close chat bot"
          onClick={() => {
            if (window.parent) {
              window.parent.postMessage({ type: 'mojo:close' }, '*');
            }
            setOpen(false); // fallback for standalone
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="p-3 space-y-2">
        <p className="m-0 text-black">Hi! I can collect the details we need for a homeowners quote.</p>
        {/* TODO: Replace with your stepper/intake UI */}
      </div>
    </div>
  );
}
