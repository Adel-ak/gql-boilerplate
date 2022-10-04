<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Revive-Group/revive-landing">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy-7awxgGlstS8MMOo_9dsrpZCWOhzwqzwawhmZ4KoKQ&s" alt="Logo" width="80" height="80" style="border-radius: 20px">
  </a>

  <h3 align="center">GQL Boilerplate</h3>
  <br />
  <p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/node-16.17.0-blue.svg" />
</p>
</div>

<br />
<br />
<br />

> A Simple Express Graphql Reusable Boilerplate

This is a boilerplate graphql express server, it has graphql-ws enabled and uses redis pub sub to manage subscriptions, it also uses graphql modules for scalability of project and gql code gen to help speed up development.

Things it has

- rate limiting express and graphql middleware
- graphql auth middleware
- aws and redis pubsub graphql DI
- Request logging to console (with color changing based on response time)
  1. Red >= 5sec
  2. Yellow >= 2sec
  3. White < 2
- aws file upload (local upload if NODE_ENV is dev)
- local static file serving (only if NODE_ENV is dev - uploads folder)
- graphql and express response compression
- And More.....

<br />

## Prerequisites

- Node >= v16.17.0
- Pnpm >= v7.11.0
- Redis
- MongoDB

## Usage

### Installation

1. Clone the repo
2. Install NPM packages
   ```sh
   pnpm install
   ```
3. Setup git hooks
   ```sh
   pnpm config-husky
   ```
4. Set your `.env` using the `.env.example`
5. Run/Start the project

Terminal - 1

```sh
pnpm gql-codegen (Development)
```

Terminal - 2

```sh
pnpm start:dev (Development)
```

`Note about start:dev`: it uses swc to help speed up development, but it comes with a cost (No type checking), if you want to disable it, head over to nodemon.json and remove --swc from execMap ts

```sh
pnpm build && pnpm start (Production Build)
```

`Note about pnpm build`: if building is slow, you can use `pnpm build:swc` to speed it up, but again it comes with a cost (No type checking during build time)

<br/>
<br/>
<br/>

## Author

👤 **Adel Ak**

- Website: adelak.dev
- Mail: [adelkerow@gmail.com](mailto:adelkerow@gmail.com)
- Github: [@adel-ak](https://github.com/adel-ak)
- Twitter: [Adel_xoxo](https://twitter.com/adel_xoxo)
