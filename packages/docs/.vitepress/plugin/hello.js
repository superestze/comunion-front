function HelpBlockRender(md, tokens, idx) {
    return `<hello msg="world" />`
}


export default function HelpComponentPlugin(md) {
  md.renderer.rules.html_block = (tokens, idx) => {
    return HelpBlockRender(md, tokens, idx)
  }
  md.renderer.rules.html_inline = (tokens, idx) => {
    return HelpBlockRender(md, tokens, idx)
  }
}
