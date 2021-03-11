import List from './List'
import Item from './Item'

type ComponentType = typeof List

interface NavigatorsInstance extends ComponentType {
  Item: typeof Item
}

const Navigators = List as NavigatorsInstance
Navigators.Item = Item

export default Navigators
