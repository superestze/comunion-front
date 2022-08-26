import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UCard,
  UForm,
  UFormItemsFactory
} from '@comunion/components'
import { defineComponent, ref, reactive, watch, nextTick } from 'vue'
import { btnGroup } from '../btnGroup'
import Edit from '../edit'
import More from '@/components/More/shadow'
import { services } from '@/services'

export default defineComponent({
  props: {
    content: {
      type: String,
      default: () => '',
      required: true
    },
    view: {
      type: Boolean,
      default: () => false
    }
  },
  emits: ['Done'],
  setup(props, ctx) {
    const editMode = ref<boolean>(false)

    const pRef = ref<any>()
    const showMoreBtn = ref<boolean>()

    const info = reactive({
      bio: ''
    })

    watch(
      () => props.content,
      () => {
        info.bio = props.content
        nextTick().then(() => {
          if (pRef.value && pRef.value.clientHeight >= 164) {
            showMoreBtn.value = true
          } else {
            showMoreBtn.value = false
          }
        })
      },
      {
        immediate: true
      }
    )

    const fold = ref<boolean>(true)

    const form = ref<FormInst>()

    const fields: FormFactoryField[] = [
      {
        title: 'Bio',
        name: 'bio',
        type: 'textarea',
        placeholder: 'Tell the world your story',
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
    const handleSubmit = async () => {
      if (this.info.bio.trim() !== '') {
        await services['account@update-bio']({
          bio: this.info.bio
        })
        this.$emit('Done')
        handleEditMode()
        return
      }
    }
    return (
      <>
        {this.view && this.content.trim() === '' ? null : (
          <UCard
            title="BIO"
            class="mb-6"
            v-slots={{
              'header-extra': () => {
                if (this.editMode) {
                  return
                } else if (this.view) {
                  return
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
                {this.content.trim() === '' ? (
                  <p class="text-14px font-[400] text-grey4 mt-6">Edit your Bio</p>
                ) : (
                  <>
                    <div
                      ref={(ref: any) => (this.pRef = ref)}
                      class="overflow-hidden transition-all duration-1000 ease-linear"
                      style={this.fold ? { maxHeight: '164px' } : { height: 'auto' }}
                    >
                      <p v-html={this.content} />
                    </div>
                    {this.showMoreBtn && (
                      <div class="flex justify-center mt-5">
                        <More onMore={handleMore} fold={this.fold} />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </UCard>
        )}
      </>
    )
  }
})
