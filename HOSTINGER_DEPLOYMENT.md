# MyDigitalSkills — Hostinger Node.js Deployment

## Application settings

- Runtime: Node.js 22
- Build command: `npm run build`
- Start command: `npm start`
- Application root: repository root
- Branch: `main`

## Required environment variables

Create a Hostinger MySQL database and add the values from `.env.example` in hPanel. Never commit the real database password or admin password.

`UPLOAD_DIR` must point to a writable folder outside the deployment directory so uploaded course covers, PDFs and videos survive application redeployments.

## First login

- Admin: `/admin/lms`
- Student login: `/login`
- Student classroom: `/student/dashboard`
- Meta Ads landing page: `/connect`

Set `ADMIN_EMAIL` and a strong `ADMIN_PASSWORD` before the first deployment.
