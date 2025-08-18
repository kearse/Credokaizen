# CredoKaizen Website

A modern, animated portfolio / venture studio site showcasing the products, programs, and companies we build and launch.

## ✨ Stack

- **Next.js (App Router) + React + TypeScript**
- **Tailwind CSS** for rapid styling
- **Framer Motion** for smooth, high‑quality animations
- (Optional) MySQL integration (you can choose raw driver, Prisma, Drizzle, etc.)

## 🚀 Getting Started

```bash
git clone git@github.com:kearse/Credokaizen.git
cd Credokaizen
npm install
npm run dev
```

Visit: http://localhost:3000

## 🗂 Planned Core Sections (Roadmap)

1. Hero + Strategic Narrative
2. Venture Portfolio (filterable: Active / In Incubation / Exited)
3. Product / Program Detail Pages
4. Studio Methodology (Kaizen loop, innovation pipeline)
5. Tech & Capabilities
6. Blog / Insights (optional)
7. Contact / Partnership
8. Careers (talent attraction)
9. Dynamic CMS integration (if desired)

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and fill in real values. Never commit `.env.local`.

```
cp .env.example .env.local
```

## 🧪 Development Notes

- Tailwind uses CSS variables for theme colors in `globals.css`.
- Framer Motion used in `page.tsx` hero; extend for section reveal, parallax, etc.
- Add reusable animation variants in a future `src/lib/animations.ts`.

## 🛡 Security / Secrets

- Real DB credentials belong only in `.env.local` or deployment secrets.
- NEVER commit production secrets.
- Consider adding secret scanning / GitHub Advanced Security if available.

## 📦 Future Enhancements

- Add ESLint + Prettier opinionated config
- Choose ORM (Prisma / Drizzle) and generate schema
- Image optimization strategy & design system components
- Dark / light adaptive themes
- Automated accessibility & performance CI checks

---

Made with continuous improvement in mind (Kaizen). Let’s build iteratively. 🚧