# Dropbox Brand Transition

![Dropbox Brand](https://placehold.co/600x400/0061FF/white?text=Dropbox+Brand+Transition)

An interactive scroll animation showcasing the Dropbox brand design system. This Next.js application demonstrates an elegant, smooth transition between design elements with scroll-based animations.

## ✨ Features

- **Interactive Design Grid**: Visually engaging presentation of design system elements
- **Smooth Scroll Animations**: Responsive transitions with eased scrolling effects
- **Framer Motion Integration**: Powered by Framer Motion for fluid animations
- **Responsive Layout**: Adapts to different screen sizes
- **Dynamic Grid System**: Showcases design system components in an organized grid

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd kraftbase
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
kraftbase/
├── src/
│   ├── app/                # Next.js App Router 
│   │   ├── new-home/       # Main interactive page
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Entry point
│   ├── components/
│   │   └── design-system/  # Design system components
│   │       ├── DesignSystemGrid.tsx    # Main grid component
│   │       ├── DesignSystemItem.tsx    # Individual item component
│   │       ├── itemData.tsx            # Content for design elements
│   │       ├── types.ts                # TypeScript type definitions
│   │       └── useDesignSystem.ts      # Custom hook for logic
│   └── lib/                # Utility functions
│       └── utils.ts        # Helper utilities
└── public/                 # Static assets
```

## 🎨 Design System Components

The interactive display includes the following design elements:

- **Framework**: Structural foundation for design decisions
- **Voice & Tone**: Communication style guidelines
- **Logo**: Brand mark and usage guidelines
- **Typography**: Font families and text styles
- **Color**: Brand color palette
- **Iconography**: Icon design system
- **Imagery**: Photography and illustration guidelines
- **Motion**: Animation principles
- **Accessibility**: Inclusive design practices

## 🛠️ Technologies Used

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Lucide React](https://lucide.dev/) - Icon library

## 📱 Responsive Design

The application is designed to work across different devices:

- Desktop: Full interactive experience
- Tablet: Adapted grid layout 
- Mobile: Simplified scrolling experience

## 🧪 Development

### Build for Production

```bash
npm run build
# or
yarn build
```

### Start Production Server

```bash
npm run start
# or
yarn start
```

### Linting

```bash
npm run lint
# or
yarn lint
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Dropbox for design inspiration
- [Framer Motion](https://www.framer.com/motion/) for the animation capabilities
- [Next.js](https://nextjs.org/) team for the excellent framework
