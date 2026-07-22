#!/usr/bin/env node
// Assembles src/ into index.html. The single source of truth for the deployed
// app is src/ -- index.html is a generated artifact. Run: node build.js
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SRC = path.join(ROOT, "src");

// DOM order (not nav-bar order -- see AUDIT-PROCESS.md / the split plan for why
// they differ). Changing this changes rendered tab order on the page.
const TAB_ORDER = ["dict", "pairs", "triples", "quads", "zeta", "ladder", "qa"];

function read(...parts) {
  return fs.readFileSync(path.join(SRC, ...parts), "utf8").replace(/\r\n/g, "\n");
}

function trimTrailingNewline(s) {
  return s.replace(/\n+$/, "");
}

const shell = read("shell.html");
const baseCss = trimTrailingNewline(read("base.css"));
const tabSections = TAB_ORDER.map((t) => trimTrailingNewline(read("tabs", `${t}.html`))).join("\n\n");

// Script assembly order matters: utils before first use, tooltip system before
// any render call, self-tests last (PAIRS_AT_LOAD is captured inside boot.js
// immediately before boot.js's own call to runSelfTests()).
const scriptParts = [
  read("shared", "utils.js"),
  read("shared", "tooltips.js"),
  ...TAB_ORDER.map((t) => read("tabs", `${t}.js`)),
  read("shared", "boot.js"),
  read("shared", "selftest.js"),
].map(trimTrailingNewline);
const script = scriptParts.join("\n\n");

let out = shell;
out = out.replace("<!--__BASE_CSS__-->", baseCss);
out = out.replace("<!--__TAB_SECTIONS__-->", tabSections);
out = out.replace("//__SCRIPT__", script);

fs.writeFileSync(path.join(ROOT, "index.html"), out, "utf8");
console.log("Built index.html (%d bytes) from src/.", out.length);
