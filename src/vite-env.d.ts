/// <reference types="vite/client" />

declare module "*.mdx" {
    import type { Toc } from "@stefanprobst/remark-extract-toc";
    import { MDXProps } from "mdx/types";
    export const tableOfContent: Toc;
    let MDXComponent: (props: MDXProps) => JSX.Element;
    export default MDXComponent;
}
