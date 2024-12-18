import { AlignJustify, EllipsisVertical } from "lucide-preact";
import { useSidebar } from "./Sidebar";

import { useIsMobile } from "../utils/use-mobile";
import { useEffect, useRef, useState } from "preact/hooks";
import { useLoadContent } from "./MDXViewer";
import { typedTOCComponents } from "./MDXComponent";

export function Header() {
    const { toggleSidebar } = useSidebar();

    const isMobile = useIsMobile();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Handle click outside dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const { TOCContent } = useLoadContent();

    return (
        <header
            id="top-header"
            className="fixed w-full z-10 md:z-20 bg-primary-foreground border-gray-200 px-4 h-14 py-3 border-r-2"
        >
            <div className="flex justify-between items-center px-4">
                {/* Left Section: Logo and Navigation Links */}
                <nav className="flex items-center space-x-4">
                    {/* Sidebar Toggle Button */}
                    <button className="block md:hidden" onClick={toggleSidebar}>
                        <AlignJustify size={20} />
                    </button>
                    <h1 className="font-semibold text-2xl">
                        Algorithms Notes!
                    </h1>

                    {/* Navigation Links */}
                    <ul className="hidden md:flex space-x-4">
                        <li></li>
                    </ul>
                </nav>

                {/* Right Section with Dropdown */}
                {isMobile && (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <EllipsisVertical className="w-6 h-6" />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
                                <TOCContent components={typedTOCComponents} />
                            </div>
                        )}
                    </div>
                )}
                {/*<button
                    className="border-2 rounded-md p-1 bg-primary-foreground"
                    onClick={() =>
                        setTheme(theme === "light" ? "dark" : "light")
                    }
                >
                    {theme === "light" ? (
                        <SunMedium size={20} />
                    ) : (
                        <Moon size={20} />
                    )}
                </button>*/}
            </div>
        </header>
    );
}
