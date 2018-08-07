# webapp

Provide commands for developing web app with webpack

## start

`webapp start /path/to/webpack.config.js [options]`

| Options   | Descriptions                         | Default       |
| --------- | ------------------------------------ | ------------- |
| config    | webapp configurations                | undefined     |
| hot       | enable hot module replacement (HMR)  | false         |
| hotOnly   | enable HMR without fallback mode     | false         |
| mode      | either `development` or `production` | `development` |
| open      | whether to open the browser on built | false         |
| port      | port used by dev server              | 3000          |

## build

`webapp build /path/to/webpack.config.js [options]`

| Options   | Descriptions                                              | Default      |
| --------- | --------------------------------------------------------- | ------------ |
| analyze   | whether to enable bundle analyzer, or the port to be used | false        |
| clean     | whether to do a clean build                               | false        |
| config    | webapp configurations                                     | undefined     |
| mode      | either `development` or `production`                      | `production` |
| port      | port used by dev server                                   | 3000         |
| test      | whether to test the built app                             | false        |
