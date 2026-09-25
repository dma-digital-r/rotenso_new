import Markdoc, { type Node, type Schema } from "@markdoc/markdoc";
import React from "react";

// Headings keep the anchors set in the CMS ({% #co-to-cwu %}), so "Z tego artykułu dowiesz się"
// links inside the text keep working.
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
    const external = /^https?:\/\//.test(href) && !/^https?:\/\/(www\.)?rotenso\.com\/?$/.test(href);
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

export function ArticleBody({ node }: { node: Node }) {
  const tree = Markdoc.transform(node, { nodes: { heading, link, image } });
  return <div className="guide-body">{Markdoc.renderers.react(tree, React)}</div>;
}

