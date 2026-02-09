import api from './api';

export interface Category {
    id: string;
    name: string;
    description?: string;
}

export interface Product {
    id: number;
    name: string; // Reflected from backend 'name'
    description?: string;
    price?: number; // Reflected from backend 'price'
    stock?: number;
    category?: Category; // Reflected from backend 'category' relation
    image?: string;
    pricePerBag?: number;
    pricePerKilo?: number;
    // Legacy mapping support or optional fields if UI still uses them temporarily
    nombre?: string;
    precio_bolsa?: number;
    precio_kilo?: number;
    categoria?: string | Category;
    imagen?: string;
}

export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await api.get('/products/categories');
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

export const getProducts = async (): Promise<Product[]> => {
    try {
        const response = await api.get('/products');
        // Map backend response if needed, for now assume direct match but keep safety
        return response.data.map((p: any) => ({
            ...p,
            nombre: p.name, // Fallback for UI components using Spanish
            precio_bolsa: p.pricePerBag || p.price,
            precio_kilo: p.pricePerKilo,
            stock: p.stock,
            categoria: p.category?.name || 'Sin Categoría', // Fallback string for old logic
            category: p.category // Keep object for new logic
        }));
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

export const createProduct = async (product: any): Promise<Product> => {
    // Payload is already mapped in the component
    const response = await api.post('/products', product);
    return response.data;
};

export const bulkUploadProducts = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/products/bulk-upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
