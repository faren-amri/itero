import { useEffect, useState } from 'react';
import { trello as t } from './main.jsx';
import { trello as t } from '../lib/trello.js';

export function useTrelloContext({ waitFor = ['card', 'member'] } = {}) {
  const [t, setT] = useState(null);
  const [card, setCard] = useState(null);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      let tInstance = null;
      const maxAttempts = 10;
      let attempts = 0;

      // Retry iframe context loading
      while (!tInstance && attempts < maxAttempts) {
        tInstance = window.TrelloPowerUp?.iframe?.();
        console.log("📦 tInstance:", tInstance);
        console.log("🧭 Is in iframe?", window !== window.parent);
        console.log("🌐 Current URL:", window.location.href);

        if (!tInstance) {
          await new Promise(resolve => setTimeout(resolve, 300));
          attempts++;
        }
      }

      if (!tInstance) {
        setError("⚠️ Trello iframe not available.");
        setLoading(false);
        return;
      }

      setT(tInstance);

      try {
        const fetches = [];

        if (waitFor.includes('card')) fetches.push(tInstance.card('id'));
        if (waitFor.includes('member')) fetches.push(tInstance.member('id', 'username'));

        const results = await Promise.all(fetches);

        if (waitFor.includes('card')) setCard(results[0]);
        if (waitFor.includes('member')) setMember(waitFor.includes('card') ? results[1] : results[0]);

        setIsReady(true);
      } catch (err) {
        setError(err.message || "Error loading Trello context");
      }

      setLoading(false);
    };

    init();
  }, [waitFor]);

  return { t, card, member, loading, isReady, error };
}
