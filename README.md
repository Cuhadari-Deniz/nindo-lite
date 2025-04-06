# nindo-lite

## 📋 Requirements

- **bun** - Fast JavaScript runtime and toolkit
- **node** - _(vitest currently hangs when running via bun)_
- Don't forget to run `bun install` before starting

## 🛠️ Setup

### Option 1: Quick Setup Via Script

1. Run `bun i`
2. Run `bun setup`

### Option 2: Manual Setup

1. Run `bun i`
2. Run `cp ./apps/backend/.env.example ./apps/backend/.env`
3. Run `cp ./apps/frontend/.env.example ./apps/frontend/.env`
4. Run `bun db:push`
5. Run `cd ./apps/backend && bun ./setup.ts` to seed database with mock data


## 🚀 Launching the Application

To launch the application simply run `bun dev`


## 🧪 Running Tests

To run the tests run `bun check`

⚠️ Currently `bun test` is not supported due to an compatibility issue with bun and vite