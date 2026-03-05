# Code Review: Personal Finance Docusaurus

## 🟡 Code Smells & UX Issues

### 6. **PDF Viewer Hardcoded Height**
- **Severity:** LOW-MEDIUM
- **Location:** `src/components/PDFViewer.module.css` line 42
- **Issue:** Fixed `height: 600px` doesn't account for mobile responsiveness
- **Fix:** Add mobile breakpoint:
  ```css
  .pdfViewer {
    width: 100%;
    height: 600px;
    background-color: #f5f5f5;
  }
  
  @media (max-width: 600px) {
    .pdfViewer {
      height: 400px;
    }
  }
  ```

### 7. **PDFViewer Missing Error Handling**
- **Severity:** MEDIUM
- **Location:** `src/components/PDFViewer.tsx`
- **Issue:** No fallback if iframe fails to load PDF
- **Fix:** Add error handling:
  ```typescript
  <iframe
    src={src}
    title={title}
    className={styles.pdfFrame}
    frameBorder="0"
    onError={() => console.error(`Failed to load PDF: ${title}`)}
  />
  <p style={{marginTop: '1rem', color: 'var(--ifm-color-danger)'}}>
    If PDF doesn't load, try downloading it using the button above.
  </p>
  ```

---

## 🟠 Architecture & Performance Issues

### 8. **Two Config Files (Minor - Already Fixed)**
- Status: ✅ RESOLVED
- You've already deleted `docusaurus.config.js`

### 9. **Search Plugin Might Index Generated PDFs**
- **Severity:** LOW-MEDIUM
- **Location:** `docusaurus.config.ts` line 49-54
- **Issue:** Search plugin doesn't exclude auto-generated `.pdf.mdx` files
- **Impact:** Users might see duplicate/confusing search results
- **Fix:** Add exclusion pattern:
  ```typescript
  [
    '@easyops-cn/docusaurus-search-local',
    {
      hashed: true,
      language: ['en'],
      highlightSearchTermsOnTargetPage: true,
      explicitSearchResultPath: true,
      exclude: ['**/*.pdf.mdx'], // Add this
    },
  ],
  ```

### 10. **Missing TypeScript Strict Mode**
- **Severity:** LOW
- **Location:** `tsconfig.json`
- **Issue:** No `strict: true` setting for better type safety
- **Fix:** Consider enabling:
  ```json
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
  ```

---

## 📋 Configuration Red Flags

### 11. **Placeholder Configuration Values**
- **Severity:** MEDIUM
- **Location:** `docusaurus.config.ts` lines 11-12, 19-20
- **Issues:**
  - `url: 'https://your-site.com'` - Still placeholder
  - `organizationName: 'your-org'` - Still placeholder
  - `projectName: 'personal-finance'` - Still placeholder
  - GitHub URLs point to placeholder `your-org`
- **Fix:** Update with actual values before deployment

### 12. **Missing favicon.ico**
- **Severity:** LOW
- **Location:** `docusaurus.config.ts` line 8
- **Issue:** Referenced but likely doesn't exist
- **Fix:** Add favicon to `static/img/favicon.ico` or update reference

### 13. **Broken Edit Link URLs**
- **Severity:** LOW
- **Location:** `docusaurus.config.ts` line 67
- **Issue:** `editUrl` points to `your-org` - broken for end users
- **Fix:** Update with actual repo:
  ```typescript
  editUrl: 'https://github.com/savageceo/personal-finance/tree/main/',
  ```

---

## 🎯 UX Design Improvements

### 14. **Missing Table of Contents on Mobile**
- **Severity:** LOW
- **Suggestion:** Consider adding a mobile-friendly TOC

### 15. **Discord/StackOverflow Links Broken**  
- **Severity:** LOW
- **Issue:** Footer links point to generic communities, not specific to this project
- **Fix:** Either remove or link to actual project resources

### 16. **Category Dropdown vs Sidebar Redundancy**
- **Severity:** LOW
- **Issue:** Categories in navbar dropdown AND full sidebar - redundant UX
- **Suggestion:** Choose one approach for consistency

---

## ✅ Quick Fixes Checklist

Priority order for fixes:

1. **URGENT:** Add `**/*.pdf.mdx` to `.gitignore`
2. **URGENT:** Fix dotenv `safe` and `systemvars` settings
3. **HIGH:** Add integrity hash to Decap CMS script
4. **HIGH:** Update all placeholder config values
5. **MEDIUM:** Fix navbar routing inconsistency
6. **MEDIUM:** Restore `autocollapseCategories`
7. **MEDIUM:** Add search exclusions for PDFs
8. **MEDIUM:** Fix PDF viewer mobile responsiveness
9. **LOW:** Add error handling to PDFViewer component
10. **LOW:** Enable TypeScript strict mode

---

## Summary

Your Docusaurus setup is solid overall, but needs attention to:
- **Security:** Env config, third-party scripts
- **Build hygiene:** Generated files in git
- **UX:** Mobile responsiveness, error handling
- **Configuration:** Remove all placeholder values

Most issues are low-friction fixes. Focus on the 🔴 critical items first.
