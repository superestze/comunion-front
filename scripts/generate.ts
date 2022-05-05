import { generateContracts, generateComponent } from './generators'

async function run() {
  const args = process.argv.slice(2)
  const generateType = args[0]
  switch (generateType) {
    case 'component':
      return generateComponent(args[1])
    case 'contract':
      return generateContracts(args[1])
    default:
      break
  }
}

run()
