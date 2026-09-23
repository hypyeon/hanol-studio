import React, { useEffect, useRef, useState } from 'react';

export function Payment({ amount, onPaymentSubmit, isSubmitting }) {
  const cardRef = useRef(null);
  const [card, setCard] = useState(null);
  const [payments, setPayments] = useState(null);

  useEffect(() => {
    async function initSquare() {
      if (!window.Square) {
        console.error('Square SDK script not loaded');
        return;
      }

      try {
        // Vite environment variables
        const appId = import.meta.env.VITE_SQ_APPLICATION_ID;
        const locationId = import.meta.env.VITE_SQ_LOCATION_ID;

        const paymentsInstance = window.Square.payments(appId, locationId);
        setPayments(paymentsInstance);

        const cardInstance = await paymentsInstance.card();
        await cardInstance.attach('#card-container');
        setCard(cardInstance);
      } catch (e) {
        console.error('Failed to initialize Square card component:', e);
      }
    }

    initSquare();

    return () => {
      if (card) {
        card.destroy();
      }
    };
  }, []);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!card) return;

    try {
      const result = await card.tokenize();
      if (result.status === 'OK') {
        onPaymentSubmit(result.token); // Passes sourceId back to parent
      } else {
        console.error('Tokenization failed', result.errors);
      }
    } catch (err) {
      console.error('Payment error', err);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-4">
      {/* Square renders styled inputs directly inside this div */}
      <div id="card-container" className="p-3 border border-hanol-charcoal/15 rounded-xl bg-white/80 min-h-22" />

      <button
        type="submit"
        disabled={isSubmitting || !card}
        className="w-full py-3.5 bg-hanol-charcoal text-white text-xs uppercase tracking-widest rounded-xl hover:bg-black transition-all cursor-pointer shadow-sm disabled:opacity-50"
      >
        {isSubmitting ? 'Processing Payment…' : `Pay $${amount}.00 Deposit & Book`}
      </button>
    </form>
  );
}