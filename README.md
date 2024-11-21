This is a the production build for Association of Engineers Kerala.

## Getting Started

Clone the directory to your machine.
First, start a docker container:

```bash
docker compose up
```

Second, create a .env file and add the required keys as mentioned in the .env.local.example

Third, install packages using:

```bash
npm install
# or
bun install
```

Fourth, generate prisma client and push db using:

```bash
npx prisma generate
npx prisma db push
# or
bunx prisma generate
bunx prisma db push
```

Optional, you can create a migration, using:

```bash
npx prisma migrate dev
# or
bunx prisma migrate dev
```

Fifth, run dev server using:

```bash
npm run dev
#or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
