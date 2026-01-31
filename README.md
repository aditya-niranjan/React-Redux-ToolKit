# Media Search App 🖼️🎬

A React + Redux Toolkit app to search for photos (Unsplash) and videos (Pexels) with lazy loading and optimized performance.

## Features

- 🔍 Search photos and videos
- 🖼️ Lazy loading images & videos
- 🎬 Video plays on hover (poster image loads first)
- ⚡ Optimized with React.memo, useCallback
- 📱 Responsive 2-column grid layout
- 🎨 Beautiful UI with Tailwind CSS

## Tech Stack

- React 19
- Redux Toolkit
- Vite
- Tailwind CSS
- Axios

## Local Development

```bash
# Install dependencies
npm install

# Create .env file with your API keys
cp .env.example .env

# Start dev server
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_UNSPLASH_KEY=your_unsplash_api_key
VITE_PEXELS_KEY=your_pexels_api_key
```

Get your API keys:
- Unsplash: https://unsplash.com/developers
- Pexels: https://www.pexels.com/api/

## Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

## Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: GitHub Integration
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard:
   - `VITE_UNSPLASH_KEY`
   - `VITE_PEXELS_KEY`
5. Deploy!

## Deploy to Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com)
3. Create a new **Static Site**
4. Connect your repository
5. Set build command: `npm run build`
6. Set publish directory: `dist`
7. Add environment variables
8. Deploy!

## Project Structure

```
src/
├── api/
│   └── mediaApi.js       # API calls (Unsplash, Pexels)
├── components/
│   ├── ResultCard.jsx    # Image/Video card with lazy loading
│   ├── ResultGrid.jsx    # Grid container
│   ├── SearchBar.jsx     # Search input
│   └── Tabs.jsx          # Photos/Videos tabs
├── hooks/
│   ├── useDebounce.js    # Debounce hook
│   └── useLenis.js       # Smooth scroll (optional)
├── pages/
│   └── CollectionPage.jsx
├── redux/
│   ├── store.js
│   └── Features/
│       └── searchSlice.js
├── App.jsx
├── main.jsx
└── index.css
```

## License

MIT
