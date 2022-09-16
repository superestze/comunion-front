import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    value: {
      type: String,
      default: () => '0'
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
  setup(props) {
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

    const formatText = computed(() => {
      let remainingStr = ''
      if (props.digit > props.value.length) {
        const remaining = props.digit - props.value.length
        remainingStr = new Array(remaining).fill('0').join('')
      }
      return (
        // text-warning
        <strong
          class="font-primary leading-none px-1 text-9 truncate relative"
          style={{ fontSize: `${props.enhance}px` }}
        >
          {prefix.value}
          {props.value}
          {remainingStr.length ? '.' : ''}
          {remainingStr}
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
