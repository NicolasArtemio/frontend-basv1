import { Edit2, Trash2, Search, Filter } from 'lucide-react';
import { type Product } from '@/infrastructure/products.service';

interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
}

export const ProductTable = ({ products, onEdit, onDelete }: ProductTableProps) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Header / Filters */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 hover:bg-slate-50">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Producto</th>
                            <th className="px-6 py-4">Categoría</th>
                            <th className="px-6 py-4 text-right">Precio</th>
                            <th className="px-6 py-4 text-center">Stock</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    No hay productos cargados todavía. 📦
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-200 flex-shrink-0 overflow-hidden">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-bold">N/A</div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900 dark:text-white">{product.name}</div>
                                                {product.description && <div className="text-xs text-slate-500 truncate max-w-[200px]">{product.description}</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {(() => {
                                            const catName = product.category?.name || (typeof product.categoria === 'string' ? product.categoria : '');
                                            const normalizedCat = catName.toUpperCase();

                                            let badgeColor = 'bg-slate-100 text-slate-800 border-slate-200';
                                            if (normalizedCat.includes('PERRO')) badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
                                            else if (normalizedCat.includes('GATO')) badgeColor = 'bg-orange-100 text-orange-800 border-orange-200';
                                            else if (normalizedCat.includes('AVES')) badgeColor = 'bg-green-100 text-green-800 border-green-200';
                                            else if (normalizedCat.includes('ACCESORIOS') || normalizedCat.includes('OTROS')) badgeColor = 'bg-purple-100 text-purple-800 border-purple-200';

                                            return (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeColor}`}>
                                                    {catName || 'Sin Categoría'}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-700 dark:text-slate-300">
                                        <div>${product.price} <span className="text-xs text-slate-400 font-normal">/bolsa</span></div>
                                        {/* precio_kilo is currently not in the confirmed interface, hiding for safety or until mapped */}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`font-bold ${product.stock && product.stock < 5 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => onEdit(product)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => onDelete(product.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
