# Website Maintenance & Operations Guide

This document serves as the official guide for maintaining, updating, and operating the **Đồ Gỗ Thờ Cúng US** website. It is designed for both store administrators and developers.

---

## 1. Managing Products & Inventory

The website is powered by a **Supabase** PostgreSQL database and uses a custom-built Admin Dashboard for easy management.

### Accessing the Admin Dashboard
1. Navigate to your website's admin URL: `https://dogothocung.us/admin` (or your local `http://localhost:4321/admin`).
2. Log in using the secure Admin Password (configured in your environment variables).

### Adding/Editing Products
1. In the Admin Dashboard, go to the **Products (Raw)** or **Products (Review)** tab.
2. Click **"Add New Row"** to create a new product, or click the ✏️ (pencil) icon to edit an existing one.
3. Fill in the required fields:
   * **SKU**: Must be unique (e.g., `BAN-CUNG-001`).
   * **Name**: The display name of the product.
   * **Category**: E.g., Bàn Cúng, Tủ Thờ.
   * **Price / Cost AVG / Shipping EST**: Fill out financial details to calculate profit margins automatically.
4. **Important**: Changes made here will instantly reflect on the live website. No code deployment is needed for product updates!

---

## 2. Image Management (Cloudinary)

To keep the website blazing fast, we use **Cloudinary** for image hosting instead of bloating the database or repository.

### Adding Images to a Product
1. Go to [Cloudinary.com](https://cloudinary.com) and log in.
2. Upload your high-resolution product photos to your Cloudinary Media Library.
3. Once uploaded, hover over the image and click the **"Copy URL"** icon.
4. Go back to your Admin Dashboard (or Supabase directly) and edit the product.
5. Paste the Cloudinary URL into the `images` field. 
   * *Note: The `images` field accepts an array of strings. Ensure the URLs are formatted properly as a JSON array (e.g., `["https://res.cloudinary.com/.../image.jpg", "https://..."]`) if editing raw database records.*

**Pro-Tip**: Add `/q_auto,f_auto/` after `upload/` in the Cloudinary URL to force automatic WebP compression.

---

## 3. Order & Customer Management

### Viewing Orders
1. In the Admin Dashboard, click on the **Orders** tab.
2. Here you can see incoming orders, customer details, and update the **Status** (Pending, Paid, Shipped, Cancelled).

### Customer Locations Map
The homepage features an interactive map of your customer locations. To keep this updated:
1. Go to the **Settings** ⚙️ tab in the Admin Dashboard.
2. Under "Data Management", click **"Scan & Update Customer Locations"**.
3. The system will securely scan new orders, extract the City/State, fetch the GPS coordinates, and save them. The homepage map will update automatically.

---

## 4. Analytics & Tracking (Google Analytics 4)

We use Google Analytics 4 (GA4) to track user behavior, page views, and locations.
1. **Accessing Analytics**: Go to [analytics.google.com](https://analytics.google.com).
2. Look at the **Realtime** or **Reports > Life cycle > Engagement** tabs to see which products (`/product/[slug]`) are viewed the most.
3. No further code maintenance is required. The GA4 script is permanently embedded in the website's `<head>`.

---

## 5. Developer Updates & Deployment

If you need to change the website's design, layout, or add new features, you will need to touch the code.

### Running Locally
1. Open the project folder in VS Code.
2. Ensure you have Node.js installed.
3. Install dependencies (if you haven't):
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. View the site at `http://localhost:4321`.

### Deploying Code Changes (Vercel)
The website is connected to GitHub and hosted on **Vercel**. Deployments are 100% automated.
1. Make your code changes locally.
2. Commit and push the code to your `main` branch on GitHub:
   ```bash
   git add .
   git commit -m "Updated homepage banner"
   git push origin main
   ```
3. Vercel will automatically detect the push, run `npm run build`, and deploy the changes live within ~30 seconds.

### Environment Variables
If you ever change your Supabase database or need to update the Admin Password:
1. Go to your project on [Vercel.com](https://vercel.com).
2. Go to **Settings > Environment Variables**.
3. Update `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, or `ADMIN_PASSWORD`.
4. Trigger a new deployment for the changes to take effect.
