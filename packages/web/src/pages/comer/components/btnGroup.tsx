import { UButton } from '@comunion/components'

type FnParam = () => void

export function btnGroup(cancel: FnParam, submit: FnParam) {
  return (
    <div class="flex justify-end mt-8">
      <UButton class="mr-4 w-30" type="default" onClick={cancel} size="small">
        cancel
      </UButton>
      <UButton class="w-30" type="primary" onClick={submit} size="small">
        update
      </UButton>
    </div>
  )
}
