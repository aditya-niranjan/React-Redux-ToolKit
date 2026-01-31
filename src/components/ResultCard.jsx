import React, { useState, useRef, useEffect, useCallback, memo } from 'react'

// Memoized component - only re-renders when props change
const ResultCard = memo(({ item, idx }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const cardRef = useRef(null);
  const videoRef = useRef(null);

  // Memoized callbacks to prevent unnecessary re-renders
  const handleLoad = useCallback(() => setIsLoaded(true), []);
  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true);
  }, []);
  const handleVideoReady = useCallback(() => {
    setVideoReady(true);
    setIsLoaded(true);
  }, []);

  // Handle hover - start loading video
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (videoRef.current && videoReady) {
      videoRef.current.play().catch(() => {});
    }
  }, [videoReady]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        
        // Pause video when scrolled away
        if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: '100px 0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // GPU acceleration styles
  const cardStyle = {
    willChange: isVisible ? 'auto' : 'transform',
    transform: 'translateZ(0)', // Force GPU layer
    contain: 'layout paint', // CSS containment for better performance
  };

  return (
    <div 
      ref={cardRef} 
      className="relative overflow-hidden rounded-lg cursor-pointer"
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Skeleton placeholder */}
      {!isLoaded && (
        <div className="w-full h-[350px] bg-gray-700 rounded-lg animate-pulse" />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="w-full h-[350px] bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
          Failed to load
        </div>
      )}

      {!hasError && item.type === 'photo' ? (
        <img
          className={`w-full h-[350px] object-cover rounded-lg transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0 absolute top-0 left-0'
          }`}
          src={isVisible ? item.src : undefined}
          alt={item.alt_description || 'Photo'}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : !hasError ? (
        <>
          {/* Poster image - shows immediately */}
          <img
            className={`w-full h-[350px] object-cover rounded-lg transition-opacity duration-300 ${
              isLoaded && !isHovered ? 'opacity-100' : isHovered && videoReady ? 'opacity-0' : 'opacity-100'
            }`}
            src={isVisible ? item.poster : undefined}
            alt={item.alt_description || 'Video thumbnail'}
            loading="lazy"
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
          />
          {/* Video - loads on hover */}
          {isHovered && (
            <video
              ref={videoRef}
              className={`absolute top-0 left-0 w-full h-[350px] object-cover rounded-lg transition-opacity duration-300 ${
                videoReady ? 'opacity-100' : 'opacity-0'
              }`}
              src={item.url}
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              onCanPlay={handleVideoReady}
              onError={handleError}
            />
          )}
          {/* Play icon overlay */}
          {!isHovered && isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 rounded-full p-3">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          )}
        </>
      ) : null}

      {/* Creator info overlay at bottom */}
      {isLoaded && !hasError && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 rounded-b-lg">
          <a 
            href={item.user_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white text-sm font-medium hover:underline flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            {item.title || item.alt_description || 'Unknown'}
          </a>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if item changes
  return prevProps.item.id === nextProps.item.id;
})

export default ResultCard