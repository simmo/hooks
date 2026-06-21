# Contributing

## Guidelines

- Written in TypeScript
- Must be fully tested on client and server
- Use NPM workspaces
- Each workspace is a separate package with its own README.md and package.json and is published to NPM.
- Command should be run from the root of the repo, not from inside a package, just use `-w` or `--workspace` to specify the package, e.g. `npm run build -w packages/my-package`.
- Each workspace/package should be a self contained React hook with a single purpose. Its totally fine to for packages to use each other.

## Getting Started

- Branch from `main`
- Run `npm ci`
- Run `npm start`
- Commit your changes, push and create a pull request to `main` with a description of your changes.
- A merged PR will trigger a GitHub workflow to run tests, typecheck and build each package. If any of these fail the PR will be marked as failed and you will need to fix the issues before it can be merged.
- Upon successful merge, the workflow will automatically publish beta package versions any packages that have changed to NPM.
- A repository owner will need to release productions versions.
