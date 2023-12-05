# Allo Protocol Workshop 1 - Using the SDK


Why am I learning this?

The Allo Protocol is a new way to build applications for funding and allocating resources. It is a new way to build applications that are more fair, more transparent, and more open.


- **Table of Contents**
  - [Prerequisites](#prerequisites)
  - [Introduction](#introduction)
  - [Objectives](#objectives)
  - [Preparation](#preparation)
  - [Next Steps](#next-steps)
  - [Resources](#resources)


## Prerequisites

- [ ] [Node.js](https://nodejs.org/en/download/)
- [ ] [Git](https://git-scm.com/downloads)
- [ ] [Yarn](https://yarnpkg.com/en/docs/install), [NPM](https://www.npmjs.com/get-npm), [PNPM](https://pnpm.js.org/en/installation), or [Bun](https://bun.sh/docs/installation)

## Introduction [8 mins]

The Allo Protocol is a new way to build applications for funding and allocating resources. It is a new way to build applications that are more fair, more transparent, and more open.

- [8 mins] Slides: What is the Allo Protocol?


## Objectives

By the end of this, developers should be able to:

- [ ] Understand the essential parts of the Allo Protocol and how they work together with the Allo SDK
- [ ] Implement the Allo SDK to read and create a new Strategy(Pool) and Profile
- [ ] Start building a new application using the Allo SDK

## Preparation [5 mins]

Note to self: do I need to deploy anything in advance to make this work?
TODO:
- .env values

- [ ] Fork and clone [this](https://github.com/allo-protocol/allo-sdk-workshop-1.git) repository.
- [ ] Switch to the branch called, `start`, to begin your work.
- [ ] Install dependencies with bun/yarn install.

todo: Better preparation instructions may be found as snippets. Add .env snippet here.


NOTE: It's a good idea to have students do these steps while you're writing objectives on the whiteboard/slides and showing the demo.


## Demo [20 mins]

- [7 mins] Demo Alloscan to show how we set up a block explorer using the Allo SDK
- [13 mins] Demo SeaGrants to show how we set up a grant strategy and application using the Allo SDK


## Code Along [20 mins]

1. [5 mins] Create a new Strategy(Pool) using the Allo SDK
2. [5 mins] Create a new Profile using the Allo SDK
3. [10 mins] Create a new application using the Allo SDK
4. ? out of scope ? [5 mins] Deploy the application to a testnet


## Resources

- [Allo Protocol](https://github.com/allo-protocol/allo-v2) - This is the main repository for the Allo Protocol smart contracts.
- [Allo SDK](https://github.com/allo-protocol/allo-v2-sdk) - This is the main repository for the Allo SDK.
- [Allo Scan](https://github.com/allo-protocol/allo-scan) - Our first application built on the Allo Protocol, a block explorer showing all the transactions on the Allo Protocol with some basic features.
- [Sea Grants](https://github.com/allo-protocol/SeaGrants) - Our second application built on the Allo Protocol, a micro-grant style application and funding platform using user defined strategies.
- [Spec](https://github.com/allo-protocol/allo-v2-spec) - Our indexing service for the Allo Protocol that allows us to query the blockchain for data using GraphQL.