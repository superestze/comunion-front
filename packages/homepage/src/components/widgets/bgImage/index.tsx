import { defineComponent, ref, onMounted, nextTick } from 'vue'
import styles from './animate.module.css'
import pullDown from '@/assets/pullDown.png'
export default defineComponent({
  setup() {
    const divRef = ref()
    const text = ref('')
    const lineStatus = ref(true)
    const goTest = () => {
      let diskText = 'economic network'
      const timer = setInterval(() => {
        if (diskText) {
          text.value += diskText[0]
          diskText = diskText.substring(1, diskText.length)
        } else {
          lineStatus.value = false
          clearInterval(timer)
        }
      }, 100)
    }

    const onScroll = () => {
      nextTick(() => {
        const distance = divRef.value.scrollHeight
        window.scrollTo({
          top: distance,
          behavior: 'smooth'
        })
      })
    }
    onMounted(() => {
      goTest()
    })
    return {
      text,
      lineStatus,
      divRef,
      onScroll
    }
  },
  render() {
    return (
      <>
        <div ref="divRef" class={`${styles.bgImage} overflow-hidden`}>
          <div class="absolute left-0 right-0 top-0 bottom-0 m-auto w-256 h-35">
            <div class="font-primary font-semibold">
              <p class="text-[rgba(255,255,255,0.5)] text-[20px] mb-3 absolute left-[2.1rem] top-[-1.5rem]">
                The First
              </p>
            </div>
            <p class="font-medium text-[#FFF1F1] text-[64px] text-center">
              <span>Permissionless {this.text}</span>
              {this.lineStatus && (
                <span class="inline-block h-13 w-1 bg-[#ffffff] ml-2 animate-pulse"></span>
              )}
            </p>
            <p class="text-[#FFFFFF] text-[32px] text-center mt-8.5">
              to narrow the gap between rich and poor
            </p>
          </div>
          <img
            onClick={this.onScroll}
            class="absolute bottom-15 left-0 right-0 mx-auto w-4 h-4 cursor-pointer animate-bounce"
            src={pullDown}
            alt=""
          />
        </div>
      </>
    )
  }
})
