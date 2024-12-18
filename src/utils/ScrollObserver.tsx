import { type MutableRef, useEffect, useState } from "preact/hooks";

export function ScrollObserver(
    currentRef: MutableRef<HTMLDivElement | null>,
    selectors: string,
    options: IntersectionObserverInit = {},
) {
    const [activeElement, setActiveElement] = useState("");
    useEffect(() => {
        const headings = currentRef.current?.querySelectorAll(selectors);
        const callback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                console.log(entry);
                if (entry.isIntersecting) {
                    setActiveElement(entry.target.id);
                }
            });
        };
        const headingObserver = new IntersectionObserver(callback, {
            root: null,
            rootMargin: "0px",
            threshold: 0.3,
            ...options,
        });

        headings?.forEach((heading) => {
            headingObserver.observe(heading);
        });
        return headings?.forEach((heading) =>
            headingObserver.unobserve(heading),
        );
    }, []);

    return activeElement;
}
