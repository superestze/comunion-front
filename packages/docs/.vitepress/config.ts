

export default {
  lang: 'en-US',
  title: 'Comunion Developer',
  description: 'Comunion developer documents',

  themeConfig: {
    repo: 'comunion-io/v5-front',
    docsDir: './',

    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',

    // algolia: {
    //   apiKey: 'c57105e511faa5558547599f120ceeba',
    //   indexName: 'vitepress'
    // },

    // carbonAds: {
    //   carbon: 'CEBDT27Y',
    //   custom: 'CKYD62QM',
    //   placement: 'vuejsorg'
    // },

    nav: [
      { text: 'Frontend', link: '/fe', activeMatch: '^/fe' },
      { text: 'Backend', link: '/backend', activeMatch: '^/backend' },
      { text: 'Contract', link: '/contract', activeMatch: '^/contract' },
    ],

    sidebar: {
      '/fe/': getFrontendSidebar(),
      '/backend/': getBackendSidebar(),
      '/contract/': getContractSidebar()
    }
  }
}

function getFrontendSidebar() {
  return [
    {
      text: 'xxx',
      children: [
        { text: 'xxx', link: '/' },
      ]
    },
  ]
}

function getBackendSidebar() {
  return [

  ]
}


function getContractSidebar() {
  return [

  ]
}
