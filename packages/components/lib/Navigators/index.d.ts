import List from './List';
import Item from './Item';
declare type ComponentType = typeof List;
interface NavigatorsInstance extends ComponentType {
    Item: typeof Item;
}
declare const Navigators: NavigatorsInstance;
export default Navigators;
