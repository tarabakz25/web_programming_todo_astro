import { useEffect, useState } from 'react';

export function useLocalStorage<t>(key: string, init: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return init;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : init;
    } catch (error) {
      return init;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
