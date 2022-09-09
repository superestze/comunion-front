import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    value: {
      type: String,
      default: () => '100'
    },
    enhance: {
      type: Number,
      default: () => 36
    },
    unit: {
      type: String,
      default: () => ''
    },
    plus: {
      type: Boolean,
      default: () => false
    },
    half: {
      type: Boolean,
      default: () => false
    },
    textColor: {
      type: String,
      default: 'text-primary'
    },
    digit: {
      type: Number,
      default: 0
    },
    unitClass: {
      type: String
    }
  },
  setup(props, ctx) {
    const prefix = computed(() => {
      return props.plus ? (
        <span
          class="font-sans font-normal right-full bottom-2 text-[1.8rem] absolute"
          data-name="placeholder"
        >
          +
        </span>
      ) : null
    })

    const mainTextClass = 'font-orbitron leading-none text-9 relative px-1'

    const formatText = computed(() => {
      if (props.digit > props.value.length) {
        const remaining = props.digit - props.value.length
        let remainingStr = ''
        for (let i = 0; i < remaining; i++) {
          remainingStr += '0'
        }
        return (
          // text-warning
          <strong class={`${mainTextClass}`} style={{ fontSize: `${props.enhance}px` }}>
            {prefix.value}
            {props.value}
            {remainingStr.length > 0 ? '.' : ''}
            {remainingStr}
          </strong>
        )
      }
      return (
        <strong class={mainTextClass}>
          {prefix.value}
          {props.value}
        </strong>
      )
    })

    return {
      formatText
    }
  },
  render() {
    const colorClass = this.value === '0' ? 'text-grey5' : this.textColor
    return (
      <p class={`text-primary align-text-bottom ${this.plus ? 'pl-4' : ''} ${colorClass}`}>
        {this.formatText}
        {<span class={`text-[1rem] truncate ${this.unitClass}`}>{this.unit}</span>}
      </p>
    )
  }
})
