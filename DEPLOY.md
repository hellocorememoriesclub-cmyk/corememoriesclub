# Deploy the admin backend online (Railway)

This deploys the exact same `server.py` you've been running locally — traffic
report, bookings/inquiries, live chat, and GPS photo upload — to a real public
URL, with a persistent disk so the database and uploaded photos survive restarts.

## 1. Install the Railway CLI

```bash
npm install -g @railway/cli
```

(No Node/npm? Install it from https://nodejs.org first, or use
`brew install railway` on Mac.)

## 2. Log in

```bash
railway login
```

This opens your browser to authenticate — it's free to sign up, no card needed
to start.

## 3. Initialize the project

```bash
cd /Users/apple/corememoriesclub-clone
railway init
```

Pick "Create new project" and give it a name, e.g. `corememoriesclub`.

## 4. Create a persistent volume

This keeps your bookings, chat history, and uploaded photos across deploys.

```bash
railway volume create --mount-path /data
```

Then set the app to use it:

```bash
railway variables set DATA_DIR=/data
```

## 5. Set your admin token

Don't use the local default — set a real secret:

```bash
railway variables set ADMIN_TOKEN=TnEqyw2Q6WJNQ8tFKxjEvkSgO20ovNiT
```

(This is a freshly generated random token — you can use this one or generate
your own with `python3 -c "import secrets; print(secrets.token_urlsafe(24))"`.)

## 6. Deploy

```bash
railway up
```

This uploads the project and builds it (installs Pillow from `requirements.txt`,
then runs `python3 server.py` per the `Procfile`).

## 7. Get your public URL

```bash
railway domain
```

This generates a free `*.up.railway.app` URL. Your admin panel will be at:

```
https://<your-generated-domain>/admin.html
```

Log in with the token from step 5.

## Notes

- The main site pages, chat widget, and booking form will all be fully live
  and functional on this URL too (not just admin.html) — this is the complete
  site + backend, unlike the static Artifact link which has no backend.
- Every `railway up` redeploys your latest local changes. The volume (DB +
  uploaded photos) persists across redeploys automatically.
- To see logs: `railway logs`
- To check env vars: `railway variables`
