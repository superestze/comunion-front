import {
  UDrawer,
  createFormFields,
  UForm,
  UInput,
  UFormItem,
  UInputGroup,
  UButton
} from '@comunion/components'
import type { FormInst } from '@comunion/components'
import { CloseOutlined, PlusOutlined, TipOutlined } from '@comunion/icons'
import { defineComponent, ref, reactive } from 'vue'
import type { PropType, VNode } from 'vue'

const CreateStartupBlock = defineComponent({
  name: 'CreateStartupBlock',
  props: {
    trigger: {
      type: Object as PropType<VNode>
    }
  },
  setup(props, ctx) {
    const defaultModel = {
      logo: '',
      name: '',
      type: '',
      tags: [] as string[],
      mission: '',
      overview: '',
      tokenContract: '',
      composes: [
        {
          name: '',
          address: ''
        }
      ]
    }
    const defaultTokenInfo = {
      name: '',
      symbol: '',
      supply: null as number | null,
      liquidity: null as number | null,
      txns: null as number | null,
      holders: null as number | null
    }
    const formRef = ref<FormInst>()
    const show = ref(false)
    const loading = ref(false)
    const model = reactive({
      ...{
        ...defaultModel,
        composes: [...defaultModel.composes]
      }
    })

    const tokenInfo = reactive({ ...defaultTokenInfo })

    if (props.trigger) {
      props.trigger.props.onClick = () => {
        show.value = true
      }
    }

    const infoForm = createFormFields(
      [
        {
          t: 'string',
          title: 'Name',
          name: 'name',
          required: true,
          placeholder: 'Please enter your startup name',
          maxlength: 24
        },
        {
          t: 'select',
          title: 'type',
          name: 'type',
          required: true,
          placeholder: 'Startup type',
          options: [
            {
              label: 'ESG',
              value: 'ESG'
            },
            {
              label: 'NGO',
              value: 'NGO'
            },
            {
              label: 'DAO',
              value: 'DAO'
            },
            {
              label: 'COM',
              value: 'COM'
            }
          ]
        },
        {
          t: 'hashInput',
          required: true,
          title: 'Hashtag',
          category: 'startup',
          name: 'hashtag',
          placeholder: '#Enter you startup tag'
        },
        {
          t: 'string',
          title: 'Mission',
          name: 'mission',
          placeholder: 'Please enter your startup mission',
          maxlength: 100,
          required: true
        },
        {
          t: 'string',
          title: 'Overview',
          name: 'overview',
          placeholder: 'Describe your startup',
          minlength: 100,
          required: true,
          type: 'textarea',
          rules: [
            {
              required: true,
              message: 'Please enter a description of at least 100 letters'
            }
          ]
        }
      ],
      model
    )

    function addCompose() {
      model.composes.push({
        name: '',
        address: ''
      })
    }

    function removeCompose(index: number) {
      model.composes.splice(index, 1)
    }

    function onCancel() {
      Object.assign(model, {
        ...{
          ...defaultModel,
          composes: [...defaultModel.composes]
        }
      })
      Object.assign(tokenInfo, { ...defaultTokenInfo })
      show.value = false
    }

    function onSubmit() {
      formRef.value.validate(async error => {
        if (!error) {
          loading.value = true
          try {
            // const data = await createStartup(model)
            onCancel()

            // ctx.emit('success', data)
          } catch (e) {
            ctx.emit('error', e)
          } finally {
            loading.value = false
          }
        }
      })
    }

    return () => (
      <>
        {props.trigger}
        <UDrawer title="Create startup" v-model:show={show.value}>
          <UForm ref={formRef.value} rules={{ ...infoForm.rules.value }}>
            <p class="mb-7 u-card-title1">INFO SETTING</p>
            {infoForm.items}
            <div class="bg-purple h-13px my-8"></div>
            <p class="mb-7 uppercase u-card-title1">Finance Setting</p>
            <ul class="border rounded-lg list-disc border-grey5 mb-6 p-4 pl-8 text-body1 relative">
              <li>Firstly，the token must be bound to the Start-Up as Proof-of-Stake.</li>
              <li>A token can only be bound to one Startup and can’t be changed after bound.</li>
              <li>If you have not a token yet， use Erc20-Generator to create your token.</li>
              <div class="flex text-primary right-4 bottom-4 absolute items-center">
                How to Set
                <TipOutlined class="ml-1" />
              </div>
            </ul>
            <UFormItem label="Token Contract" required path="tokenContract">
              <UInput
                placeholder="Please enter your token contract address"
                v-model:value={model.tokenContract}
              />
            </UFormItem>
            <div class="border rounded-lg border-grey5 mb-2 grid py-4.5 px-4 text-body2 gap-x-2 gap-y-4 grid-cols-2">
              <div class="flex items-center">
                <span class="w-36">TOKEN NAME:</span>
                <span>{tokenInfo.name || '--'}</span>
              </div>
              <div class="flex items-center">
                <span class="w-36">Total Liquidity:</span>
                <span>{tokenInfo.liquidity || '--'}</span>
              </div>
              <div class="flex items-center">
                <span class="w-36">TOKEN SYMBOL:</span>
                <span>{tokenInfo.symbol || '--'}</span>
              </div>
              <div class="flex items-center">
                <span class="w-36">Total Txns:</span>
                <span>{tokenInfo.txns || '--'}</span>
              </div>
              <div class="flex items-center">
                <span class="w-36">TOTAL SUPPLY:</span>
                <span>{tokenInfo.supply || '--'}</span>
              </div>
              <div class="flex items-center">
                <span class="w-36">Holders:</span>
                <span>{tokenInfo.holders || '--'}</span>
              </div>
            </div>
            <UFormItem
              label="Wallet Compose"
              required
              rule={[{ required: true, type: 'array', min: 1 }]}
              path="composes"
            >
              <div class="w-full">
                {model.composes.map((compose, index) => (
                  <div class="flex mb-6 w-full items-center">
                    <UInputGroup key={index} class="flex w-full">
                      <UInput
                        v-model:value={compose.name}
                        class="!w-50"
                        placeholder="Wallet name"
                      />
                      <UInput
                        v-model:value={compose.address}
                        class="flex-1"
                        placeholder="Please entre wallet address"
                      />
                    </UInputGroup>
                    {model.composes.length > 1 && (
                      <CloseOutlined
                        class="cursor-pointer ml-4 text-grey3 hover:text-primary"
                        onClick={() => removeCompose(index)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </UFormItem>
            <UButton text onClick={addCompose} type="primary">
              <PlusOutlined class="mr-2" />
              ADD ANOTHER WALLET
            </UButton>
            <div class="flex mt-16 items-center justify-end">
              <UButton type="default" size="large" class="mr-4 w-41" onClick={onCancel}>
                Cancel
              </UButton>
              <UButton
                type="primary"
                size="large"
                class="w-41"
                loading={loading.value}
                onClick={onSubmit}
              >
                Submit
              </UButton>
            </div>
            <div class="mt-6 text-grey3 u-caption">
              When you click submit button，you have entered all informations of start-up that will
              be submited to Blockchain . It's similar to how you register a company in the Trade
              and Industry Bureau，meanwhile you have builded your start-up in blockchain with zero
              cost and much more efficient.
            </div>
          </UForm>
        </UDrawer>
      </>
    )
  }
})

export default CreateStartupBlock
