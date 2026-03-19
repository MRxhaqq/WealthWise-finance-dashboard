import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  // useState with a function as initial value
  // The function only runs ONCE on mount — not on every render
  // This is called "lazy initialisation"
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      // If something exists in localStorage parse and return it
      // Otherwise return the initialValue we passed in
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage:", error);
      return initialValue;
    }
  });

  // Every time storedValue changes save it to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
