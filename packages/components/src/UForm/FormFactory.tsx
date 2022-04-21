import { omitObject, effectiveUrlValidator, isValidAddress } from '@comunion/utils'
import type { FormProps, FormInst, FormItemRule } from 'naive-ui'
import { NForm, NFormItem, NInput } from 'naive-ui'
import type { DefineComponent, PropType, VNode } from 'vue'
import { defineComponent, ref, reactive, toRaw, computed } from 'vue'
import { UAddressInput, UAddressInputPropsType } from '../UInput'
import { USingleImageUpload, USingleImageUploadPropsType } from '../UUpload'
import { UInputPropsType, UHashInput, USelect, UButton, USelectPropsType } from '../index'
import type { ExtractPropTypes } from '../utils'
import './FormFactory.css'

export type FormFactoryInputField = {
  t?: 'string'
} & UInputPropsType

export type FormFactoryAddrssInputField = {
  t: 'address'
} & UAddressInputPropsType

export type FormFactoryWebsiteField = {
  t: 'website'
} & UInputPropsType

export type FormFactorySelectField = {
  t: 'select'
} & USelectPropsType

export type FormFactoryHashInputField = {
  t: 'hashInput'
  category: 'comerSkill' | 'startup' | 'bounty'
} & USelectPropsType

export type FormFactorySingleUploadField = {
  t: 'singleImageUpload'
} & USingleImageUploadPropsType

export type FormFactoryCustomField = {
  t: 'custom'
  render: () => VNode
}

export type FormFactoryField = {
  title: string
  name: string
  required?: boolean
  rules?: FormItemRule[]
} & (
  | FormFactoryInputField
  | FormFactoryAddrssInputField
  | FormFactoryWebsiteField
  | FormFactoryHashInputField
  | FormFactorySelectField
  | FormFactorySingleUploadField
  | FormFactoryCustomField
)

export type FormData = Record<string, any>

export const UFormFactoryProps = {
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
  onCancel: {
    type: Function as PropType<() => void>
  },
  initialValues: {
    type: Object as PropType<FormData>
  },
  // remove '' null undefined []
  removeNil: {
    type: Boolean,
    default: true
  }
} as const

export type UFormFactoryPropsType = ExtractPropTypes<typeof UFormFactoryProps> &
  Omit<FormProps, 'onSubmit'>

function renderField(field: FormFactoryField, values: FormData) {
  const props = omitObject(field, 'title', 'name', 'required', 't', 'rules')
  switch (field.t) {
    case 'website':
      return <NInput {...(props as UInputPropsType)} v-model:value={values[field.name]} clearable />
    case 'address':
      return (
        <UAddressInput {...(props as UAddressInputPropsType)} v-model:value={values[field.name]} />
      )
    case 'hashInput':
      return (
        <UHashInput
          {...(props as USelectPropsType & { category: 'comerSkill' | 'startup' | 'bounty' })}
          v-model:value={values[field.name]}
          clearable
        />
      )
    case 'select':
      return (
        <USelect {...(props as USelectPropsType)} v-model:value={values[field.name]} clearable />
      )
    case 'singleImageUpload':
      return (
        <USingleImageUpload
          {...(props as USingleImageUploadPropsType)}
          v-model:value={values[field.name]}
        />
      )
    default:
      return <NInput {...(props as UInputPropsType)} v-model:value={values[field.name]} />
  }
}

export const addressInputRule: FormItemRule = {
  validator: (rule, value) => (value ? isValidAddress(value) : true),
  message: 'Please enter a valid address',
  trigger: 'blur'
}

export const websiteInputRule: FormItemRule = {
  validator: (rule, value) => (value ? effectiveUrlValidator(value) : true),
  message: 'Please enter a valid url',
  trigger: 'blur'
}

export function getFieldsRules(fields: FormFactoryField[]) {
  return fields.reduce<Record<string, FormItemRule[]>>((acc, field) => {
    if (field.rules) {
      acc[field.name] = field.rules
    }
    acc[field.name] = acc[field.name] ?? []
    if (field.required) {
      acc[field.name].push({
        required: true,
        message: `${field.title} is required`,
        trigger: 'blur',
        type: field.t === 'hashInput' ? 'array' : field.rules?.[0]?.type ?? 'string'
      })
    }
    if (field.t === 'address') {
      acc[field.name].push(addressInputRule)
    } else if (field.t === 'website') {
      acc[field.name].push(websiteInputRule)
    }
    return acc
  }, {})
}

export const UFormItemsFactory = defineComponent({
  props: {
    fields: UFormFactoryProps.fields,
    values: {
      type: Object as PropType<Record<string, any>>,
      required: true
    }
  },
  setup(props) {
    return () => (
      <>
        {props.fields.map(field => {
          return (
            <NFormItem
              key={field.name}
              class="u-form-factory_item"
              label={field.title}
              path={field.name}
              required={field.required}
            >
              {renderField(field, props.values)}
            </NFormItem>
          )
        })}
      </>
    )
  }
})

export const UFormFactory: DefineComponent<UFormFactoryPropsType> = defineComponent({
  extends: NForm,
  name: 'UFormFactory',
  props: UFormFactoryProps,
  setup(props, ctx) {
    const formRef = ref<FormInst>()
    const formProps = omitObject(
      props,
      'fields',
      'onSubmit',
      'submitText',
      'showCancel',
      'cancelText',
      'initialValues'
    )
    const values = reactive(props.initialValues ?? {})

    const rules = computed(() => getFieldsRules(props.fields))

    const onSubmit = () => {
      formRef.value?.validate(errors => {
        if (!errors) {
          const _values = toRaw(values)
          if (props.removeNil) {
            Object.keys(_values).forEach(key => {
              if (
                _values[key] === '' ||
                _values[key] === null ||
                _values[key] === undefined ||
                (Array.isArray(_values[key]) && _values[key].length === 0)
              ) {
                delete _values[key]
              }
            })
          }
          props.onSubmit?.(_values)
        }
      })
    }

    return () => (
      <NForm {...formProps} model={values} rules={rules.value} ref={formRef}>
        <UFormItemsFactory fields={props.fields} values={values} />
        <div class="flex justify-end">
          {props.showCancel && (
            <UButton type="default" class="mr-4" onClick={props.onCancel}>
              {props.cancelText}
            </UButton>
          )}
          <UButton type="primary" onClick={onSubmit}>
            {props.submitText}
          </UButton>
        </div>
        {ctx.slots.default?.()}
      </NForm>
    )
  }
})
