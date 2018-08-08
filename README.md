# webapp

Provide commands for developing web app with webpack

## start

`webapp start /path/to/webpack.config.js [options]`

| Options   | Descriptions                           | Default       |
| --------- | -------------------------------------- | ------------- |
| devServer | js file defining devServer options     | undefined     |
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

## events

| Name         | Descriptions                                                                          |
| ------------ | ------------------------------------------------------------------------------------- |
| pre-build    | before the build process starts                                                       |
| post-build   | after the build process completes                                                     |
| pre-start    | before the development server starts                                                  |
| post-start   | after the development server starts. Note that the build process may not be completed |
| pre-restart  | before the development server restarts, i.e. before the stop event                    |
| post-restart | after the development server restarts, i.e. after the start event                     |
| pre-stop     | before the development server stops                                                   |
| post-stop    | after the development server stops                                                    |