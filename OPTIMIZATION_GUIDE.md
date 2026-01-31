# 🚀 React App Optimization Guide


## What I Did: Lazy Loading for Images & Videos

### The Problem
When you load many images/videos at once, the browser downloads ALL of them immediately — even the ones not visible on screen. This causes:
- Slow initial page load
- Wasted bandwidth
- Poor user experience

### The Solution: Lazy Loading with Intersection Observer

I implemented lazy loading in `ResultCard.jsx` using the **Intersection Observer API**.

```jsx
// How it works:
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      setIsVisible(true);      // Now load the image!
      observer.disconnect();   // Stop watching
    }
  },
  { threshold: 0.1, rootMargin: '100px' }
);
```

#### Key Concepts:

| Term | Meaning |
|------|---------|
| `IntersectionObserver` | Browser API that watches when elements enter/exit the viewport |
| `isIntersecting` | Returns `true` when element is visible on screen |
| `threshold: 0.1` | Trigger when 10% of the element is visible |
| `rootMargin: '100px'` | Start loading 100px BEFORE it enters viewport (preload) |

#### What happens step-by-step:
1. Component renders with `isVisible = false`
2. Image `src` is `undefined` (no network request)
3. Observer watches the card element
4. When user scrolls and card enters viewport → `isVisible = true`
5. Image `src` gets the real URL → browser fetches it
6. `onLoad` fires → `isLoaded = true` → skeleton hides

---

## 📡 API Request Optimization Techniques

Here are more ways to optimize your API calls:

### 1. **Debouncing** (Most Important for Search!)
Don't call API on every keystroke. Wait until user stops typing.

```jsx
import { useEffect, useState } from 'react';

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage in your component:
const debouncedQuery = useDebounce(query, 500);

useEffect(() => {
  if (debouncedQuery) fetchData(debouncedQuery);
}, [debouncedQuery]);
```

**Why?** If user types "cats" fast, instead of 4 API calls (c, ca, cat, cats), you make only 1.

---

### 2. **Caching with RTK Query or React Query**
Cache responses so same query doesn't fetch twice.

```jsx
// With Redux Toolkit Query (recommended for your setup)
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const mediaApi = createApi({
  reducerPath: 'mediaApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.unsplash.com/' }),
  endpoints: (builder) => ({
    searchPhotos: builder.query({
      query: (searchTerm) => `search/photos?query=${searchTerm}`,
    }),
  }),
});

// Auto-caches! Second search for "cats" uses cached data
```

---

### 3. **Request Cancellation with AbortController**
Cancel previous request when new one starts (prevents race conditions).

```jsx
useEffect(() => {
  const controller = new AbortController();

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/search', {
        params: { query },
        signal: controller.signal  // Pass abort signal
      });
      setData(res.data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
      }
    }
  };

  fetchData();

  return () => controller.abort();  // Cancel on cleanup
}, [query]);
```

**Why?** If user searches "cat" then quickly "dog", the "cat" response might arrive AFTER "dog" and overwrite it. AbortController prevents this.

---

### 4. **Pagination / Infinite Scroll**
Don't fetch 1000 results at once. Fetch 20 at a time.

```jsx
const [page, setPage] = useState(1);

const fetchMore = async () => {
  const res = await PhotoFetcher(query, page + 1);
  setResults(prev => [...prev, ...res.results]);  // Append, don't replace
  setPage(prev => prev + 1);
};

// Trigger on scroll to bottom or "Load More" button
```

---

### 5. **Memoization with useMemo/useCallback**
Prevent unnecessary re-renders and re-calculations.

```jsx
// Memoize expensive data transformations
const formattedResults = useMemo(() => {
  return results.map(item => ({
    ...item,
    displayDate: formatDate(item.created_at)
  }));
}, [results]);

// Memoize callback functions
const handleSearch = useCallback((term) => {
  dispatch(setQuery(term));
}, [dispatch]);
```

---

### 6. **Conditional Fetching**
Don't fetch if data already exists or query is empty.

```jsx
useEffect(() => {
  // Skip if no query
  if (!query || query.trim() === '') return;
  
  // Skip if we already have results for this query (simple cache check)
  if (cachedQueries[query]) {
    setResults(cachedQueries[query]);
    return;
  }

  fetchData();
}, [query]);
```

---

### 7. **Error Retry with Exponential Backoff**
If API fails, retry with increasing delays.

```jsx
const fetchWithRetry = async (url, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.get(url);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i))); // 1s, 2s, 4s
    }
  }
};
```

---

