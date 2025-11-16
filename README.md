# Iqra Dars Udinur - Islamic Education Institution Website

This is a [Next.js](https://nextjs.org) project for the Iqra Dars Udinur Islamic Education Institution website.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud like MongoDB Atlas)
- Supabase account (for image storage)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration (for image uploads)
# Get these from: https://app.supabase.com -> Your Project -> Settings -> API
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Secret (generate a random string for authentication)
JWT_SECRET=your_jwt_secret_key_here
```

### Setting up Supabase

1. Go to [Supabase](https://app.supabase.com) and create a new project
2. Once your project is created, go to **Settings** > **API**
3. Copy your **Project URL** and **anon/public key**
4. Go to **Storage** and create a new bucket named `gallery`
5. Make sure the bucket is **public** (Settings > Policies > Allow public access)
6. Add these values to your `.env.local` file

### Setting up MongoDB

1. Create a MongoDB database (use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for free cloud hosting)
2. Get your connection string
3. Add it to your `.env.local` file as `MONGODB_URI`

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Banner Slider**: Auto-rotating banner images with admin management
- **Latest News**: News section with detail pages and admin CRUD
- **YouTube Videos**: Video gallery with admin management
- **Committees**: Organization committees with member management
- **Dark/Light Mode**: Theme toggle in navbar
- **Admin Panel**: Full content management system
- **Contact & Location**: Enhanced contact and location pages

## Admin Access

- Navigate to `/admin/login` to access the admin panel
- Default credentials can be set in the login route

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Make sure to add all environment variables in your Vercel project settings.
