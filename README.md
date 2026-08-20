# Rai Logistics - Premium Truck Dispatch Services Website

A premium, enterprise-grade website for Rai Logistics truck dispatch services. Built with Next.js 14, Tailwind CSS, and Framer Motion.

## Features

- 🚛 **Complete Multi-Page Website**: Home, Services, Equipment, Pricing, Testimonials, About, FAQ, Contact, Privacy Policy, and Terms of Service
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- ✨ **Premium Animations**: Scroll reveals, hover effects, animated counters, testimonial carousel
- 📞 **Conversion-Focused**: Sticky call widgets, prominent CTAs, quote modal
- 🎨 **Premium Design**: Clean layout, professional typography, subtle gradients
- 🔍 **SEO Optimized**: Meta tags, JSON-LD schema, semantic HTML
- ⚡ **Performance Optimized**: Lazy loading, GPU-friendly animations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rai-logistics
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. For production deployment:
```bash
vercel --prod
```

### Option 2: Deploy via GitHub Integration

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect Next.js and configure the build settings
6. Click "Deploy"

## Project Structure

```
rai-logistics/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/              # About page
│   │   ├── contact/            # Contact page
│   │   ├── equipment/          # Equipment page
│   │   ├── faq/                # FAQ page
│   │   ├── pricing/            # Pricing page
│   │   ├── privacy/            # Privacy Policy page
│   │   ├── services/           # Services page
│   │   ├── terms/              # Terms of Service page
│   │   ├── testimonials/       # Testimonials page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Homepage
│   ├── components/             # Reusable components
│   │   ├── AnimatedCounter.tsx
│   │   ├── Button.tsx
│   │   ├── FAQAccordion.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── PricingTable.tsx
│   │   ├── QuoteModal.tsx
│   │   ├── ScrollReveal.tsx
│   │   ├── ServiceIcon.tsx
│   │   ├── StickyCallWidgets.tsx
│   │   ├── TestimonialCarousel.tsx
│   │   └── index.ts
│   └── lib/
│       └── constants.ts        # Business info, content data
├── public/                     # Static assets
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── next.config.js              # Next.js configuration
└── package.json
```

## Customization

### Business Information

All business details (phone, email, address, etc.) are centralized in `src/lib/constants.ts`. Update this file to change:

- Company name and parent company
- Phone number (including click-to-call links)
- Email address
- Physical address
- Service descriptions
- Pricing information
- Testimonials
- FAQ content

### Styling

- **Colors**: Modify the color palette in `tailwind.config.ts`
- **Typography**: Update font families in `tailwind.config.ts` and `globals.css`
- **Animations**: Customize in `tailwind.config.ts` and Framer Motion components

### Adding New Pages

1. Create a new folder in `src/app/` with the page name
2. Add a `page.tsx` for server-side metadata
3. Create a client component for interactive content

## Performance Considerations

- All animations respect `prefers-reduced-motion`
- Images should be optimized before deployment
- Consider adding real images to replace placeholder content

## License

Private - All rights reserved.

## Support

For questions or support, contact:
- Email: sam@railogistics.us
- Phone: (307) 303-9797
