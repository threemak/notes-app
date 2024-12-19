import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import mdx from "@mdx-js/rollup";
import remarkGfM from "remark-gfm";
import remarkMdx from "remark-mdx";
import rehypeSlug from "rehype-slug";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeAutoHeading from "rehype-autolink-headings";
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        preact({}),
        mdx({
            remarkPlugins: [remarkGfM, remarkMdx, remarkMath],
            rehypePlugins: [rehypeSlug, rehypeAutoHeading, rehypeKatex],
            jsxImportSource: "preact",
            providerImportSource: "@mdx-js/preact",
        }),
    ],
});
