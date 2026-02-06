# Production Roadmap - Đồ Gỗ Thờ Cúng US

This document outlines the final steps required to transition from development to a professional production launch.

## 1. SEO & Metadata Optimization [DONE]
*   **Goal**: Professional look on Social Media (Zalo/Facebook) and Google.
*   **Actions**:
    *   Create a central `SEO.astro` component. [DONE]
    *   Implement dynamic `<title>` and `<meta name="description">` based on product details. [DONE]
    *   Add OpenGraph (OG) tags for high-quality image previews. [DONE]

## 2. Sitemap & Indexing
*   **Goal**: Help Google find all your product pages automatically.
*   **Actions**:
    *   Integrate `@astrojs/sitemap`.
    *   Configure `robots.txt` to allow search engines to crawl all products.

## 3. URL Clean-up & Redirects
*   **Goal**: Prevent "Duplicate Content" SEO penalties.
*   **Actions**:
    *   Establish `/products/[slug]` as the primary URL. [DONE]
    *   Implement 301 Permanent Redirects for any old `/products/[id]` numeric URLs.

## 4. Image Performance & Optimization
*   **Goal**: Lightning-fast loading speeds on mobile.
*   **Actions**:
    *   Use Astro's `<Image />` component for automatic WebP conversion and lazy-loading.
    *   Optimize initial page load by compressing the Hero video.

## 5. Global Branding [DONE]
*   **Goal**: Consistent identity across browsers.
*   **Actions**:
    *   Upload and configure a `favicon.ico` (browser tab icon). [DONE]
    *   Set `theme-color` meta tags for modern mobile headers. [DONE]

## 6. Error Handling [DONE]
*   **Goal**: Keep customers on the site even if they hit a wrong link.
*   **Actions**:
    *   Create a custom `404.astro` page with a "Back to Shop" button. [DONE]

---

# Economic Image Management Guide

For an e-commerce site managing high-quality furniture photos, choosing a cost-effective and easy-to-manage image hosting strategy is crucial.

## Recommended: Cloudinary (Free Tier)
**The most "Economic" & Professional Method.**

### Why?
1.  **Unlimited Free Storage (Practical-scale)**: Their free tier is very generous for a boutique store.
2.  **Automatic Optimization**: You can upload a huge `4MB` photo, and it will automatically deliver a `200KB` optimized WebP to your users without you doing any manual work.
3.  **Perfect with Google Sheets**: Since you are using Google Sheets as your database, you only need to paste the **Cloudinary URL** into your "Images" column.

### Implementation Steps:
1.  **Sign up** for a free account at [Cloudinary.com](https://cloudinary.com).
2.  **Upload** your product photos to their dashboard.
3.  **Copy the link** and paste it into your Google Sheet.
4.  **Pro Tip**: You can add `/q_auto,f_auto/` into the URL to tell Cloudinary to "automatically choose the best quality and format" for every device.

## Alternative: Google Drive (The "Zero-Tool" Method)
If you want to keep everything inside Google's ecosystem:
1.  Upload photos to a Google Drive folder.
2.  Set sharing to "Anyone with the link".
3.  Use a "direct link generator" (or a small script I can provide) to get the direct image URL for your Sheet.
*Note: This is less professional as it doesn't offer "automatic compression" like Cloudinary.*

---
*Created on 2026-02-04*
