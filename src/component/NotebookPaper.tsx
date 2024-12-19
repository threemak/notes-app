import type { ComponentChildren } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

const NotebookPaper = ({ children }: { children: ComponentChildren }) => {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [punchHoles, setPunchHoles] = useState<{ id: number; top: number }[]>(
        [],
    );
    const LINE_HEIGHT = 32; // Height of each line in pixels
    const HOLES_EVERY_N_LINES = 2; // Add holes every 2 lines

    useEffect(() => {
        const calculatePunchHoles = () => {
            if (contentRef.current) {
                const contentHeight = contentRef.current.offsetHeight;
                const numberOfLines = Math.ceil(contentHeight / LINE_HEIGHT);
                const numberOfHoles = Math.ceil(
                    numberOfLines / HOLES_EVERY_N_LINES,
                );

                // Create array of hole positions
                const holes = Array.from(
                    { length: numberOfHoles },
                    (_, index) => ({
                        id: index,
                        top:
                            index * LINE_HEIGHT * HOLES_EVERY_N_LINES +
                            LINE_HEIGHT / 2,
                    }),
                );

                setPunchHoles(holes);
            }
        };

        // Calculate initially and add resize listener
        calculatePunchHoles();
        const resizeObserver = new ResizeObserver(calculatePunchHoles);
        if (contentRef.current) {
            resizeObserver.observe(contentRef.current);
        }

        return () => {
            if (contentRef.current) {
                resizeObserver.unobserve(contentRef.current);
            }
        };
    }, [LINE_HEIGHT, HOLES_EVERY_N_LINES]);
    return (
        <div className="relative w-full max-w-2xl mx-auto overflow-y-hidden">
            <div className="relative bg-white my-6 mt-12 rounded border shadow">
                {/* Red margin line */}
                <div className="absolute left-10 md:left-16 top-0 bottom-0 w-px bg-red-300" />

                {/* Punch holes container */}
                <div className="absolute left-8 top-0 bottom-0">
                    {punchHoles.map((hole) => (
                        <div
                            key={hole.id}
                            className="absolute w-4 h-4 -ml-5 md:-ml-2 rounded-full bg-gray-100 border border-gray-300 shadow-inner"
                            style={{ top: `${hole.top}px` }}
                        />
                    ))}
                </div>

                {/* Content with lined background */}
                <div
                    ref={contentRef}
                    className="relative min-h-[32rem] h-full w-full"
                    style={{
                        backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, #E5E7EB 31px, #E5E7EB ${LINE_HEIGHT}px)`,
                    }}
                >
                    <div className="pl-12 md:pl-20 py-8 pb-4 pr-2">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotebookPaper;
export { NotebookPaper };
