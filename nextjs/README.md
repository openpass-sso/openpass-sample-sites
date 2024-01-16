## Overview

This application shows how to configure `OpenPass` as an authentication provider for `next-auth`.

## Getting Started

### 1. Clone the repository and install dependencies

```
git clone https://github.com/openpass-sso/openpass-sample-sites.git
cd nextjs
npm install
```

Next.js 14 requires at least Node.js 18.17 or later to be installed on your system. For more information on installation requirements please see [Next.js documentation](https://nextjs.org/docs/getting-started/installation).

### 2. Configure your local environment

Copy the .env.local.example file in this directory to .env.local (which will be ignored by Git):

```
cp .env.local.example .env.local
```

Open `.env.local` file and generate a value for:

- `AUTH_SECRET`

Paste values for the following (these were provided for you when configuring an application with OpenPass):

- `AUTH_OPENPASS_CLIENT_ID`
- `AUTH_OPENPASS_SECRET`

### 3. Start the application

To run your site locally, use:

```
npm run dev
```

Navigate to `http://localhost:3012` to view the app.
