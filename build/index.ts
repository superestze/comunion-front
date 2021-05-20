import glob from 'fast-glob'
import cp from 'ncp'
import { resolve, sep } from 'path'
import { promisify } from 'util'

async function flattenBuildArtifacts() {
  const artifactPathList = glob.sync(resolve(__dirname, '../packages/*/dist'), {
    onlyDirectories: true,
  })
  for (const artifact of artifactPathList) {
    const splited = artifact.split(sep)
    const projectName = splited[splited.length - 2]
    console.log('copy:', projectName)
    await promisify(cp)(artifact, resolve(__dirname, '../dist', projectName))
    // await copyFolder(artifact, resolve(__dirname, '../dist', projectName))
  }
}

flattenBuildArtifacts()
