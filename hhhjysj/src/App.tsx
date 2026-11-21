/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { MotionConfig, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { PerfumeHero } from './components/PerfumeHero';
import { CollectionSection } from './components/CollectionSection';
import { StoryAndOrderSection } from './components/StoryAndOrderSection';
import { PerfumeDetailModal } from './components/PerfumeDetailModal';
import { CartDrawer, type CartEntry } from './components/CartDrawer';
import { PERFUMES, type PerfumeItem } from './data/perfumes';

const STORAGE_KEY = 'belind_perfume_cart_v2';
const MAX_QTY = 10;

/** Never trust storage: rebuild entries from catalog data (prices/names can't be tampered with). */
function loadCart(): CartEntry[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(raw)) return [];
    const out: CartEntry[] = [];
    for (const row of raw.slice(0, PERFUMES.length)) {
      const id = typeof row?.id === 'string' ? row.id : '';
      const qty = Number(row?.q);
      const perfume = PERFUMES.find((p) => p.id === id);
      if (perfume && Number.isInteger(qty) && qty > 0 && !out.some((e) => e.perfume.id === id)) {
        out.push({ perfume, quantity: Math.min(qty, MAX_QTY) });
      }
    }
    return out;
  } catch {
    return [];
  }
}

export default function App() {
  const [cart, setCart] = useState<CartEntry[]>(loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState<PerfumeItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cart.map((e) => ({ id: e.perfume.id, q: e.quantity })))
      );
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, [cart]);

  const handleAddToCart = (perfume: PerfumeItem, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((entry) => entry.perfume.id === perfume.id);
      if (existing) {
        return prev.map((entry) =>
          entry.perfume.id === perfume.id
            ? { ...entry, quantity: Math.min(MAX_QTY, entry.quantity + quantity) }
            : entry
        );
      }
      return [...prev, { perfume, quantity }];
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((entry) =>
          entry.perfume.id === id
            ? { ...entry, quantity: Math.min(MAX_QTY, entry.quantity + delta) }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((entry) => entry.perfume.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#FAF7F2] text-stone-900">
        <Navbar cartCount={totalCount} onOpenCart={() => setCartOpen(true)} />

        <main>
          <PerfumeHero
            onSelectPerfume={(item) => setSelectedPerfume(item)}
            onAddToCart={(item) => handleAddToCart(item, 1)}
          />

          <CollectionSection
            onSelectPerfume={(item) => setSelectedPerfume(item)}
            onAddToCart={(item) => handleAddToCart(item, 1)}
          />

          <StoryAndOrderSection />
        </main>

        <AnimatePresence>
          {selectedPerfume && (
            <PerfumeDetailModal
              key={selectedPerfume.id}
              perfume={selectedPerfume}
              onClose={() => setSelectedPerfume(null)}
              onAddToCart={handleAddToCart}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {cartOpen && (
            <CartDrawer
              key="cart-drawer"
              items={cart}
              onClose={() => setCartOpen(false)}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
            />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
