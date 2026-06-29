import { ImageResponse } from 'next/og';

export const alt = 'BraneIQ — AI-Powered Digital Intelligence Platform';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #312e81 0%, #0f172a 50%, #1e1b4b 100%)',
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: '#a5b4fc',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Social Listening Platform
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 72,
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.1,
          }}
        >
          BraneIQ
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 32,
            color: '#cbd5e1',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Turn social noise into brand intelligence
        </div>
      </div>
    ),
    { ...size },
  );
}
