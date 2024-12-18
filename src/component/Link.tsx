import {
    ComponentProps,
    forwardRef,
    MouseEvent,
    useCallback,
    useEffect,
    useState,
} from "preact/compat";
import { cn } from "../utils/mergeClassname";

const Link = forwardRef<
    HTMLAnchorElement,
    ComponentProps<"a"> & {
        prefetch?: boolean;
        shallow?: boolean;
        scroll?: boolean;
        replace?: boolean;
    }
>(
    (
        {
            prefetch = true,
            shallow = false,
            scroll = true,
            replace = false,
            className,
            onClick,
            href,
            children,
            ...props
        },
        ref,
    ) => {
        const [isPrefetched, setIsPrefetched] = useState(false);
        // Handle navigation
        const handleClick = useCallback(
            (e: MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();

                if (onClick) {
                    onClick(e);
                }

                // Store current focus state before navigation
                const previouslyFocused = document.activeElement;

                if (replace) {
                    window.history.replaceState({}, "", href as string);
                } else {
                    window.history.pushState({}, "", href as string);
                }

                if (scroll) {
                    window.scrollTo(0, 0);
                }

                // Restore focus if needed
                if (previouslyFocused instanceof HTMLElement) {
                    previouslyFocused.focus();
                }

                window.dispatchEvent(
                    new CustomEvent("navigation", {
                        detail: {
                            href,
                            shallow,
                        },
                    }),
                );
            },
            [href, onClick, replace, scroll, shallow],
        );
        useEffect(() => {
            if (prefetch && !isPrefetched) {
                const prefetchData = async () => {
                    try {
                        // Example prefetch implementation
                        // await fetch(href);
                        setIsPrefetched(true);
                    } catch (error) {
                        console.error("Error prefetching:", error);
                    }
                };

                prefetchData();
            }
        }, [href, prefetch, isPrefetched]);

        return (
            <a
                ref={ref}
                href={href}
                onClick={handleClick}
                data-prefetech={isPrefetched}
                className={cn(className)}
                {...props}
            >
                {children}
            </a>
        );
    },
);

Link.displayName = "Link";
export { Link };
