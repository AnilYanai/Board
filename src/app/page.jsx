'use client';

import dynamic from 'next/dynamic';

const CanvasPage = dynamic(() => import('../components/CanvasPage'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f1f1f1',
        fontFamily: 'sans-serif',
      }}
    >
      Loading whiteboard...
    </div>
  ),
});

export default function Home() {
  return <CanvasPage />;
}
