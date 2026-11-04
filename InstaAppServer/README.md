# InstaApp

## Server configuration

```env
DATABASE_URL=postgresql://user:password@localhost:5432/instaapp
SECRET_KEY=replace-with-a-long-random-secret
RESEND_API_KEY=your-resend-api-key
```

Start the server from the repository root with:

```sh
npm --prefix InstaAppServer start
```