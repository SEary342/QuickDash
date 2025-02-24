import { useState, useEffect } from "react";

// TODO convert the state to handle JSON conversion to the applicable types
// Can this be done with Generics?
const useLocalStorage = (key: string, initialState: string) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);
  return [value, setValue] as const;
};

export default useLocalStorage;