### 8. **Image Optimization Tips**
- Use `srcset` for responsive images
- Request smaller thumbnails for grid, full size only on click
- Use WebP format when available
- Compress images before displaying

```jsx
// Request smaller image for grid
src={item.urls.small}  // 400px wide

// Full size only when user clicks to view
src={item.urls.full}   // Original size
```

---

## 🎯 Priority Order for Your App

1. ✅ **Lazy Loading** (Done!)
2. ✅ **Request Cancellation** - Prevent race conditions (Done!)
3. ✅ **React.memo** - Prevent re-renders (Done!)
4. ✅ **Lenis Smooth Scroll** - Smooth scrolling (Done!)
5. ✅ **GPU Acceleration** - Hardware acceleration (Done!)
6. 🔜 **Debouncing** - Add to SearchBar
7. 🔜 **RTK Query** - Replace manual fetch with caching
8. 🔜 **Infinite Scroll** - For better UX with many results

---

## 🆕 Latest Optimizations (What I Did)

### 1. **Lenis Smooth Scrolling** ✨
Added butter-smooth scrolling to the entire app.

```jsx
// src/hooks/useLenis.js
import Lenis from 'lenis';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
```

**Why?** Native browser scroll can feel janky. Lenis provides 60fps smooth scrolling.

---

### 2. **React.memo with Custom Comparison** ✨
Wrapped `ResultCard` in `memo()` to prevent unnecessary re-renders.

```jsx
const ResultCard = memo(({ item }) => {
  // component code
}, (prevProps, nextProps) => {
  return prevProps.item.id === nextProps.item.id;
});
```

**Why?** Without memo, EVERY card re-renders when ANY state changes. Now only the changed card re-renders.

---

### 3. **useCallback for Event Handlers** ✨
Memoized callbacks to maintain reference equality.

```jsx
const handleLoad = useCallback(() => setIsLoaded(true), []);
const handleError = useCallback(() => setHasError(true), []);
```

**Why?** Inline functions `() => {}` create new references each render, causing child re-renders.

---

### 4. **GPU Acceleration with CSS** ✨
Force browser to use GPU for smoother animations.

```jsx
const cardStyle = {
  willChange: isVisible ? 'auto' : 'transform',
  transform: 'translateZ(0)', // Force GPU layer
  contain: 'layout paint',    // CSS containment
};
```

| Property | Purpose |
|----------|---------|
| `will-change` | Tells browser to prepare for animation |
| `transform: translateZ(0)` | Creates new GPU layer |
| `contain: layout paint` | Isolates component from rest of DOM |

---

### 5. **AbortController for Request Cancellation** ✨
Cancel previous API request when new one starts.

```jsx
const abortControllerRef = useRef(null);

useEffect(() => {
  if (abortControllerRef.current) {
    abortControllerRef.current.abort(); // Cancel previous
  }
  abortControllerRef.current = new AbortController();
  
  // fetch with signal...
  
  return () => abortControllerRef.current.abort();
}, [query]);
```

**Why?** Prevents race conditions when user types fast.

---

### 6. **Optimized Video Loading** ✨
- Changed `preload="metadata"` → `preload="none"` (don't load until visible)
- Reset video position when scrolled away (free memory)
- Use SD quality instead of HD for grid view

```jsx
videoRef.current.currentTime = 0; // Reset when off-screen
url: item.video_files.find(v => v.quality === 'sd')?.link // Use SD quality
```

---

### 7. **Error Handling with Fallback UI** ✨
Show fallback when image/video fails to load instead of broken image.

```jsx
{hasError && (
  <div className="w-full h-[200px] bg-gray-800 flex items-center justify-center">
    Failed to load
  </div>
)}
```

---

### 8. **Smaller Image Size for Grid** ✨
Changed from `item.urls.full` to `item.urls.regular`.

| Size | Dimensions | Use Case |
|------|-----------|----------|
| `thumb` | 100px | Tiny thumbnails |
| `small` | 400px | Small grids |
| `regular` | 1080px | **Grid view (optimal)** |
| `full` | Original | Full screen view only |

---

## Summary

| Technique | What It Solves |
|-----------|---------------|
| Lazy Loading | Don't load off-screen images |
| Debouncing | Don't call API on every keystroke |
| Caching | Don't refetch same data |
| AbortController | Cancel outdated requests |
| Pagination | Don't load all results at once |
| Memoization | Prevent re-renders |
| Lenis | Smooth scrolling |
| GPU Acceleration | Smoother animations |
| CSS Containment | Isolate repaints |

Happy coding! 🚀
