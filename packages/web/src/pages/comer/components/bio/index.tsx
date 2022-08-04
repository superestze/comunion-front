import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UCard,
  UForm,
  UFormItemsFactory
} from '@comunion/components'
import { defineComponent, ref, onMounted, reactive, watchEffect } from 'vue'
import { btnGroup } from '../btnGroup'
import Edit from '../edit'
import More from '@/components/More/shadow'

export default defineComponent({
  props: {
    content: {
      type: String,
      default: () => '',
      required: true
    }
  },
  setup(props) {
    const editMode = ref<boolean>(false)

    const pRef = ref<any>()
    const showMoreBtn = ref<boolean>()

    onMounted(() => {
      setTimeout(() => {
        if (pRef.value.scrollHeight > 164) {
          showMoreBtn.value = true
        }
      }, 1000)
    })

    const fold = ref<boolean>(true)
    const info = reactive({
      bio: ''
    })

    watchEffect(() => {
      info.bio = props.content
    })

    const form = ref<FormInst>()

    const fields: FormFactoryField[] = [
      {
        title: 'Bio',
        name: 'bio',
        required: true,
        type: 'textarea',
        placeholder: 'Tell us about yourself, at least 100 characters',
        minlength: 100,
        rules: [{ min: 100, message: 'Tell us about yourself, at least 100 characters' }],
        // @ts-ignore
        autosize: {
          minRows: 5,
          maxRows: 10
        }
      }
    ]
    return {
      editMode,
      pRef,
      showMoreBtn,
      fold,
      fields,
      form,
      info
    }
  },
  render() {
    const rules = getFieldsRules(this.fields)
    const handleEditMode = () => {
      this.editMode = !this.editMode
    }
    const handleMore = () => {
      this.fold = !this.fold
    }
    const handleSubmit = () => {
      this.form?.validate(err => {
        if (typeof err === 'undefined') {
          console.log(this.info.bio)
        }
      })
    }
    return (
      <UCard
        title="BIO"
        class="mb-6"
        v-slots={{
          'header-extra': () => {
            if (this.editMode) {
              return <span></span>
            }
            return <Edit onHandleClick={handleEditMode} />
          }
        }}
      >
        {this.editMode ? (
          <div class="flex flex-col mt-6">
            <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
              <UFormItemsFactory fields={this.fields} values={this.info} />
            </UForm>
            {btnGroup(handleEditMode, handleSubmit)}
          </div>
        ) : (
          <>
            <div
              class="overflow-hidden transition-all duration-1000 ease-linear"
              style={{ height: this.fold ? '164px' : 'auto' }}
            >
              <p ref={(ref: any) => (this.pRef = ref)} v-html={this.content} />
            </div>
            {this.showMoreBtn && (
              <div class="flex justify-center mt-5">
                <More onMore={handleMore} fold={this.fold} />
              </div>
            )}
          </>
        )}
      </UCard>
    )
  }
})
