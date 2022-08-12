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
    return <li class="text-20px font-bold mb-32px">{item.title}</li>
  }
  return (
    <li class="text-16px font-400 mb-16px hover:text-white">
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
          title: 'GCI (Gross Comunion Income)'
        },
        {
          title: 'Dappstore'
        }
      ],
      [
        {
          heading: true,
          title: 'Innovation'
        },
        {
          title: 'Enterprise'
        }
      ]
    ]
    const goHome = () => {
      location.href = '/'
    }
    return (
      <div class="flex bg-[#131415] justify-center">
        <div class="flex w-1110px h-368px justify-between pt-87px text-white/60  <md:hidden">
          <div class="flex items-start cursor-pointer" onClick={goHome}>
            <div class="w-25px h-25px mt-3px mr-10px">
              <img srcset={`${logo}, ${logo2} 2x, ${logo3} 3x`} src={logo} class="w-full" />
            </div>
            <p class="text-30px font-bold">Abount Us</p>
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
