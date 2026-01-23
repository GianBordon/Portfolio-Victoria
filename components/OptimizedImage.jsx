import { useState } from 'react';

export default function OptimizedImage({ category, name, alt, className }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const basePath = `/images/optimized/${category}/${name}`;
  const srcSet = `
    ${basePath}-400w.webp 400w,
    ${basePath}-800w.webp 800w,
    ${basePath}-1600w.webp 1600w
  `;
  
  return (
    <div className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={`${basePath}-800w.webp`}
        srcSet={srcSet}
        sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1600px"
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
