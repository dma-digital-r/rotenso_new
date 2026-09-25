import Markdoc, { type Node, type Schema } from "@markdoc/markdoc";
import React from "react";

// Headings keep the anchors set in the CMS ({% #co-to-cwu %}); headings without one get an id
// made from their text, so the table of contents can link to every section.
const heading: Schema = {
  children: ["inline"],
  attributes: { id: { type: String }, level: { type: Number, required: true, default: 2 } },
  transform(node, config) {
    const { level, id } = node.attributes;
    return new Markdoc.Tag(`h${level}`, id ? { id } : {}, node.transformChildren(config));
  },
};

// External links open in a new tab; links inside the site stay in the same tab.
const link: Schema = {
  children: ["strong", "em", "s", "code", "text", "tag", "image"],
  attributes: { href: { type: String, required: true }, title: { type: String } },
  transform(node, config) {
    const { href, title } = node.attributes;
    const external = /^https?:\/\//.test(href);
    return new Markdoc.Tag("a", { href, title, ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}) }, node.transformChildren(config));
  },
};

const image: Schema = {
  attributes: { src: { type: String, required: true }, alt: { type: String }, title: { type: String } },
  transform(node) {
    const { src, alt, title } = node.attributes;
    return new Markdoc.Tag("img", { src, alt: alt ?? "", title, loading: "lazy", decoding: "async" });
  },
};

const config = { nodes: { heading, link, image } };
const render = (node: Node) => Markdoc.renderers.react(Markdoc.transform(node, config), React);

const textOf = (node: Node) =>
  [...node.walk()]
    .filter((n) => n.type === "text")
    .map((n) => String(n.attributes.content))
    .join("")
    .trim();

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

const LEARN = /^z tego artykułu dowiesz się/i;

export type TocItem = { id: string; text: string };

/**
 * Splits an article into the parts of the Figma template (MMP-12000 / Artykuły v.05):
 * the "Z tego artykułu dowiesz się" box (a paragraph with that text followed by a list), the
 * table of contents (section headings) and the body.
 */
export function prepareArticle(document: Node) {
  const children = [...document.children];
  let learn: { title: string; items: React.ReactNode[] } | null = null;
  const at = children.findIndex((n) => n.type === "paragraph" && LEARN.test(textOf(n)));
  if (at >= 0 && children[at + 1]?.type === "list") {
    const list = children[at + 1];
    learn = {
      title: textOf(children[at]),
      // Each list item is rendered on its own (its inline content only, without list markup).
      items: list.children.map((item) => {
        const inline = item.children.flatMap((c) => (c.type === "inline" ? c.children : c.type === "paragraph" ? c.children.flatMap((x) => x.children) : [c]));
        return render(new Markdoc.Ast.Node("inline", {}, inline));
      }),
    };
    children.splice(at, 2);
  }

  const toc: TocItem[] = [];
  const used = new Set<string>();
  // Sections are level-2 headings; articles written only with level-3 headings use those.
  const level = children.some((n) => n.type === "heading" && n.attributes.level === 2) ? 2 : 3;
  for (const n of children) {
    if (n.type !== "heading" || n.attributes.level !== level) continue;
    const text = textOf(n);
    let id = String(n.attributes.id || slugify(text) || `sekcja-${toc.length + 1}`);
    while (used.has(id)) id = `${id}-2`;
    used.add(id);
    n.attributes.id = id;
    toc.push({ id, text });
  }

  const body = new Markdoc.Ast.Node("document", document.attributes, children);
  return { learn, toc, body: render(body) };
}

export function ArticleBody({ children }: { children: React.ReactNode }) {
  return <div className="guide-body">{children}</div>;
}
