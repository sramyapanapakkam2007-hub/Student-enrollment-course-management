# Phase 7 - Deployment

## Production checklist
1. Use a managed MySQL database.
2. Set strong DB credentials and JWT_SECRET as environment variables.
3. Restrict CORS to the production frontend domain.
4. Run `npm run build` for the frontend.
5. Serve the frontend through a web server/CDN.
6. Run the Node.js API behind HTTPS.
7. Enable database backups.
8. Add logging and monitoring.
9. Never commit `.env` files or secrets.

## Suggested structure
student-enrollment-course-management/
├── phase-01-requirements/
├── phase-02-design/
├── phase-03-database/
├── phase-04-backend/
├── phase-05-frontend/
├── phase-06-testing/
└── phase-07-deployment/
