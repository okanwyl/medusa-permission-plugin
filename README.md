# Medusajs Permission Plugin(experimental)

Manage user permissions seamlessly on your Medusa commerce application.

[Medusa Website](https://medusajs.com/) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Dynamic policy clusters to group multiple permissions.
- Assign predefined permission policies to policy clusters.
- Intuitive dashboard to view and manage user permissions(WIP).
- Ready-integration with Medusa's Admin Dashboard.

<p align="center">
  <img src="./docs/view.gif" width="388" height="315" alt="">
</p>

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)

## How to Install

1\. Run the following command in the directory of the Medusa backend:

```bash
npm install TODO: after the publish
```

2\. In `medusa-config.js` add the following at the end of the `plugins` array:

```js
const plugins = [
  // ...
  {
    resolve: `medusa-permission-plugin`,
    options: {
      enableUI: true,
      excludeArray: ["<you_can_exclude_middleware_using_this_array>"],
    },
  },
]
```

## How Does It Work

- The plugin integrates by attaching itself to the default "admin" route middlewares. By default, it excludes the
  following routes: "auth", "users", "invites", and "analytics-configs". During runtime, it fetches all policies and
  policy clusters into a hashmap, then examines every incoming request from the end user.

**Caution:** This plugin requires to run migrations.

**Note:** This plugin is currently in an experimental phase. Please exercise caution and ensure adequate testing before
deploying it in a production environment.

### Notes

Please note that this plugin's UI components are a bit rough around the edges, as they have been "hacked through" from
the original MIT source code of the MedusaJS admin project. I am not a UI engineer, so I focused on the backend
functionality and logic of the plugin. Contributions to improve the UI or any other aspect of the plugin are very much
welcome!
