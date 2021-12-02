// import type { MarkdownParsedData } from './types'
import path from 'path'
import fs from 'fs'

var RE = /<Demo /i

function DemoBlockRender(md, tokens, idx) {
  var content = tokens[idx].content
    if (RE.test(content.trim())) {
      // console.log('content ', content)
      // var componentName = `demo${index++}`
      // var language = (content.match(/language=("|')(.*)('|")/) || [])[2] ?? ''
      var src = (content.match(/src=("|')(\S+)('|")/) || [])[2] ?? ''
      var title = (content.match(/title=("|')(\S+)('|")/) || [])[2] ?? ''
      var desc = content.match(/desc\=\"([\s\S]*)\"/)[1] ?? ''

      var demoPagePath = path.join(__dirname, '../../_demos', `${src}.tsx`)
      // console.log('demo ', demoPagePath)
      if (!src || !fs.existsSync(demoPagePath)) {
        var warningMsg = `${demoPagePath} does not exist!`
        console.warn(`[vitepress]: ${warningMsg}`)
        return `<Demo src="${demoPagePath}" errorMsg="${warningMsg}">`
      }

      var codeStr = fs.readFileSync(demoPagePath).toString()
      // console.log('code', codeStr)
      // console.log('desc', desc)
      return `<Demo src="${src}" code="${codeStr}" language="tsx" title="${title}" desc="${desc}" />`
      // return content
    } else {
      return content
    }
}

export default function DemoComponentPlugin(md) {
  // md.renderer.rules.html_inline = (tokens, idx) => {
  //   console.log('inline ', tokens[idx].content)
  //   return DemoBlockRender(md, tokens, idx)
  // }
  md.renderer.rules.html_block = (tokens, idx) => {
    // console.log('block ', tokens[idx].content)
    return DemoBlockRender(md, tokens, idx)
  }
}
