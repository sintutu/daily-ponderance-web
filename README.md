# Daily Ponderance

Display the daily ponderance in a web browser for any day of a year. Run it locally on your own computer.

## Building and running

This is a two step process. 

1. You get dependencies. 
2. You run it on your own computer.

### Dependencies

You need node.js. Download this per instructions from [here](https://nodejs.org/en/download (Download node)) if you don't have it.
All other dependencies are specified in the project. Notable ones are React and [Vite](https://vite.dev/). 

To get sorted, go to project root and run

```bash
npm install
```


### Run

Vite allows you to run the app immediately without fuss. So you can see the daily ponderance quickly with

```bash
npm run start
```

## Private journal (Supabase)

The daily readings stay public. Journal entries require a Supabase account and are stored in Supabase Postgres.

1. Create a free Supabase project.
2. In `src/web/.env.local`, set `VITE_SUPABASE_URL` to the project's API URL and `VITE_SUPABASE_ANON_KEY` to its publishable/anon key. This working environment file is ignored by Git; `.env.example` shows the required variable names. Restart Vite after changing it.
3. In the Supabase SQL editor, run [`supabase/migrations/202611160001_create_journal_entries.sql`](supabase/migrations/202611160001_create_journal_entries.sql). The Journal page will not be able to save or list entries until this table and its row-level security policies exist.
4. In Supabase Auth URL configuration, add the local app URL (usually `http://localhost:5173`) to the allowed redirect URLs. Email confirmation can be enabled; the app tells new users to check their email.
5. Start the app with `npm run start:web`, then use the Journal link to create an account or sign in.

For Cloudflare Pages production, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as production build variables in the Pages project's settings; local `.env.local` is not deployed. Disable public sign-ups in Supabase Authentication settings and create/invite only your own Auth user. The app provides sign-in only. The client uses the publishable/anon key, which is designed for browser use. Row-level security is enabled by the migration and limits every operation to the signed-in user's rows. Never put a Supabase service-role key in a `VITE_` variable. Supabase Free projects may pause after one week of inactivity and do not include automatic backups; export your journal JSON periodically if you need a personal copy.

## Contribute

Please see [Contribute.md](./CONTRIBUTE.md) for contribution ideas. This readme is intentionally sparce to get you going.
