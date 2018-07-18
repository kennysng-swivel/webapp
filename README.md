# webapp

Provide commands for developing web app with webpack

## start

`webapp start /path/to/webpack.config.js [options]`

| Options   | Descriptions                         | Default       |
| --------- | ------------------------------------ | ------------- |
| mode      | either `development` or `production` | `development` |
| port      | port used by dev server              | 3000          |

## build

`webapp build /path/to/webpack.config.js [options]`

| Options   | Descriptions                                              | Default      |
| --------- | --------------------------------------------------------- | ------------ |
| analyze   | whether to enable bundle analyzer, or the port to be used | true         |
| clean     | whether to do a clean build                               | true         |
| mode      | either `development` or `production`                      | `production` |
