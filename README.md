# BraneIQ Marketing Website

A modern marketing website built with Next.js, React, and Tailwind CSS.

## Features

- **Modern Stack**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Responsive Design**: Mobile-first, fully responsive for all devices
- **SEO Optimized**: Meta tags, semantic HTML, fast loading
- **Component Architecture**: Clean, reusable components
- **Docker Support**: Ready for containerized deployment

## Sections

- Header with navigation
- Hero section
- Trusted by brands
- Stats
- Solutions
- How it works
- Features
- Industries
- Testimonials
- Data sources
- Enterprise features
- FAQ
- Call-to-action
- Footer

## Local Development

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker Development

```bash
# Build and run with Docker Compose
docker compose up --build

# Or build and run manually
docker build -t braneiq-marketing .
docker run -p 3000:3000 braneiq-marketing
```

## Pages

- `/` - Homepage
- `/en` - English homepage
- `/privacy` - Privacy Policy
- `/terms` - Terms of Service
- `/ai-docs` - AI Documentation
- `/login` - Login page
- `/request-demo` - Demo request form

## Deployment

### Railway / Docker-compatible servers

1. Push to GitHub
2. Connect repository to Railway
3. Deploy automatically

### Manual Deployment

```bash
# Build production
npm run build

# Start production server
npm start
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Project Structure

```
├── app/
│   ├── components/     # React components
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Homepage
│   └── */page.tsx     # Other pages
├── public/            # Static assets
├── Dockerfile
├── docker-compose.yml
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Tech Stack

- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **TypeScript**: For type safety
- **Docker**: For containerization
