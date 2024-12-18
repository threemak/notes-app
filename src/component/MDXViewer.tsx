import { useEffect, useState, useMemo } from "preact/hooks";
import { useLocation, Router, Route } from "preact-iso";
import { type CategorizedRoutes, useAllRoutes, useRoutes } from "./Router";
import { MDXProvider } from "@mdx-js/preact";
import { typedMDXComponents, typedTOCComponents } from "./MDXComponent";
import { JSX } from "preact/jsx-runtime";
import { MDXProps } from "mdx/types";
import { NotFound } from "../notfound";
import { NotebookPaper } from "./NotebookPaper";
import { ChevronLeft, ChevronRight } from "lucide-preact";
import { cn } from "../utils/mergeClassname";

// A Error component for display MDX loading error
export const ErrorComponent = ({ error }: { error: string }) => {
    return (
        <div className="text-red-500 p-4 mt-14" role="alert" aria-live="polite">
            {error}
        </div>
    );
};

export const useLoadContent = () => {
    const { url } = useLocation();
    const categorizedRoutes = useRoutes() as CategorizedRoutes;

    const [error, setError] = useState<string | null>(null);
    const [MDXContent, setMDXContent] = useState<
        (props: MDXProps) => JSX.Element | null
    >(() => null);
    const [TOCContent, setTOCContent] = useState<
        (props: MDXProps) => JSX.Element | null
    >(() => null);
    const { section, page } = useMemo(() => {
        const [section = "", page = ""] = url.split("/").filter(Boolean);
        return { section, page };
    }, [url]);

    useEffect(() => {
        const loadContent = async () => {
            setError(null);
            setMDXContent(() => null);
            setTOCContent(() => null);
            const category = section
                ? categorizedRoutes[section]
                : categorizedRoutes.home;

            if (!category) {
                setError(`Section "${section}" not found`);
                return;
            }

            let selectedRoute;

            if (Array.isArray(category)) {
                // If the category is an array, find the matching route
                selectedRoute =
                    category.find(
                        (route) => route.path === `/${section}/${page}`,
                    ) ?? category[0];
            } else {
                // If the category is a single object, check path with and without page
                const isMatch =
                    category.path === `/${section}/${page}` ||
                    (!page && category.path === `/${section}`);
                selectedRoute = isMatch ? category : null;
            }

            if (!selectedRoute) {
                setError(
                    page
                        ? `Page "${page}" not found in section "${section}"`
                        : "No content available",
                );
                return;
            }

            setMDXContent(() => selectedRoute.component);
            setTOCContent(() => selectedRoute.toc);
        };

        loadContent();
    }, [section, page, categorizedRoutes]);

    return { error, MDXContent, TOCContent };
};

// The main MDX viewer component
const MDXViewer = () => {
    const { url, path } = useLocation();
    const { MDXContent, TOCContent } = useLoadContent();
    const routes = useAllRoutes();
    const currentPath = path;
    const currentIndex = routes.findIndex(
        (route) => route.path === currentPath,
    );

    if (!MDXContent) return <div>...loading</div>;
    // Function to handle navigation
    const handleNavigation = (direction: string) => {
        // Find the current route index
        if (direction === "prev" && currentIndex > 0) {
            navigate(routes[currentIndex - 1].path);
        } else if (direction === "next" && currentIndex < routes.length - 1) {
            navigate(routes[currentIndex + 1].path);
        }
    };

    // Simple navigate function using preact-iso
    const navigate = (path: string) => {
        if (typeof window !== "undefined") {
            window.history.pushState({}, "", path);
            const navEvent = new PopStateEvent("popstate");
            window.dispatchEvent(navEvent);
        }
    };
    return (
        <MDXProvider components={typedMDXComponents}>
            <main className="flex-1 space-y-2 ml-0 md:ml-72 max-w-4xl z-5">
                <div className="flex flex-row justify-evenly items-start">
                    <NotebookPaper>
                        <Router>
                            <Route
                                path="/"
                                component={() => <MDXContent path={url} />}
                            />

                            <Route
                                path="/:page"
                                component={() => <MDXContent path={url} />}
                            />
                            <Route
                                path="/:section/:page"
                                component={() => <MDXContent path={url} />}
                            />
                            <NotFound default />
                        </Router>
                        <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => handleNavigation("prev")}
                                className={cn(
                                    "flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50",
                                    currentIndex > 0 ? "" : "invisible",
                                )}
                            >
                                <ChevronLeft className="w-5 h-5 mr-1" />
                                Previous
                            </button>

                            <button
                                onClick={() => handleNavigation("next")}
                                className={cn(
                                    "flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50",
                                    currentIndex < routes.length - 1
                                        ? ""
                                        : "invisible",
                                )}
                            >
                                Next
                                <ChevronRight className="w-5 h-5 ml-1" />
                            </button>
                        </div>
                        <div className="flex flex-col mt-4">
                            <p>Published on Date:</p>
                            <p>Updated on Date:</p>
                        </div>
                    </NotebookPaper>
                    <div className="hidden lg:block mt-24">
                        <nav className="fixed w-64">
                            <div className="absolute w-1 h-full bg-blue-100" />
                            <h2 className="pl-6">On this page</h2>
                            <TOCContent components={typedTOCComponents} />
                        </nav>
                    </div>
                </div>
            </main>
        </MDXProvider>
    );
};

export { MDXViewer };
