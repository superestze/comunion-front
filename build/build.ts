import { watch } from 'chokidar'
import { resolve } from 'path'

const watcher = watch('packages/{hooks,icons,utils,components}/src/**/*.*', {
  followSymlinks: true,
  cwd: resolve(__dirname, '../')
})

watcher.on('unlink', () => {})
watcher.on('change', () => {})
