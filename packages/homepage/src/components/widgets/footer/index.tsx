import { defineComponent } from 'vue'

import logo from '@/assets/20220725/logo.png'
import logo2 from '@/assets/20220725/logo@2x.png'
import logo3 from '@/assets/20220725/logo@3x.png'

type LiItem = {
  heading?: boolean
  url?: string
  title: string
}

function liRender(item: LiItem) {
  if (item.heading) {
    return (
      <li class="font-bold mb-8 text-[1.25rem] <md:mt-20 <md:mb-12 <md:text-[2.25rem]">
        {item.title}
      </li>
    )
  }
  return (
    <li class="font-400 mb-4 text-[1rem] <md:mb-15 <md:text-[1.5rem] hover:text-white">
      {item.url ? (
        <a key={item.title} href={item.url} target="_blank">
          {item.title}
        </a>
      ) : (
        <>{item.title}</>
      )}
    </li>
  )
}

export default defineComponent({
  render() {
    const list: LiItem[][] = [
      [
        {
          heading: true,
          title: 'Connect with us'
        },
        {
          title: 'Docs',
          url: 'https://docs.comunion.org'
        },
        {
          title: 'Twitter',
          url: 'https://twitter.com/Comunion01'
        },
        {
          title: 'Discord',
          url: 'https://discord.gg/9x4Up6aWRj'
        }
      ],
      [
        {
          heading: true,
          title: 'Developers'
        },
        {
          title: 'Foundation'
        },
        {
          title: 'Governance'
        },
        {
          title: 'dAppstore'
        }
      ],
      [
        {
          heading: true,
          title: 'Innovation'
        },
        {
          title: 'Innovation'
        }
      ]
    ]
    const goHome = () => {
      location.href = '/'
    }
    return (
      <div class="flex bg-[#131415] justify-center">
        <div class="flex h-368px pt-87px text-white/60 w-1110px justify-between  <md:hidden">
          <div class="cursor-pointer flex items-start" onClick={goHome}>
            <div class="h-25px mt-3px mr-10px w-25px">
              <img srcset={`${logo}, ${logo2} 2x, ${logo3} 3x`} src={logo} class="w-full" />
            </div>
            <p class="font-bold text-30px">About Us</p>
          </div>
          {list.map(items => (
            <ul class="list-none m-0 p-0">
              {items.map(item => (
                <>{liRender(item)}</>
              ))}
            </ul>
          ))}
        </div>
        <div class="flex flex-col w-full pt-45 pb-45 pl-16.25 text-white/60 justify-between md:hidden">
          <div class="cursor-pointer flex mb-20 items-start" onClick={goHome}>
            <div class="h-6.25 mt-1 mr-2.5 w-6.25">
              <img srcset={`${logo}, ${logo2} 2x, ${logo3} 3x`} src={logo} class="w-full" />
            </div>
            <p class="font-bold text-[2.8125rem]">About Us</p>
          </div>
          {list.map(items => (
            <ul class="list-none m-0 p-0">
              {items.map(item => (
                <>{liRender(item)}</>
              ))}
            </ul>
          ))}
        </div>
      </div>
    )
  }
})
