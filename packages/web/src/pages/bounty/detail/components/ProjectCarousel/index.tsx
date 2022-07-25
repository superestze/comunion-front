import { UCarousel } from '@comunion/components'
import { LeftArrowFilled, RightArrowFilled } from '@comunion/icons'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    width: {
      type: Number,
      require: true
    },
    total: {
      type: Number,
      require: true,
      default: () => 0
    }
  },
  setup() {
    const carousel = ref<any>()
    return {
      carousel
    }
  },
  render() {
    const prev = () => {
      this.carousel.prev()
    }

    const next = () => {
      this.carousel.next()
    }
    return (
      <div class="relative" style={{ maxWidth: `${this.width}px` }}>
        {this.total > 3 && (
          <>
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
          </>
        )}
        <UCarousel
          ref={(ref: any) => (this.carousel = ref)}
          slidesPerView={3}
          spaceBetween={20}
          loop={true}
          draggable={true}
          showDots={false}
        >
          {this.$slots.default?.()}
        </UCarousel>
      </div>
    )
  }
})
