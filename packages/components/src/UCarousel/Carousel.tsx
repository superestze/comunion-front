import { CarouselProps, NCarousel } from 'naive-ui'
import { defineComponent, onMounted, ref } from 'vue'

export type CarouselInstance = InstanceType<typeof NCarousel>

export type UCarouselProps = CarouselProps

const UCarousel = defineComponent({
  name: 'UCarousel',
  extends: NCarousel,
  emits: ['CarouselMounted'],
  setup(props, ctx) {
    const carousel = ref<InstanceType<typeof NCarousel> | null>(null)
    onMounted(() => {
      ctx.emit('CarouselMounted', carousel.value)
    })
    return () => <NCarousel ref={carousel} {...props} v-slots={ctx.slots} />
  }
})

export default UCarousel
