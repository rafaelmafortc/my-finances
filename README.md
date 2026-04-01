# my-finances

## Getting started

Configure o `.env`:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Instale e rode:

```bash
pnpm i
npx prisma db pull
npx prisma generate
pnpm dev
```

Acesse em [http://localhost:3000](http://localhost:3000).
