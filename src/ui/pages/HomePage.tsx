
import { useEffect, useState } from 'react';
import { getProducts, type Product } from '@/infrastructure/products.service';

import { HomeNavbar } from '@/ui/components/HomeNavbar';
import { QuickFilter } from '@/ui/components/QuickFilter';
import { ProductCard } from '@/ui/components/ProductCard';
import { CartDrawer } from '@/ui/components/CartDrawer';
import { Search } from 'lucide-react';

export const HomePage = () => {
    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('TODOS');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Initial Fetch
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
            setDisplayedProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, []);

    // Filter Logic
    useEffect(() => {
        let filtered = products;

        // 1. Category Filter
        if (selectedCategory !== 'TODOS') {
            filtered = filtered.filter(p => {
                const catName = p.category?.name || (typeof p.categoria === 'string' ? p.categoria : '');
                return catName.toUpperCase() === selectedCategory;
            });
        }

        // 2. Search Filter
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(p => {
                const name = p.name || p.nombre || '';
                return name.toLowerCase().includes(term);
            });
        }

        setDisplayedProducts(filtered);
    }, [searchTerm, selectedCategory, products]);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <HomeNavbar onOpenCart={() => setIsCartOpen(true)} />

            <main className="max-w-7xl mx-auto px-4 pt-8">

                {/* Search Bar */}
                <div className="flex justify-center mb-8">
                    <div className="relative w-full max-w-xl">
                        <input
                            type="text"
                            placeholder="Buscar producto (ej: Royal Canin)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg"
                        />
                        <Search className="absolute left-4 top-3.5 text-slate-400" />
                    </div>
                </div>

                {/* Quick Filters */}
                <QuickFilter
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />

                {/* Product Grid */}
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    Resultados
                    <span className="text-sm font-normal text-slate-500">({displayedProducts.length})</span>
                </h2>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-80 bg-slate-200 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {displayedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {!loading && displayedProducts.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <p className="text-xl">No encontramos productos con esa búsqueda. 🐶❓</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory('TODOS'); }}
                            className="mt-4 text-blue-600 font-bold hover:underline"
                        >
                            Ver todos los productos
                        </button>
                    </div>
                )}

            </main>

            {/* Cart Drawer */}
            <CartDrawer isOpen={isCartOpen} onOpenChange={setIsCartOpen} />
        </div>
    );
};
