import type { FormProps, InputProps, FormInst } from 'naive-ui'
import { NInput } from 'naive-ui'
import { NForm, NFormItem } from 'naive-ui'
import type { ExtractPropTypes, PropType } from 'vue'
import { ref, toRaw } from 'vue'
import { reactive } from 'vue'
import { defineComponent } from 'vue'
import { omitObject } from '@comunion/utils'
import './FormFactory.css'
import UButton from '../UButton'

export type FormFactoryInputField = {
  t?: 'string'
} & InputProps

export type FormFactoryWebsiteField = {
  t: 'website'
} & InputProps

export type FormFactoryHashInputField = {
  t: 'hashInput'
} & InputProps

export type FormFactoryField = {
  title: string
  name: string
  required?: boolean
} & (FormFactoryInputField | FormFactoryWebsiteField | FormFactoryHashInputField)

export type FormData = Record<string, any>

export const UFormFactoryPropsObj = {
  fields: {
    type: Array as PropType<FormFactoryField[]>,
    required: true
  },
  onSubmit: {
    type: Function as PropType<(values: FormData) => void>
  },
  submitText: {
    type: String,
    default: 'Submit'
  },
  showCancel: {
    type: Boolean,
    default: false
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  initialValues: {
    type: Object as PropType<FormData>
  }
} as const

export type UFormFactoryProps = ExtractPropTypes<typeof UFormFactoryPropsObj> & FormProps

function renderField(field: FormFactoryField) {
  const props = omitObject(field, ['title', 'name', 'required', 't'])
  switch (field.t) {
    case 'website':
      return <NInput {...props} size="large" />
    case 'hashInput':
      return <NInput type="text" {...props} size="large" />
    default:
      return <NInput {...props} size="large" />
  }
}

const UFormFactory = defineComponent({
  extends: NForm,
  name: 'UFormFactory',
  props: UFormFactoryPropsObj,
  setup(props, ctx) {
    const formRef = ref<FormInst>()
    const formProps = omitObject(props, [
      'fields',
      'onSubmit',
      'submitText',
      'showCancel',
      'cancelText',
      'initialValues'
    ])
    const values = reactive(props.initialValues ?? {})

    const onSubmit = () => {
      formRef.value?.validate(errors => {
        if (!errors) {
          props.onSubmit(toRaw(values))
        }
      })
    }

    return () => (
      <NForm {...formProps} model={values} ref={formRef}>
        {props.fields.map(field => {
          return (
            <NFormItem
              key={field.name}
              class="u-form-factory_item"
              label={field.title}
              path={field.name}
              required={field.required}
            >
              {renderField(field)}
            </NFormItem>
          )
        })}
        <div class="flex justify-end">
          {props.showCancel && (
            <UButton type="default" size="large" class="mr-4" onClick={props.onCancel}>
              {props.cancelText}
            </UButton>
          )}
          <UButton type="primary" size="large" onClick={onSubmit}>
            {props.submitText}
          </UButton>
        </div>
        {ctx.slots.default?.()}
      </NForm>
    )
  }
})

export default UFormFactory
