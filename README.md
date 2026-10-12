# AcadNexa Frontend (Next.js 14 App Router)

Modern, high-performance web dashboard for the AcadNexa Multi-Tenant Campus Management System.

Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **TanStack React Query**, and **ReactBits Micro-Animations**.

---

## 🚀 Cloud Deployment on Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository: `AcadNexa-Frontend`.
4. Configure Project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `next build` (default)
   - **Output Directory**: `.next` (default)
5. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g. `https://acadnexa-backend.onrender.com/api/v1`)
6. Click **Deploy**.

---

## 🛠 Local Setup & Running
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal.
