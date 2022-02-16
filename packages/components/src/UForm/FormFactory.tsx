import type { FormProps, InputProps } from 'naive-ui'
// import { NForm } from 'naive-ui'
import type { ComponentObjectPropsOptions, PropType } from 'vue'
import { defineComponent } from 'vue'

export type InputField = {
  type?: 'string'
} & InputProps

export type WebsiteField = {
  type: 'website'
}

export type HashInputField = {
  type: 'hashInput'
}

export const UFormFactoryProps: ComponentObjectPropsOptions = {
  form: {
    type: Object as PropType<FormProps>
  },
  fields: {
    type: Array as PropType<
      ({
        title: string
        name: string
        required?: boolean
      } & (InputField | WebsiteField | HashInputField))[]
    >,
    required: true
  },
  onSubmit: {
    type: Function as PropType<(values: Record<string, any>) => void>
  }
}

const UFormFactory = defineComponent({
  name: 'UFormFactory',
  props: UFormFactoryProps,
  setup(props, ctx) {
    return () => ctx.slots.default?.()
    // <NForm {...props.form}>
    //   {props.fields.map(field => {
    //     return (
    //       <NForm.Item
    //         key={field.name}
    //         label={field.title}
    //         name={field.name}
    //         required={field.required}
    //       >
    //         {field.type === 'string' && <NForm.Input {...field} />}
    //         {field.type === 'website' && <NForm.Input {...field} />}
    //         {field.type === 'hashInput' && <NForm.Input {...field} />}
    //       </NForm.Item>
    //     )
    //   })}
    //   {ctx.slots.default?.()}
    // </NForm>
  }
})

export default UFormFactory
