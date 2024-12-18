// Custom remark plugin to extract TOC
import { unified } from "unified";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import { toc } from "mdast-util-toc";
import { toMarkdown } from "mdast-util-to-markdown";

export async function processRawtoMDX(
    rawContent: string,
): Promise<string | undefined> {
    //const [
    //    { unified: unified },
    //    { default: remarkParse },
    //    { default: mdx },
    //    { visit },
    //    { toc },
    //    { toMarkdown },
    //] = await Promise.all([
    //    import("unified"),
    //    import("remark-parse"),
    //    import("remark-mdx"),
    //    import("unist-util-visit"),
    //    import("mdast-util-toc"),
    //    import("mdast-util-to-markdown"),
    //]);

    const processor = unified().use(remarkParse).use(remarkMdx);
    try {
        const mdxContext = processor.parse(rawContent);
        let firstH1Removed = false;
        // Preprocess the AST to remove the first H1 node
        visit(mdxContext, "heading", (node, index, parent) => {
            if (node.depth === 1 && !firstH1Removed && parent?.children) {
                // Remove the first H1 node
                parent.children.splice(index!, 1);
                firstH1Removed = true; // Set the flag to true after removing the first H1
            }
        });
        const tableofContents = toc(mdxContext, {
            tight: true,
        });
        if (!tableofContents.map) return undefined;

        const markdown = toMarkdown(tableofContents.map);
        return markdown;
    } catch (error) {
        console.error(`Error processing raw content:`, error);
        return undefined;
    }
}
