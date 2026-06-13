import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BraneIQ - Social Listening & Brand Intelligence Platform',
  description: 'Turn social noise into brand intelligence. Monitor mentions, track sentiment, and respond faster with BraneIQ.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
