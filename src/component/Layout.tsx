import { useState } from "preact/hooks";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const cards = Array.from({ length: 280 }, (_, i) => `Card ${i + 1}`);
    const navItems = [
        "Dashboard",
        "Profile",
        "Settings",
        "Notifications",
        "Logout",
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div class="flex flex-col h-screen relative">
            {/* Header */}
            <header class="fixed top-0 left-0 w-full bg-blue-600 text-white p-4 z-20 flex justify-between items-center">
                <span>Header (Fixed)</span>
                <button
                    class="sm:hidden bg-white text-blue-600 px-3 py-1 rounded-md"
                    onClick={toggleSidebar}
                >
                    Menu
                </button>
            </header>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    class="fixed inset-0 bg-black bg-opacity-50 z-10 sm:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            <div class="flex flex-1 pt-14 relative">
                {/* Sidebar */}
                <aside
                    class={`bg-gray-200 w-64 flex-shrink-0 overflow-y-auto transform sm:transform-none sm:sticky h-full sm:top-14 md:h-[calc(100vh-3.5rem)] fixed inset-y-0 left-0 z-20 sm:z-0 transition-transform ${
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <nav class="p-4 h-full">
                        <ul class="space-y-2">
                            {navItems.map((item, index) => (
                                <li
                                    key={index}
                                    class="text-gray-700 hover:text-blue-600 cursor-pointer"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main class="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto space-y-4">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            class="bg-white shadow-md rounded-md p-4 border border-gray-300"
                        >
                            {card}
                        </div>
                    ))}
                </main>
            </div>

            {/* Footer */}
            <footer class="bg-gray-800 text-white p-4">Footer</footer>
        </div>
    );
};

export default Layout;
//const Layout = () => {
//    const cards = Array.from({ length: 280 }, (_, i) => `Card ${i + 1}`);
//    const navItems = [
//        "Dashboard",
//        "Profile",
//        "Settings",
//        "Notifications",
//        "Logout",
//    ];
//
//    return (
//        <div class="flex flex-col h-screen">
//            {/* Header */}
//            <header class="fixed top-0 left-0 w-full bg-blue-600 text-white p-4 z-10">
//                Header (Fixed)
//            </header>
//
//            <div class="flex flex-1 pt-14">
//                {/* Sidebar */}
//                <aside class="bg-gray-200 w-64 flex-shrink-0 overflow-y-auto hidden sm:block sm:sticky sm:top-14 h-[calc(100vh-3.5rem)]">
//                    <nav class="p-4">
//                        <ul class="space-y-2">
//                            {navItems.map((item, index) => (
//                                <li
//                                    key={index}
//                                    class="text-gray-700 hover:text-blue-600 cursor-pointer"
//                                >
//                                    {item}
//                                </li>
//                            ))}
//                        </ul>
//                    </nav>
//                </aside>
//
//                {/* Main Content */}
//                <main class="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto space-y-4">
//                    {cards.map((card, index) => (
//                        <div
//                            key={index}
//                            class="bg-white shadow-md rounded-md p-4 border border-gray-300"
//                        >
//                            {card}
//                        </div>
//                    ))}
//                </main>
//            </div>
//
//            {/* Footer */}
//            <footer class="bg-gray-800 text-white p-4">Footer</footer>
//        </div>
//    );
//};
//
//export default Layout;
