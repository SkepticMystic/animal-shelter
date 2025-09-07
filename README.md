# Animal Shelter

## Features

## Usage

### Local Development

1. Clone the repository

   ```bash
   git clone https://github.com/SkepticMystic/animal-shelter.git
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables

   Create a `.env` file in the root directory and add the necessary environment variables. You can refer to the `.env.example` file for guidance.

   Part of this step is setting up a new postgres db (I currently use neon). Create a development branch in the neon dashboard, and copy the connection string to your .env file as `DATABASE_URL`.

   Then run the following command to create the necessary tables:

   ```bash
   npm run db push
   ```

4. Run the development server

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173` to see the app in action.

### Deployment

1. Push your code to a Git repository (e.g., GitHub, GitLab).
2. Connect your repository to Vercel.
3. Set up the environment variables in the Vercel dashboard.
4. Edit the build command to `vite build && npm run db migrate` in the Vercel dashboard.
5. Deploy the app using Vercel.

## TODOs

- [ ] runed.dev
- [ ] PWA on app store: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable#installation_from_an_app_store
- [ ] Add llm.txt n instructions.md, where its helpful
- [ ] Try remove heroicons in favour of lucide
- [ ] Try remove dependence on vercel adapter... try deploy serverful
