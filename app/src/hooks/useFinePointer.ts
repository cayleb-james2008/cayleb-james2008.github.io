import { useEffect, useState } from 'react';

// Local to this starter: hover effects run only where hover exists (references/motion.md section 4).
// A tap on a phone fires mouseenter and would leave a light or a lean stuck on the part.
const QUERY = '(hover: hover) and (pointer: fine)';

export function useFinePointer(): boolean {
  const [fine, setFine] = useState(() => (typeof matchMedia === 'function' ? matchMedia(QUERY).matches : false));
  useEffect(() => {
    const mq = matchMedia(QUERY);
    const on = () => setFine(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return fine;
}
