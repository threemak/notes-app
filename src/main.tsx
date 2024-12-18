import "./global.css";
import * as preact from "preact";
import * as hooks from "preact/hooks";
import {
    prerender as ssr,
    hydrate,
    ErrorBoundary,
    LocationProvider,
} from "preact-iso";
import { Header } from "./component/Header.tsx";
import { RoutesProvider } from "./component/Router.tsx";
import { MDXViewer } from "./component/MDXViewer.tsx";
import { Sidebar, SidebarProvider } from "./component/Sidebar.tsx";

// allow users to play with preact in the browser developer console
globalThis.preact = { ...preact, ...hooks };

function App({}: PrerenderData) {
    const [_fontLoaded, setFontLoaded] = hooks.useState(false);
    hooks.useEffect(() => {
        // Check if the font is already loaded
        document.fonts.ready.then(() => {
            setFontLoaded(true);
        });
        // Fallback timer in case font loading takes too long
        const timeoutId = setTimeout(() => {
            setFontLoaded(true);
        }, 3000); // 3 second timeout

        return () => clearTimeout(timeoutId);
    }, []);
    return (
        <ErrorBoundary>
            <LocationProvider>
                <SidebarProvider>
                    <RoutesProvider>
                        <Header />
                        <div className="flex relative min-h-screen">
                            <Sidebar />
                            <MDXViewer />
                        </div>
                    </RoutesProvider>
                </SidebarProvider>
            </LocationProvider>
        </ErrorBoundary>
    );
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
    hydrate(<App />, document.getElementById("app") as HTMLElement);
}
interface PrerenderData {
    appVersion?: string;
}
export async function prerender(data: PrerenderData) {
    const { html, links } = await ssr(<App {...data} />);

    return {
        html,
        links,
    };
}
