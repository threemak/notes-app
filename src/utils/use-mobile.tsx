import { useEffect, useState } from "preact/hooks";

// Define the breakpoint as a constant
const MOBILE_BREAKPOINT = 768; // Customize this value as needed

export function useIsMobile(): boolean {
    // Initialize with undefined and handle the server-side rendering case
    const [isMobile, setIsMobile] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        return window.innerWidth < MOBILE_BREAKPOINT;
    });

    useEffect(() => {
        // Create the media query string
        const mediaQuery = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;
        const mediaQueryList = window.matchMedia(mediaQuery);

        // Handler function for media query changes
        const updateIsMobile = (
            event: MediaQueryListEvent | MediaQueryList,
        ) => {
            setIsMobile(event.matches);
        };

        // Initial check
        updateIsMobile(mediaQueryList);

        // Add event listener using the correct method based on browser support
        mediaQueryList.addEventListener("change", updateIsMobile);

        // Cleanup function
        return () => {
            mediaQueryList.removeEventListener("change", updateIsMobile);
        };
    }, []);

    return isMobile;
}

// Example usage:
/*
function MyComponent() {
  const isMobile = useIsMobile();
  
  return (
    <div>
      {isMobile ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  );
}
*/
