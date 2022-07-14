import { VectorFilled } from '@comunion/icons'
import { defineComponent } from 'vue'
import Bubble from './core'

// function normalMessage(obj: any) {
//   return (
//     <div class="flex flex-col flex-grow ml-5">
//       <div class="flex justify-between">
//         <p class="mb-2 u-title1">{obj.name}</p>
//         <div class="flex items-center">
//           <p class="text-14px text-grey3 mr-16px">{obj.time}</p>
//         </div>
//       </div>
//       <p class="bg-purple rounded-8px text-black mt-12px py-16px px-24px overflow-hidden">
//         Would like to help, I have a experience with frontend development.Would like to help, I have
//         a experience with frontend development.Would like to help, I have a experience . I have a
//         experience with frontend development.Would like to help, I have a experience I have a
//         experience with frontend development...
//       </p>
//     </div>
//   )
// }

function transactionMessage(obj: any) {
  return (
    <div class="flex flex-col flex-grow ml-5">
      <div class="flex justify-between">
        <p class="mb-2 u-title1">{obj.name}</p>
        <div class="flex items-center">
          <p class="text-14px text-grey3 mr-16px">{obj.time}</p>
        </div>
      </div>
      <p class="flex bg-purple rounded-8px text-black mt-12px py-16px px-24px overflow-hidden h-112px items-center">
        <div class="flex items-center">
          <div class="flex justify-center items-center rounded-20px w-40px h-40px bg-white">
            <VectorFilled />
          </div>
          <div class="flex flex-col ml-12px pr-20px border-r-1px border-solid border-grey5 h-64px justify-center">
            <p class="text-16px text-grey1">Send</p>
            <p class="text-14px text-grey3 mt-10px">May 26</p>
          </div>
        </div>
        <div class="flex flex-col ml-24px">
          <p class="text-16px text-grey1">100 USDC</p>
          <p class="text-14px text-grey1 mt-4px">Txn Hash：</p>
          <p class="text-14px text-primary mt-4px">
            0x5e6d2a17fcea9911395da84279d9a7e1fc859fb003cbd6843f18092acdc79252
          </p>
        </div>
      </p>
    </div>
  )
}

export default defineComponent({
  render() {
    return (
      <Bubble
        v-slots={{
          default: (obj: any) => (
            <>
              {/* {normalMessage(obj)} */}
              {transactionMessage(obj)}
            </>
          )
        }}
      />
    )
  }
})
