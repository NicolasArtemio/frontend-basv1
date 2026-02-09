
import { ProductForm } from './ProductForm';

import { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { ProductTable } from './ProductTable';
import { BulkUploadModal } from './BulkUploadModal';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/ui/components/ui/sheet';
import { getProducts, type Product } from '@/infrastructure/products.service';
import { FileUp, Loader2, ArrowLeft, X } from 'lucide-react';
import { toast } from 'sonner';

export const AdminPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

    const fetchProducts = async (showLoading = false) => {
        if (showLoading) setIsLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            toast.error('Error al cargar productos');
        } finally {
            if (showLoading) setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(true);
    }, []);

    const handleEdit = (product: Product) => {
        toast.info(`Editando ${product.nombre} (Próximamente)`);
        // TODO: Implement Edit Logic
    };

    const handleDelete = (_id: number) => {
        toast.error('Función de eliminar pendiente de implementación segura.');
    };



    return (
        <div className="flex bg-slate-50 dark:bg-slate-900 min-h-screen font-sans">
            {/* Sidebar */}
            <AdminSidebar onOpenProductForm={() => setIsProductFormOpen(true)} />

            {/* Main Content */}
            <main className="flex-1 md:ml-[5rem] lg:md:ml-20 transition-all duration-300 p-4 sm:p-8 w-full max-w-[100vw] overflow-x-hidden">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header Section */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Gestión de Catálogo
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">
                                Administrá tu inventario, precios y stock en tiempo real.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsBulkUploadOpen(true)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                            >
                                <FileUp size={18} />
                                <span className="hidden sm:inline">Importar CSV</span>
                            </button>
                        </div>
                    </header>

                    {/* Stats or Highlights could go here */}

                    {/* Product Table */}
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
                            <p>Cargando inventario...</p>
                        </div>
                    ) : (
                        <ProductTable
                            products={products}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </main>

            {/* Product Form Drawer */}
            <Sheet open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
                <SheetContent showCloseButton={false} className="w-full sm:max-w-xl overflow-y-auto bg-slate-50 dark:bg-slate-900 p-0 border-l border-slate-200 dark:border-slate-800">
                    <SheetHeader className="px-4 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsProductFormOpen(false)}
                                    className="p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    aria-label="Volver"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <SheetTitle className="text-xl font-bold">Nuevo Producto</SheetTitle>
                            </div>
                            <button
                                onClick={() => setIsProductFormOpen(false)}
                                className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                aria-label="Cerrar"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </SheetHeader>
                    <div className="p-6">
                        {/* We reuse the form but might need to adjust its padding/containers if it expects full page. 
                            Let's wrap it nicely. */}
                        <ProductForm />
                        {/* Note: ProductForm currently handles submission and toasts. 
                            Ideally, we should pass an 'onSuccess' prop to close this sheet. 
                            For now, manual close or refactor required. */}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Bulk Upload Modal */}
            <BulkUploadModal
                isOpen={isBulkUploadOpen}
                onClose={() => setIsBulkUploadOpen(false)}
                onSuccess={() => fetchProducts(true)}
            />
        </div>
    );
};
