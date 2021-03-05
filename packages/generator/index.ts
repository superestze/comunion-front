import componentGenerator from './generators/component'

async function run() {
  const args = process.argv.slice(2)
  const generateType = args[0]
  switch (generateType) {
    case 'component':
      return componentGenerator(args[1])

    default:
      break
  }
}

run()
