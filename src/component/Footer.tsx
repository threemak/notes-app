export function Footer() {
    return (
        <footer className="bg-gray-800 text-white static z-20 py-4">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Left Section */}
                    <div className="text-center md:text-left mb-4 md:mb-0">
                        <h2 className="text-lg font-semibold">My Website</h2>
                        <p className="text-sm text-gray-400">
                            &copy; {new Date().getFullYear()} All rights
                            reserved.
                        </p>
                    </div>

                    {/* Center Section */}
                    <div className="mb-4 md:mb-0">
                        <ul className="flex space-x-4">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    About
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Right Section */}
                    <div className="text-center md:text-right">
                        <ul className="flex space-x-4 justify-center">
                            <li>
                                <a
                                    href="#"
                                    aria-label="Facebook"
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    <i className="fab fa-facebook"></i>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    aria-label="Twitter"
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    <i className="fab fa-twitter"></i>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    aria-label="Instagram"
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    <i className="fab fa-instagram"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
