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
          //滚动到元素位置
          //top: this.$refs[元素].offsetTop,//offsetTop 相对于offsetparent 定位,当有定位时，不准确。
          top: distance, //推荐使用，getBoundingClientRect 相对于当前视口的位置
          //top: 400//滚动到指定距离
          //top: 0,//滚动到顶部
          //top: document.documentElement.scrollHeight,//滚动到底部
          behavior: 'smooth' // 平滑滚动
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
          <div class="font-primary font-semibold pt-66.75 pl-52">
            <p class="text-[rgba(255,255,255,0.5)] text-[20px] mb-3">The First</p>
            <p class="font-medium text-[#FFF1F1] text-[64px]">
              <span>Permissionless {this.text}</span>
              {this.lineStatus && (
                <span class="inline-block h-13 w-1 bg-[#ffffff] ml-2 animate-pulse"></span>
              )}
            </p>
          </div>
          <p class="text-[#FFFFFF] text-[32px] text-center mt-8.5">
            to narrow the gap between rich and poor
          </p>
          <img
            onClick={this.onScroll}
            class="mx-auto mt-40 w-4 h-4 cursor-pointer animate-bounce"
            src={pullDown}
            alt=""
          />
        </div>
      </>
    )
  }
})
