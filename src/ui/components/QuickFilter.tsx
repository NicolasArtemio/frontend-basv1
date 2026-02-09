import { useState, useEffect } from 'react';
import { getCategories, type Category } from '@/infrastructure/products.service';

interface QuickFilterProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export const QuickFilter = ({ selectedCategory, onSelectCategory }: QuickFilterProps) => {
    const [dbCategories, setDbCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const data = await getCategories();
            setDbCategories(data);
            setIsLoading(false);
        };
        fetch();
    }, []);

    const getCategoryConfig = (name: string) => {
        const normalized = name.toUpperCase();
        if (normalized.includes('PERRO')) return { emoji: '🐶', color: 'bg-blue-100', text: 'text-blue-700', ring: 'ring-blue-600' };
        if (normalized.includes('GATO')) return { emoji: '🐱', color: 'bg-orange-100', text: 'text-orange-700', ring: 'ring-orange-600' };
        if (normalized.includes('ACCESORIOS')) return { emoji: '🎾', color: 'bg-purple-100', text: 'text-purple-700', ring: 'ring-purple-600' };
        if (normalized.includes('HIGIENE')) return { emoji: '🧴', color: 'bg-green-100', text: 'text-green-700', ring: 'ring-green-600' };
        return { emoji: '🐹', color: 'bg-slate-100', text: 'text-slate-700', ring: 'ring-slate-600' };
    };

    const allCategories = [
        { id: 'TODOS', label: 'Ver Todo', emoji: '🦴', color: 'bg-slate-100', textColor: 'text-slate-700', ringColor: 'ring-blue-600' },
        ...dbCategories.map(cat => {
            const config = getCategoryConfig(cat.name);
            return {
                id: cat.name.toUpperCase(),
                label: cat.name,
                emoji: config.emoji,
                color: config.color,
                textColor: config.text,
                ringColor: config.ring
            };
        })
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-xl"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-wrap justify-center gap-4 mb-8">
            {allCategories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`
                        relative overflow-hidden rounded-xl p-4 h-24 w-full sm:w-40 lg:w-44 flex flex-col items-center justify-center gap-2 transition-all duration-300 border border-transparent
                        ${selectedCategory === cat.id
                            ? `ring-2 ${cat.ringColor} ring-offset-2 shadow-md scale-[1.02] bg-white border-slate-100`
                            : `${cat.color} hover:shadow-sm hover:scale-[1.01] opacity-90 hover:opacity-100`
                        }
                    `}
                >
                    <span className="text-3xl">{cat.emoji}</span>
                    <span className={`font-bold text-sm ${selectedCategory === cat.id ? 'text-blue-700' : 'text-slate-700'}`}>
                        {cat.label}
                    </span>

                    {/* Active Indicator */}
                    {selectedCategory === cat.id && (
                        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse ${cat.id === 'TODOS' ? 'bg-blue-600' : 'bg-slate-800'}`} />
                    )}
                </button>
            ))}
        </div>
    );
};
