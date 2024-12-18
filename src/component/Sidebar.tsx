import { useLocation } from "preact-iso";
import { CategorizedRoutes, useRoutes } from "./Router";
import { useContext, useEffect, useState } from "preact/hooks";
import { cn } from "../utils/mergeClassname";
import { ComponentProps, createContext } from "preact";
import { forwardRef } from "preact/compat";
import { useIsMobile } from "../utils/use-mobile";
type SidebarContextType = {
    open: boolean;
    toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};

const SidebarProvider = forwardRef<HTMLDivElement, ComponentProps<"div">>(
    ({ className, children, ...props }, ref) => {
        const [open, setOpen] = useState(false);
        const isMobile = useIsMobile();
        // set the overflow hidden when open the sidebar
        useEffect(() => {
            if (open && isMobile) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "auto";
            }
            // Cleanup effect
            return () => {
                document.body.style.overflow = "auto";
            };
        }, [open, isMobile]);
        const toggleSidebar = () => setOpen((prev) => !prev);
        return (
            <SidebarContext.Provider value={{ open, toggleSidebar }}>
                <div ref={ref} {...props} className={cn(className)}>
                    {open && (
                        <div
                            className={cn(
                                "fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden",
                            )}
                            onClick={toggleSidebar}
                        />
                    )}
                    {children}
                </div>
            </SidebarContext.Provider>
        );
    },
);

function Sidebar() {
    const isMobile = useIsMobile();
    const { open, toggleSidebar } = useSidebar();
    const routes = useRoutes() as CategorizedRoutes; // Get routes from context
    const { path } = useLocation();
    return (
        <div
            className={cn(
                "fixed top-0 left-0 z-20 md:z-0 w-64 h-full bg-primary-foreground md:bg-transparent md:top-14 transition-transform -translate-x-full md:translate-x-0",
                open && isMobile ? "translate-x-0" : "-translate-x-full",
            )}
            aria-label="Sidebar"
        >
            <div className="px-3 py-2 h-full md:h-[calc(100vh-3.5rem)] overflow-y-auto">
                <nav className="space-y-2">
                    {Object.entries(routes).map(([key, value]) => (
                        <div key={key} className="mb-2">
                            {Array.isArray(value) ? (
                                <div className="space-y-1">
                                    <div className="px-4 py-2 font-medium rounded-lg">
                                        {key}
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        {value.map((item, index) => (
                                            <div key={index}>
                                                <a
                                                    href={item.path}
                                                    className={cn(
                                                        "block px-4 py-1.5 rounded-lg transition-colors duration-200",
                                                        item.path === path
                                                            ? "bg-secondary"
                                                            : "hover:bg-blue-50",
                                                    )}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleSidebar();
                                                    }}
                                                >
                                                    {item.title}
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <a
                                    href={value.path}
                                    className={cn(
                                        "block px-4 py-1.5 rounded-lg transition-colors duration-200",
                                        value.path === path
                                            ? "bg-secondary"
                                            : "hover:bg-blue-50",
                                    )}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleSidebar();
                                    }}
                                >
                                    {value.title}
                                </a>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    );
}

export { SidebarProvider, useSidebar, Sidebar };
