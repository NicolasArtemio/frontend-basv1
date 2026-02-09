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
            <div className="mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 pb-2">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-10 w-24 bg-slate-200 animate-pulse rounded-full flex-shrink-0"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 md:gap-3 md:flex-wrap md:justify-center pb-2 md:pb-0">
                {allCategories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.id)}
                        className={`
                            relative flex-shrink-0 rounded-full md:rounded-xl 
                            px-4 py-2 md:px-5 md:py-4
                            flex items-center md:flex-col gap-2 md:gap-1
                            transition-all duration-200 border border-transparent
                            ${selectedCategory === cat.id
                                ? `ring-2 ${cat.ringColor} ring-offset-1 shadow-md bg-white border-slate-200`
                                : `${cat.color} hover:shadow-sm opacity-90 hover:opacity-100`
                            }
                        `}
                    >
                        <span className="text-xl md:text-2xl">{cat.emoji}</span>
                        <span className={`font-semibold text-sm whitespace-nowrap ${selectedCategory === cat.id ? 'text-blue-700' : 'text-slate-700'}`}>
                            {cat.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
