# Relief Motion Physio - MVP

A mobile-first physiotherapy platform designed for physiotherapists to manage patients and for patients to view exercises and log their progress.

## Tech Stack
- **Frontend & API:** Next.js (App Router), TypeScript, TailwindCSS
- **Database & Auth:** Supabase (PostgreSQL)
- **UI Components:** shadcn/ui

## Setup Instructions

### 1. Database Setup (Supabase)
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Navigate to the **SQL Editor**.
3. Copy the contents of the `database_schema.sql` file provided in this repository.
4. Paste it into the SQL Editor and click **Run**. This will create all necessary tables, types, triggers, and Row Level Security (RLS) policies.

### 2. Environment Variables
1. Rename `.env.example` to `.env.local` (or create a new `.env.local` file).
2. Add your Supabase project keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# Only required for Physios to create Patient accounts bypassing standard signup
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```
You can find these keys in your Supabase dashboard under **Project Settings > API**.

### 3. Running the App Locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Testing the Roles
- **Patient Login:** Patients are redirected to `/patient/dashboard`.
- **Physio Login:** Physiotherapists are redirected to `/physio/dashboard`.
- *Note:* The SQL trigger sets any new signup to `patient` by default. To make a user a `physio`, go to the Supabase Table Editor, open the `profiles` table, and change their role from `patient` to `physio`.

## Deployment
This app is ready to be deployed on [Vercel](https://vercel.com).
1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add the environment variables from your `.env.local` to the Vercel deployment settings.
4. Deploy!
