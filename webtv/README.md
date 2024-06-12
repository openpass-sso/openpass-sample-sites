# OpenPass Sample Demo App

This is a [React.js](https://create-react-app.dev/) project that creates a generic app to be compiled to multiple WebTV Technologies.

This app currently implements [OpenPass Javascript SDK](https://github.com/openpass-sso/openpass-js-sdk) to do the authorization flow for the app.

Current WebTV technologies supported:

* [WebOS](https://www.webosose.org/docs/home/)
* [Tizen](https://developer.tizen.org/)

## Recommended Versions

* Use Node.js 16

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building the App

In order to build the app for multiple packages (WebOS or Tizen) first you will need to install the necessary dependencies for each platform.

### WebOS

Install the [WebOS CLI](https://www.webosose.org/docs/tools/sdk/cli/cli-user-guide/) using npm

```bash
npm install --global @webos-tools/cli
```

Verify the installation was completed by checking the version of `ares`

```bash
ares --V
```

if a result it's prompt means it was installed successfully

### Tizen

TBD


### Next steps

First run the `build` command, this will automatically generate a React app build with all the HTML code necessary for the base WebTV app.

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

After the build command was triggered the `postbuild` command should be automatically triggered, this command will trigger the internal pipelines to build the app for each supported technology.

```bash
npm run postbuild
# or
yarn postbuild
# or
pnpm postbuild
# or
bun postbuild
```

You can find the build for each platform under `applications/<techonology>/package` folder, each folder will have the cod to manually build a package if necessary.

## Resources

This repository has a `resources` folder which contain all the static files needed to build each WebTV app, like `json` config files or static javascript code related to each library package
