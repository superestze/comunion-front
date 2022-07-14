import { UCarousel, CarouselInstance } from '@comunion/components'
import { LeftArrowFilled, RightArrowFilled } from '@comunion/icons'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    width: {
      type: Number,
      require: true
    }
  },
  setup(props, ctx) {
    let carouselInstance: CarouselInstance | null = null
    const onCarouselMounted = (carousel: CarouselInstance | null) => {
      carouselInstance = carousel
    }

    const prev = () => {
      if (carouselInstance !== null) {
        carouselInstance.prev()
      }
    }

    const next = () => {
      if (carouselInstance !== null) {
        carouselInstance.next()
      }
    }

    return () => (
      <div class="relative" style={{ maxWidth: `${props.width}px` }}>
        <div
          class="absolute w-20px h-48px bg-gray-100 -left-30px top-1/2 -mt-24px rounded flex items-center cursor-pointer"
          onClick={prev}
        >
          <LeftArrowFilled />
        </div>
        <div
          class="absolute w-20px h-48px bg-gray-100 -right-30px top-1/2 -mt-24px rounded flex items-center cursor-pointer"
          onClick={next}
        >
          <RightArrowFilled />
        </div>
        <UCarousel
          onCarouselMounted={onCarouselMounted}
          slidesPerView={3}
          spaceBetween={20}
          loop={true}
          draggable={true}
          showDots={false}
        >
          {ctx.slots.default?.()}
        </UCarousel>
      </div>
    )
  }
})
