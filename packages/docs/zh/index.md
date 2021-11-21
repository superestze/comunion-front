---
title: Comunion 前端开发者文档
home: true
heroImage: /logo.png
actionText: 快速开始 →
actionLink: /zh/guide/getting-started.html
footer: MIT Licensed | Copyright © 2021-present Comunion
---

开始构建新一代网链交互平台

```bash
git clone https://github.com/comunion-io/comunion-front
cd comunion-front
yarn
yarn dev
```

```Demo 按钮
import { defineComponent } from 'vue'
import { Button } from '@comunion/components'

export default defineComponent({
  setup() {
    return () => (
      <Button>这是按钮</Button>
    )
  }
})
```
