# Rabine Site Backend

## Overview

An API for Rabine Site internal to manage their client's sites at scale. The
goal of the SITE workflow is to use the platform to identify repairs using AI
and generate a repair report to send to the client. The platform will include a
way for users to easily manage the sites that need action and also complete the
workflows necessary to create repairs and generate the report for the client.

## Development setup

1. Pull down the repo.
2. run `yarn` or `npm run install` in the root of the repo.
3. run `yarn start` to start development server.

## Deployment

Repo is deployed to Heroku. Project has:

- `develop` -> https://d.api.sitetechnologies.io
- `staging` -> https://s.api.sitetechnologies.io
- `master` -> https://api.sitetechnologies.io

## Migration (mid-late July 2018)

In July of 2018 it was decided to treat Site Map features as separate entities.
As such, there was a need to migrate data from previous set up of using
`db.sitemaps.features.$` to `db.sitemapfeatures` and `db.sitemaplayers` Mongo
collections.

We also added ES6/ES7 support, webpack module bundling for production code and
made a few general tweaks.

**Migration**

To do so, one needs to run the repo’s `~/__migrate_features.js` script via
Mongo CLI in the repo dir:

for local instance:
```bash
mongo 'localhost:27017/rabinesite' __migrate_features.js --verbose
```

for remote instance:
```bash
mongo $MONGODB_URI __migrate_features.js --verbose
```

The most important changes code-wise are related to `models/Site` and its
methods that rely on `models/Site/Repair`, `models/Site/Map` and others.

After the made changes, we’ve now got granular endpoints that treat Site Map
elements like features (polygons), layers and zones as separate (denormalized)
entities.

## Source

Repo utilises the [React Boilerplate](https://github.com/react-boilerplate/react-boilerplate).
