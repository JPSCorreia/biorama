import {AddProductCreate} from './';
import {observer} from "mobx-react";
import {vendorRegistrationStore} from "../Stores";
import {VendorRegistrationProductCard} from "./";

const Step3CreateProduct = observer(() => {
    // Verifica se existem produtos
    const hasProducts = vendorRegistrationStore.products.length > 0;

    return (
        <div
            className={`flex ${hasProducts ? "justify-between" : "justify-center"} items-center w-full`}
        >
            {/* Card de adicionar produto */}
            <AddProductCreate />

            {/* Produtos, somente se houver algum */}
            {/*{hasProducts && (*/}
            {/*    <div className="flex flex-wrap gap-4">*/}
            {/*        {vendorRegistrationStore.products.map((product) => (*/}
            {/*            <VendorRegistrationProductCard key={product.id} product={product} />*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
});

export default Step3CreateProduct;
