// import type { MarkdownParsedData } from './types'
import path from 'path'
import fs from 'fs'

var index = 1
var RE = /<demo /i

function DemoBlockRender(md, tokens, idx) {
  var content = tokens[idx].content
    // var data = (md as any).__data as MarkdownParsedData
    var data = md.__data
    var hoistedTags =
      data.hoistedTags ||
      (data.hoistedTags = {
        script: [],
        style: [],
        components: []
      })
    if (RE.test(content.trim())) {
      console.log('content ', content, ' data ', data)
      var componentName = `demo${index++}`
      var language = (content.match(/language=("|')(.*)('|")/) || [])[2] ?? ''
      var src = (content.match(/src=("|')(\S+)('|")/) || [])[2] ?? ''

      var demoPagePath = path.join(__dirname, '../../_demos', src)
      console.log('demo ', demoPagePath)
      if (!src || !fs.existsSync(demoPagePath)) {
        console.log('src not found')
        var warningMsg = `${demoPagePath} does not exist!`
        console.warn(`[vitepress]: ${warningMsg}`)
        return `<demo src="${demoPagePath}" >
        <p>${warningMsg}</p>`
      }
      if (!language) {
        language = (demoPagePath.match(/\.(.+)$/) || [])[1] ?? 'vue'
      }

      // TODO cache it
      var codeStr = fs.readFileSync(demoPagePath).toString()
      // const { content: codeContent, data: frontmatter } = matter(codeStr)
      // const htmlStr = encodeURIComponent(highlight(codeStr, language))
      console.log(`codeStr ${codeStr}`)

      hoistedTags.script.unshift(
        `import ${componentName} from '${demoPagePath}' \n`
      )
      hoistedTags.components.push(componentName)

      // return content.replace(
      //   '>',
      //   ` componentName="${componentName}" htmlStr="${codeStr}" codeStr="${encodeURIComponent(
      //     codeStr
      //   )}" ${
      //     md.importMap
      //       ? `importMap="${encodeURIComponent(JSON.stringify(md.importMap))}"`
      //       : ''
      //   } >
      //   <${componentName}></${componentName}>
      //   `
      // )
      return content
    } else {
      return content
    }
}

export default function DemoComponentPlugin(md) {
  md.renderer.rules.html_block = (tokens, idx) => {
    console.log('block ', tokens[idx].content)
    return DemoBlockRender(md, tokens, idx)
  }
  md.renderer.rules.html_inline = (tokens, idx) => {
    console.log('1112')
    return DemoBlockRender(md, tokens, idx)
  }
}
