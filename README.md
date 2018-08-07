# webapp

Provide commands for developing web app with webpack

## start

`webapp start /path/to/webpack.config.js [options]`

| Options   | Descriptions                           | Default       |
| --------- | -------------------------------------- | ------------- |
| env       | js file defining environment variables | undefined     |
| events    | js file defining events                | undefined     |
| hot       | enable hot module replacement (HMR)    | false         |
| hotOnly   | enable HMR without fallback mode       | false         |
| mode      | either `development` or `production`   | `development` |
| open      | whether to open the browser on built   | false         |
| port      | port used by dev server                | 3000          |

## build

`webapp build /path/to/webpack.config.js [options]`

| Options   | Descriptions                                              | Default      |
| --------- | --------------------------------------------------------- | ------------ |
| analyze   | whether to enable bundle analyzer, or the port to be used | false        |
| clean     | whether to do a clean build                               | false        |
| env       | js file defining environment variables                    | undefined    |
| events    | js file defining events                                   | undefined    |
| mode      | either `development` or `production`                      | `production` |
| open      | whether to test the built app                             | false        |
| port      | port used by dev server                                   | 3000         |
