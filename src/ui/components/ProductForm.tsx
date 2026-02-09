import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { createProduct, getCategories, type Category } from '@/infrastructure/products.service';
import { Package, DollarSign, Tag, Archive, Loader2, Plus } from 'lucide-react';

const productSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    description: z.string().optional(),
    price: z.number().min(0.01, 'El precio debe ser mayor a 0'),
    pricePerBag: z.number().min(0, 'El precio por bolsa no puede ser negativo').optional(),
    pricePerKilo: z.number().min(0, 'El precio por kilo no puede ser negativo').optional().nullable(),
    stock: z.number().min(0, 'El stock no puede ser negativo'),
    categoryId: z.string().min(1, 'La categoría es obligatoria'), // UUID
    image: z.string().url('Debe ser una URL válida').optional().or(z.literal('')).nullable(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export const ProductForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsCategoriesLoading(true);
            try {
                const data = await getCategories();
                console.log('[ProductForm] Categorías recibidas:', data);
                if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    console.error('[ProductForm] La respuesta de categorías no es un array:', data);
                    setCategories([]);
                }
            } catch (error) {
                console.error('[ProductForm] Error fetching categories:', error);
                setCategories([]);
            } finally {
                setIsCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            pricePerBag: 0,
            pricePerKilo: null,
            stock: 0,
            categoryId: '',
            image: '',
        },
    });

    const onSubmit = async (data: ProductFormValues) => {
        setIsLoading(true);
        try {
            // Clean payload: Remove empty strings and handle nulls
            const payload = {
                ...data,
                description: data.description || undefined,
                pricePerKilo: data.pricePerKilo !== null ? data.pricePerKilo : undefined,
                image: data.image || undefined,
            };

            console.log('[ProductForm] Enviando payload:', payload);
            await createProduct(payload);
            toast.success('Producto creado exitosamente 🚀');
            reset();
        } catch (error: any) {
            console.error('Error creating product:', error);
            const errorMessage = error.response?.data?.message || 'Hubo un error al crear el producto';
            toast.error(`Error: ${errorMessage} ❌`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 max-w-2xl mx-auto transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400">
                    <Plus size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Nuevo Producto</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Completá los datos para cargar un producto al catálogo</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Nombre */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Package size={16} /> Nombre del Producto
                    </label>
                    <input
                        {...register('name')}
                        placeholder="Ej: Royal Canin Cachorro 15kg"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 dark:border-slate-600'} bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
                </div>

                {/* Categoría y Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Tag size={16} /> Categoría
                        </label>
                        <div className="relative">
                            <select
                                {...register('categoryId')}
                                disabled={isCategoriesLoading}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="">
                                    {isCategoriesLoading ? 'Cargando categorías...' : 'Seleccionar Categoría...'}
                                </option>
                                {!isCategoriesLoading && categories.length === 0 && (
                                    <option value="" disabled>No se encontraron categorías</option>
                                )}
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {isCategoriesLoading && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Loader2 className="animate-spin text-slate-400" size={16} />
                                </div>
                            )}
                        </div>
                        {errors.categoryId && <p className="text-red-500 text-xs mt-1 font-medium">{errors.categoryId.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Archive size={16} /> Stock Inicial
                        </label>
                        <input
                            type="number"
                            {...register('stock', { valueAsNumber: true })}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.stock ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 dark:border-slate-600'} bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                        />
                        {errors.stock && <p className="text-red-500 text-xs mt-1 font-medium">{errors.stock.message}</p>}
                    </div>
                </div>

                {/* Precios principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <DollarSign size={16} /> Precio General ($)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register('price', { valueAsNumber: true })}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.price ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 dark:border-slate-600'} bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                        />
                        {errors.price && <p className="text-red-500 text-xs mt-1 font-medium">{errors.price.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <DollarSign size={16} /> Precio x Bolsa ($)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register('pricePerBag', { valueAsNumber: true })}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.pricePerBag ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 dark:border-slate-600'} bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                        />
                        {errors.pricePerBag && <p className="text-red-500 text-xs mt-1 font-medium">{errors.pricePerBag.message}</p>}
                    </div>
                </div>

                {/* Precio por kilo y URL Imagen */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <DollarSign size={16} /> Precio x Kilo ($)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register('pricePerKilo', { valueAsNumber: true })}
                            placeholder="Opcional"
                            className={`w-full px-4 py-3 rounded-xl border ${errors.pricePerKilo ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 dark:border-slate-600'} bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                        />
                        {errors.pricePerKilo && <p className="text-red-500 text-xs mt-1 font-medium">{errors.pricePerKilo.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">URL de la Imagen</label>
                        <input
                            {...register('image')}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            className={`w-full px-4 py-3 rounded-xl border ${errors.image ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 dark:border-slate-600'} bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                        />
                        {errors.image && <p className="text-red-500 text-xs mt-1 font-medium">{errors.image.message}</p>}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3
            ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30 active:scale-[0.98]'}`}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Enviando...
                        </>
                    ) : (
                        'Guardar Producto'
                    )}
                </button>
            </form>
        </div>
    );
};
