import { useEffect } from 'react';

const usePreloadComponents = (componentImports, delay = 2000) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      componentImports.forEach(importFn => {
        importFn().catch(err =>
          console.warn('Failed to preload component:', err)
        );
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [componentImports, delay]);
};

export default usePreloadComponents;