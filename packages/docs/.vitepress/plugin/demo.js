// import type { MarkdownParsedData } from './types'
import path from 'path'
import fs from 'fs'

var RE = /<Demo /i

function DemoBlockRender(md, tokens, idx) {
  var content = tokens[idx].content
    if (RE.test(content.trim())) {
      console.log('content ', content)
      // var componentName = `demo${index++}`
      // var language = (content.match(/language=("|')(.*)('|")/) || [])[2] ?? ''
      var src = (content.match(/src=("|')(\S+)('|")/) || [])[2] ?? ''

      var demoPagePath = path.join(__dirname, '../../_demos', `${src}.tsx`)
      // console.log('demo ', demoPagePath)
      if (!src || !fs.existsSync(demoPagePath)) {
        var warningMsg = `${demoPagePath} does not exist!`
        console.warn(`[vitepress]: ${warningMsg}`)
        return `<Demo src="${demoPagePath}" errorMsg="${warningMsg}">`
      }

      // TODO cache it
      var codeStr = fs.readFileSync(demoPagePath).toString()
      console.log('code', codeStr)
      return `<Demo src="${src}" code="${codeStr}" language="tsx" title="这是标题" desc="这是描述">`
      // return content
    } else {
      return content
    }
}

export default function DemoComponentPlugin(md) {
  md.renderer.rules.html_inline = (tokens, idx) => {
    console.log('inline ', tokens[idx].content)
    return DemoBlockRender(md, tokens, idx)
  }
  md.renderer.rules.html_block = (tokens, idx) => {
    console.log('block ', tokens[idx].content)
    return DemoBlockRender(md, tokens, idx)
  }
}
