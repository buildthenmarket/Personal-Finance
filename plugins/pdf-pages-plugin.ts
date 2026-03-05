import fs from 'fs';
import path from 'path';
import * as glob from 'glob';

/**
 * Converts PDF filename to readable title
 * "css-handbook.pdf" → "CSS Handbook"
 * "Git_Quick_Reference.2011-09-04.pdf" → "Git Quick Reference"
 */
function pdfToTitle(filename: string): string {
  return filename
    .replace(/\.pdf$/i, '')
    .replace(/^\d{1,2}-\d{1,2}-\d{4}-?/g, '') // Remove date prefixes
    .replace(/\.\d{4}-\d{2}-\d{2}/g, '')      // Remove date suffixes
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')      // camelCase → camel Case
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

/**
 * Escape special characters for use in YAML double-quoted strings
 * In YAML, inside double quotes: escape backslash and double quote only
 */
function escapeForYaml(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/**
 * Escape special characters for use in JavaScript strings (using JSON.stringify)
 */
function escapeForJs(str: string): string {
  // JSON.stringify handles all escaping correctly
  return JSON.stringify(str);
}

/**
 * Generate MDX content for a PDF
 */
function generateMdxContent(pdfFilename: string, title: string): string {
  const yamlTitle = escapeForYaml(title);
  const jsTitle = escapeForJs(title);

  return `---
title: "${yamlTitle}"
sidebar_label: "📄 ${yamlTitle}"
sidebar_position: 900
description: "View ${yamlTitle} PDF document"
---
{/* AUTO-GENERATED - DO NOT EDIT - Changes will be overwritten on next build */}

import PDFViewer from '@site/src/components/PDFViewer';

# ${title}

<PDFViewer
  src={require(${escapeForJs('./' + pdfFilename)}).default}
  title={${jsTitle}}
/>
`;
}

export default function pdfPagesPlugin(context: any, options: any) {
  const { siteDir } = context;
  const docsDir = path.join(siteDir, 'docs');

  // Find all PDFs in docs directory
  const pdfFiles = glob.sync('**/*.pdf', { cwd: docsDir });

  console.log(`[pdf-pages-plugin] Found ${pdfFiles.length} PDF files`);

  // Generate MDX files for each PDF (runs at plugin init, before docs plugin loads)
  pdfFiles.forEach((pdfRelPath: string) => {
    const pdfFullPath = path.join(docsDir, pdfRelPath);
    const mdxPath = pdfFullPath.replace(/\.pdf$/i, '.pdf.mdx');
    const pdfFilename = path.basename(pdfRelPath);
    const title = pdfToTitle(pdfFilename);

    const mdxContent = generateMdxContent(pdfFilename, title);
    try {
      fs.writeFileSync(mdxPath, mdxContent, 'utf8');
      console.log(`[pdf-pages-plugin] Generated: ${path.basename(mdxPath)}`);
    } catch (err: any) {
      console.error(`[pdf-pages-plugin] Failed to write ${mdxPath}: ${err.message}`);
      throw err;
    }
  });

  return {
    name: 'pdf-pages-plugin',

    // Clean up generated files after build (optional - keeps .docusaurus clean)
    async postBuild() {
      // Files are kept for dev server; gitignore handles not committing them
    },
  };
}
