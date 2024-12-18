import { createContext } from "preact";
import { useState, useEffect, useMemo, useContext } from "preact/hooks";
import type { MDXProps } from "mdx/types";
import type { JSX } from "preact/jsx-runtime";
import type { ComponentChildren } from "preact";
import * as runtime from "preact/jsx-runtime";
import { processRawtoMDX } from "../utils/ast";

// Define types for the routes

export interface UserRoute {
    title: string;
    path: string;
    component: (props: MDXProps) => JSX.Element;
    toc: (props: MDXProps) => JSX.Element;
    slug: number;
}

export interface CategorizedRoutes {
    [category: string]: UserRoute | UserRoute[];
}

interface MDXModule {
    meta: { title?: string; slug: number };
    default: (props: MDXProps) => JSX.Element;
}
interface TOCModule {
    default: string;
}
// Create context with an undefined initial state
const RoutesContext = createContext<CategorizedRoutes | undefined>(undefined);

// RoutesProvider component that loads and provides routes
export function RoutesProvider({ children }: { children: ComponentChildren }) {
    const [routes, setRoutes] = useState<CategorizedRoutes>({});
    const [error, setError] = useState<Error | null>(null);
    useEffect(() => {
        const loadRoutes = async () => {
            try {
                // Import all MDX files eagerly
                const [mdxModules, rawModules, { evaluate }] =
                    await Promise.all([
                        import.meta.glob<true, string, MDXModule>(
                            "../notes/**/*.mdx",
                            {
                                eager: true,
                            },
                        ),
                        import.meta.glob<TOCModule>("../notes/**/*.mdx", {
                            query: "?raw",
                            eager: true,
                        }),
                        import("@mdx-js/mdx"),
                    ]);
                // Process the MDX files and create route objects
                const tempRoutes = await Promise.all(
                    Object.entries(mdxModules).map(
                        async ([filePath, module]) => {
                            const { meta, default: component } =
                                module as MDXModule;
                            const rawContent = rawModules[filePath].default;
                            const mdxToc = await processRawtoMDX(rawContent);

                            const { default: TOCcontent } = await evaluate(
                                mdxToc!,
                                {
                                    ...runtime,
                                    baseUrl: import.meta.url,
                                },
                            );

                            const parts = filePath.split("/");
                            const category =
                                parts.length > 3
                                    ? parts.slice(-2, -1)[0]
                                    : "notes";
                            const fileName = parts
                                .slice(-1)[0]
                                .replace(/\.mdx$/, "");
                            const slug = meta.slug;
                            const title =
                                meta.title || fileName.replace(/\.mdx$/, "");
                            const path =
                                meta.slug === 1
                                    ? "/"
                                    : category === "notes"
                                      ? `/${fileName}`
                                      : `/${category}/${fileName}`;

                            return {
                                title,
                                path,
                                component,
                                slug,
                                fileName,
                                category,
                                isHome: meta.slug === 1,
                                toc: TOCcontent,
                            };
                        },
                    ),
                );

                //  Categorize the routes into a CategorizedRoutes object
                const categorizedRoutes = tempRoutes.reduce<CategorizedRoutes>(
                    (acc, route) => {
                        const { fileName, isHome, category, ...routeData } =
                            route;
                        if (route.isHome) {
                            acc.home = {
                                title: route.title,
                                path: "/",
                                component: route.component,
                                slug: 1,
                                toc: route.toc,
                            };
                        } else {
                            if (category === "notes") {
                                acc[fileName] = routeData;
                            } else {
                                acc[category] = acc[category] || [];
                                (acc[category] as UserRoute[]).push(routeData);
                            }
                        }
                        return acc;
                    },
                    {},
                );

                //  Sort the routes by slug within each category
                Object.values(categorizedRoutes).forEach((routes) => {
                    if (Array.isArray(routes)) {
                        routes.sort((a, b) => a.slug - b.slug);
                    }
                });
                setRoutes(categorizedRoutes);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error("Failed to load routes"),
                );
            }
        };

        loadRoutes();
    }, []);

    if (error) return <div>Error loading routes: {error.message}</div>;

    return (
        <RoutesContext.Provider value={routes}>
            {children}
        </RoutesContext.Provider>
    );
}

// useRoutes hook to get routes based on the category name
export function useRoutes(category?: string) {
    const context = useContext(RoutesContext);
    if (context === undefined) {
        throw new Error("useRoutes must be used within a RoutesProvider");
    }

    // Memoize routes based on the provided category (or all routes if no category is passed)
    return useMemo(
        () => (category ? context[category] : context),
        [context, category],
    );
}

// useAllRoutes hook to get all routes (flattened and sorted by slug)
export function useAllRoutes() {
    const context = useContext(RoutesContext);
    if (context === undefined) {
        throw new Error("useAllRoutes must be used within a RoutesProvider");
    }

    // Flatten and sort all routes based on their slug
    return useMemo(() => {
        return Object.values(context)
            .flat()
            .sort((a, b) => a.slug - b.slug);
    }, [context]);
}
