import { defineComponent, ref } from 'vue'
import { ModuleTags } from '@/components/Tags'

export default defineComponent({
  props: {
    startupId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const tasks = ref(['All', 'Bounty', 'Crowdfunding', 'Governance', 'Other dapp'])

    return {
      tasks
    }
  },
  emits: ['selectedTagChange'],
  render() {
    const handleSelectedChange = (selectedList: string[]) => {
      this.$emit('selectedTagChange', selectedList)
    }
    return (
      <div class="bg-white border rounded-lg mb-6 p-6 relative overflow-hidden">
        <ModuleTags tasks={this.tasks} onSelectedChange={handleSelectedChange} />
      </div>
    )
  }
})
