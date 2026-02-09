import { useCartStore } from '@/infrastructure/cart_manager';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/ui/components/ui/sheet';
import { Button } from '@/ui/components/ui/button';
import { Minus, Plus, Trash2, Send } from 'lucide-react';

// This is a wrapper that will need to be used in HomePage or global layout
// But since the trigger is in the Navbar, we'll control the state or pass the trigger
interface CartDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CartDrawer = ({ isOpen, onOpenChange }: CartDrawerProps) => {
    const { items, updateQuantity, removeItem, getTotal, generateWhatsAppLink } = useCartStore();
    const total = getTotal();

    const handleSendWhatsApp = () => {
        // Replace with the real phone number (e.g., owner's number)
        const ADMIN_PHONE = '5491112345678';
        const link = generateWhatsAppLink(ADMIN_PHONE);
        if (link) window.open(link, '_blank');
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col h-full w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                        🛒 Tu Pedido
                        <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                            {items.length} items
                        </span>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-6 -mx-6 px-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                                <span className="text-4xl">🦴</span>
                            </div>
                            <p className="text-center font-medium">El carrito está vacío.<br />¡Agregá algo rico para tu mascota!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={`${item.product.id}-${item.priceType}`} className="flex gap-4">
                                    <div className="h-20 w-20 bg-slate-100 rounded-md flex-shrink-0 overflow-hidden border border-slate-200">
                                        {(() => {
                                            const imageUrl = item.product.image || item.product.imagen;
                                            const productName = item.product.name || item.product.nombre;

                                            if (imageUrl) {
                                                // Handle potential mixed content if site is HTTPS and image is HTTP
                                                // Many browsers block HTTP images on HTTPS sites. If possible, upgrade to HTTPS.
                                                const safeUrl = imageUrl.replace(/^http:\/\//i, 'https://');
                                                return (
                                                    <img
                                                        src={safeUrl}
                                                        alt={productName}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).onerror = null;
                                                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f1f5f9/94a3b8?text=BAS';
                                                        }}
                                                    />
                                                );
                                            }
                                            return <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold">BAS</div>;
                                        })()}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-slate-800 line-clamp-2 leading-tight">
                                            {item.product.name || item.product.nombre}
                                        </h4>
                                        <p className="text-sm text-slate-500 mb-2 font-medium">
                                            Precio por {item.priceType === 'bolsa' ? 'Bolsa' : 'Kilo'}:
                                            <span className="text-blue-600 ml-1">
                                                ${(item.priceType === 'bolsa' ? (item.product.pricePerBag || item.product.precio_bolsa) : (item.product.pricePerKilo || item.product.precio_kilo))?.toLocaleString()}
                                            </span>
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.priceType, -1)}
                                                    className="p-1.5 hover:bg-slate-100 text-slate-600 disabled:opacity-50"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.priceType, 1)}
                                                    className="p-1.5 hover:bg-slate-100 text-slate-600"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.product.id, item.priceType)}
                                                className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <SheetFooter className="border-t border-slate-200 pt-6 mt-auto">
                    <div className="w-full space-y-4">
                        <div className="flex items-center justify-between text-lg font-bold text-slate-800">
                            <span>Total Estimado</span>
                            <span>${total.toLocaleString()}</span>
                        </div>

                        <Button
                            onClick={handleSendWhatsApp}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 text-lg shadow-green-200 shadow-lg"
                            disabled={items.length === 0}
                        >
                            <Send className="mr-2 h-5 w-5" /> Enviar Pedido por WhatsApp!
                        </Button>
                        <p className="text-xs text-center text-slate-400">
                            Al enviar, se abrirá WhatsApp con el detalle de tu pedido para confirmar con nosotros.
                        </p>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};
