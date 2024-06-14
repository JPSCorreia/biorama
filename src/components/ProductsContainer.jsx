import { observer } from 'mobx-react';

import ProductList from './ProductList.jsx';

const ProductsContainer = observer(() => {
    return <>
        <h1>Produtos</h1>
        <ProductList />
    </>;
});

export default ProductsContainer;
