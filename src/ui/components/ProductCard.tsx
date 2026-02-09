import type { Product } from '@/infrastructure/products.service';
import { useCartStore } from '@/infrastructure/cart_manager';
import { ShoppingBag, Scale } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const addItem = useCartStore((state) => state.addItem);
    const [priceType, setPriceType] = useState<'bolsa' | 'kilo'>(
        product.precio_bolsa ? 'bolsa' : 'kilo'
    );

    const handleAddToCart = () => {
        addItem(product, priceType);
    };

    const currentPrice = priceType === 'bolsa' ? product.precio_bolsa : product.precio_kilo;
    const hasBothOptions = product.precio_bolsa && product.precio_kilo;

    // Colores de categoría
    const getCategoryColor = (cat: string) => {
        switch (cat.toUpperCase()) {
            case 'PERRO': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'GATO': return 'bg-orange-100 text-orange-800 border-orange-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const categoryName = product.category?.name || (typeof product.categoria === 'string' ? product.categoria : 'Sin Categoría');

    return (
        <div className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
            {/* Image Placeholder */}
            <div className="h-48 bg-slate-50 flex items-center justify-center relative overflow-hidden">
                {product.image || product.imagen ? (
                    <img src={product.image || product.imagen} alt={product.name || product.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <span className="text-slate-300 font-bold text-4xl select-none opacity-20">BAS</span>
                )}
                <div className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full border ${getCategoryColor(categoryName)}`}>
                    {categoryName}
                </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-slate-800 text-lg mb-1 leading-tight line-clamp-2">
                    {product.nombre}
                </h3>

                <div className="flex-1"></div> {/* Spacer to push bottom content */}

                {/* Price Selector */}
                <div className="mt-4 mb-4">
                    {hasBothOptions ? (
                        <div className="flex p-1 bg-slate-100 rounded-lg">
                            <button
                                onClick={() => setPriceType('bolsa')}
                                className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-md transition-all ${priceType === 'bolsa' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <ShoppingBag size={14} /> Bolsa
                            </button>
                            <button
                                onClick={() => setPriceType('kilo')}
                                className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-md transition-all ${priceType === 'kilo' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <Scale size={14} /> Kilo
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium bg-slate-50 py-1.5 px-3 rounded-md w-fit">
                            {priceType === 'bolsa' ? <ShoppingBag size={14} /> : <Scale size={14} />}
                            Precio por {priceType === 'bolsa' ? 'Bolsa' : 'Kilo'}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-slate-500">Precio</span>
                    <span className="text-2xl font-bold text-blue-700">
                        ${currentPrice?.toLocaleString()}
                    </span>
                </div>

                <button
                    onClick={handleAddToCart}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    Sumar al pedido
                </button>
            </div>
        </div>
    );
};
