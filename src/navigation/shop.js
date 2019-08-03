import {createMaterialTopTabNavigator} from 'react-navigation';
import ProductList from '../screens/Shop/ProductList';
import Info from '../screens/Shop/Info';
import BlogList from '../screens/Shop/BlogList';

export default createMaterialTopTabNavigator({
    ProductList,
    Info,
    BlogList,
});