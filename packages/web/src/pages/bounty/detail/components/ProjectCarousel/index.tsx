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
              class="rounded cursor-pointer flex bg-gray-100 h-48px -mt-24px top-1/2 -left-30px w-20px absolute items-center"
              onClick={prev}
            >
              <LeftArrowFilled />
            </div>
            <div
              class="rounded cursor-pointer flex bg-gray-100 h-48px -mt-24px top-1/2 -right-30px w-20px absolute items-center"
              onClick={next}
            >
              <RightArrowFilled />
            </div>
          </>
        )}
        <UCarousel
          ref={(ref: any) => (this.carousel = ref)}
          slidesPerView={Math.min(3, this.total)}
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
