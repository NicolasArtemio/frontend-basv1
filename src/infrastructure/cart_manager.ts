import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from './products.service';

export type PriceType = 'bolsa' | 'kilo';

export interface CartItem {
    product: Product;
    quantity: number;
    priceType: PriceType;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product, priceType: PriceType) => void;
    removeItem: (productId: number, priceType: PriceType) => void;
    updateQuantity: (productId: number, priceType: PriceType, delta: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    generateWhatsAppLink: (phoneNumber: string) => string;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product, priceType) => {
                set((state) => {
                    const existingItem = state.items.find(
                        (item) => item.product.id === product.id && item.priceType === priceType
                    );

                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.product.id === product.id && item.priceType === priceType
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        };
                    } else {
                        return {
                            items: [...state.items, { product, quantity: 1, priceType }],
                        };
                    }
                });
            },

            removeItem: (productId, priceType) => {
                set((state) => ({
                    items: state.items.filter(
                        (item) => !(item.product.id === productId && item.priceType === priceType)
                    ),
                }));
            },

            updateQuantity: (productId, priceType, delta) => {
                set((state) => ({
                    items: state.items
                        .map((item) => {
                            if (item.product.id === productId && item.priceType === priceType) {
                                const newQuantity = Math.max(1, item.quantity + delta);
                                return { ...item, quantity: newQuantity };
                            }
                            return item;
                        })
                }));
            },

            clearCart: () => set({ items: [] }),

            getTotal: () => {
                const { items } = get();
                return items.reduce((total, item) => {
                    const price = item.priceType === 'bolsa'
                        ? item.product.precio_bolsa
                        : item.product.precio_kilo;
                    return total + (price || 0) * item.quantity;
                }, 0);
            },

            generateWhatsAppLink: (phoneNumber) => {
                const { items, getTotal } = get();
                if (items.length === 0) return '';

                let message = `Hola BAS Pet Shop! 🐾\nQuiero realizar el siguiente pedido:\n\n`;

                items.forEach((item) => {
                    const price = item.priceType === 'bolsa'
                        ? item.product.precio_bolsa
                        : item.product.precio_kilo;
                    const typeLabel = item.priceType === 'bolsa' ? 'Bolsa' : 'Kilo';
                    const subtotal = (price || 0) * item.quantity;

                    message += `▪ ${item.quantity}x ${item.product.nombre} (${typeLabel}) - $${subtotal}\n`;
                });

                message += `\n💰 *Total Estimado: $${getTotal()}*`;
                message += `\n\nQuedo a la espera de la confirmación. Gracias!`;

                const encodedMessage = encodeURIComponent(message);
                return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            }
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
