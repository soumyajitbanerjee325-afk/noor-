# 💖 Happy Birthday Noor - Interactive Birthday Journey

A beautiful, multi-stage interactive birthday website for Noor (born November 17). Created with love by **ruhhhh**.

## ✨ Features

### 🎂 Stage 1: Cake & Candle
- Beautiful 3-tier birthday cake with strawberries
- 5 interactive candles - click "Blow" button or use microphone to blow them out
- Confetti, heart burst, and balloon release celebration

### 📸 Stage 2: Childhood Memories
- 6 polaroid-style photos dropping in with gentle tilt animation
- Sweet captions under each photo
- Floating hearts orbiting around the gallery

### 🎮 Hurdle 1: Catch the Hearts
- Catch 10 falling hearts by moving the basket
- Mouse/touch controlled
- Progressive difficulty with score tracking

### 🌸 Stage 3: Adulthood Memories
- Smooth sliding carousel of 6 recent photos
- Elegant photo frames with decorative corners
- Auto-play with manual navigation

### 🎈 Hurdle 2: Pop the Balloons
- Pop 10 rising balloons by clicking/tapping
- Colorful balloons with realistic physics
- Celebration confetti and balloon burst

### 💌 Final Stage: Grand Reveal
- Theater curtains opening animation
- Couple photo reveal with glow, sparkles, and fireworks
- Falling rose petals and floating hearts
- Sealed envelope "Ruhhh" that opens to reveal handwritten letter
- Letter types out line by line with typewriter effect
- Replay button to experience the journey again

## 🎵 Background Music
- Soft romantic background music with mute button (M key shortcut)
- Place your music file at `public/music/romantic-bgm.mp3`

## 📸 Adding Photos

### Childhood Photos (Stage 2)
Place 6 photos in `public/photos/`:
- `childhood1.jpg` - `childhood6.jpg`
- Recommended: 4:5 aspect ratio, 800x1000px minimum

### Adulthood Photos (Stage 3)
Place 6 photos in `public/photos/`:
- `adult1.jpg` - `adult6.jpg`
- Recommended: 4:5 aspect ratio, 800x1000px minimum

### Couple Photo (Final Stage)
Place 1 photo in `public/photos/`:
- `couple.jpg`
- Recommended: Square aspect ratio, 800x800px minimum

### Photo Placeholders
The app includes beautiful gradient placeholders until you add real photos.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

### Netlify / Vercel / GitHub Pages
1. Run `npm run build`
2. Deploy the `dist` folder

### Custom Domain
Configure your domain to point to the deployed site.

## 🎨 Customization

### Colors
Edit CSS variables in `src/index.css`:
```css
:root {
  --pink-deep: #e84393;
  --pink: #ff6b9d;
  --pink-light: #ff8fab;
  --blush: #ffb3d1;
  --blush-light: #ffd6e8;
  --cream: #fff5f8;
  --lavender: #a55eea;
  --gold: #ffd700;
}
```

### Letter Text
Edit `letterText` constant in `src/stages/FinalStage.jsx`

### Stages Configuration
Modify the `stages` array in `src/App.jsx` to add/remove/reorder stages.

## 📱 Mobile Optimized
- Touch-friendly controls for all games
- Responsive layouts for all screen sizes
- Reduced motion support
- Accessible with keyboard navigation

## ♿ Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Focus indicators
- Reduced motion support
- High contrast colors
- Screen reader friendly

## 🛠 Tech Stack
- **React 18** with functional components & hooks
- **Vite** for fast development & building
- **CSS Custom Properties** for theming
- **CSS Animations** for smooth 60fps performance
- **Intersection Observer** for scroll animations
- **Web Audio API** for microphone blow detection

## 💝 Made with Love

Created for **Noor's birthday (November 17)** by **ruhhhh** ❤️

> "You are my love, my peace and my favorite person."

## 📁 Project Structure

```
├── public/
│   ├── favicon.svg
│   ├── music/
│   │   └── romantic-bgm.mp3    # Add your background music here
│   └── photos/                  # Add photos here
│       ├── childhood1-6.jpg
│       ├── adult1-6.jpg
│       └── couple.jpg
├── src/
│   ├── components/
│   │   ├── BackgroundAnimation.jsx
│   │   ├── MusicPlayer.jsx
│   │   ├── ProgressIndicator.jsx
│   │   └── StageTransition.jsx
│   ├── stages/
│   │   ├── Stage1Cake.jsx
│   │   ├── Stage2Childhood.jsx
│   │   ├── Hurdle1Hearts.jsx
│   │   ├── Stage3Adulthood.jsx
│   │   ├── Hurdle2Balloons.jsx
│   │   └── FinalStage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── App.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎁 Tips for Best Experience

1. **Photos**: Use high-quality, well-lit photos
2. **Music**: Choose a soft instrumental romantic track (~2-3 min loop)
3. **Testing**: Test on mobile before the big day
4. **Performance**: Compress images to <500KB each for fast loading
5. **Backup**: Deploy a few days early and test thoroughly

---

**Happy Birthday Noor! 💖**  
*Made with infinite love by ruhhhh*