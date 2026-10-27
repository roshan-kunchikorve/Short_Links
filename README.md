<div align="center">

# 🔗 Short Links

**A fast, minimal URL shortener built with Next.js, TypeScript, Tailwind CSS and MongoDB.**

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

</div>

<!-- Add your live demo link once deployed:
🌐 **Live demo:** https://your-app.vercel.app
-->

## 📖 About

Short Links turns long, unwieldy URLs into short links that are easy to share. Paste a URL, get a short link back, and anyone who opens it is redirected to the original page. Links are stored in MongoDB, and the app is built on the Next.js App Router.

## ✨ Features

- ✂️ Shorten any long URL into a compact, shareable link
- 🔀 Redirect visitors from the short link to the original URL
- 🗄️ Persistent storage in MongoDB using Mongoose
- ⚡ Built with Next.js (App Router), React 19 and TypeScript
- 🎨 Styled with Tailwind CSS 4

<!--
## 📸 Screenshots

![Home page](./screenshots/home.png)
-->

## 🛠️ Tech Stack

| Layer     | Technology                  |
| --------- | --------------------------- |
| Framework | Next.js 16 (App Router)     |
| UI        | React 19, Tailwind CSS 4    |
| Language  | TypeScript 5                |
| Database  | MongoDB with Mongoose       |
| Tooling   | ESLint                      |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 20 or later
- A MongoDB database, either a local instance or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/roshan-kunchikorve/Short_Links.git
   cd Short_Links
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the project root:

   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/short_links
   ```

   For a local MongoDB instance, use something like `mongodb://127.0.0.1:27017/short_links`. Never commit this file.

4. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the development server         |
| `npm run build` | Create an optimized production build |
| `npm start`     | Run the production build             |
| `npm run lint`  | Lint the code with ESLint            |

## ⚙️ How It Works

1. You submit a long URL.
2. The app generates a short code and saves the mapping in MongoDB.
3. When someone opens the short link, the app looks up the code and redirects them to the original URL.

## 📁 Project Structure

```
Short_Links/
├── app/            # Next.js App Router: pages, layouts and routes
├── components/     # Reusable React components
├── lib/            # Shared helpers, such as database connection code
├── public/         # Static assets
├── next.config.ts  # Next.js configuration
├── eslint.config.mjs
├── tsconfig.json
└── package.json
```

## ☁️ Deployment

The easiest way to deploy is [Vercel](https://vercel.com/new):

1. Push the repo to GitHub and import it into Vercel.
2. Add the `MONGODB_URI` environment variable in the project settings.
3. If you use MongoDB Atlas, allow Vercel's access in your cluster's Network Access settings.
4. Deploy.
