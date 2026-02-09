import { useState, useEffect } from 'react';
import { LayoutDashboard, PlusCircle, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/ui/components/ui/sheet';
import { Button } from '@/ui/components/ui/button';

interface AdminSidebarProps {
    onOpenProductForm: () => void;
}

export const AdminSidebar = ({ onOpenProductForm }: AdminSidebarProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) { // md breakpoint
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Bonus: Lock scroll when mobile menu is open (though Sheet usually handles this)
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            // Important: 'unset' might conflict if shadcn Sheet also tries to manage it.
            // Radix UI Dialog usually handles this automatically. 
            // If we manually manage it, we might want to be careful.
            // However, user requested it. Let's stick to the controlled state which is the robust fix.
            // If we use Radix Sheet, it SHOULD handle scroll locking.
            // Let's add the explicit check just in case the Sheet doesn't covering some edge case of the user's "bug".
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`hidden md:flex flex-col bg-slate-900 text-white min-h-screen transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} fixed left-0 top-0 z-40`}>
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
                    {!collapsed && <span className="font-bold text-xl tracking-tight">BAS <span className="text-blue-500">Admin</span></span>}
                    <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-slate-800 rounded-lg">
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-2">
                    <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" collapsed={collapsed} active />
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={onOpenProductForm}
                        className={`w-full flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 ${collapsed ? 'justify-center' : ''}`}
                    >
                        <PlusCircle size={24} />
                        {!collapsed && <span className="font-semibold">Nuevo Producto</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar (Drawer) */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="bg-slate-900 text-white hover:bg-slate-800">
                            <Menu size={24} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="bg-slate-900 text-white border-r-slate-800 w-64 p-0">
                        <div className="h-16 flex items-center px-6 border-b border-slate-700">
                            <span className="font-bold text-xl tracking-tight">BAS <span className="text-blue-500">Admin</span></span>
                        </div>
                        <nav className="flex-1 py-6 px-3 space-y-2">
                            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" collapsed={false} active />
                        </nav>
                        <div className="p-4">
                            <button
                                onClick={() => {
                                    onOpenProductForm();
                                    setIsMobileMenuOpen(false); // Close mobile menu when opening form
                                }}
                                className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-lg"
                            >
                                <PlusCircle size={24} />
                                <span className="font-semibold">Nuevo Producto</span>
                            </button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
};

const NavItem = ({ icon, label, collapsed, active }: { icon: any, label: string, collapsed: boolean, active?: boolean }) => (
    <a href="#" className={`flex items-center gap-3 p-3 rounded-xl transition-all ${active ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'} ${collapsed ? 'justify-center' : ''}`}>
        {icon}
        {!collapsed && <span className="font-medium">{label}</span>}
    </a>
);
