import {action, makeObservable, observable, runInAction} from "mobx";
import axios from "axios";
import {makePersistable} from "mobx-persist-store";

class ProductStore{
    products= [];
    currentProduct =null;

    constructor() {
        makeObservable(this, {
            products: observable,
            currentProduct:observable,
        });
        makePersistable(this,{
            name: "ProductStore",
            properties: ["products", "currentProduct",],
            storage: window.sessionStorage,
        })
    }
    setProdutsData(productsData){
        runInAction(() =>{
            if (!this.products  ) {
                this.products = productsData;
            }
        });
    }
    setProductData(productData){
        runInAction(() =>{
            if (!this.currentProduct  ) {
                this.currentProduct = productData;
            }
        });
    }

    updateProduct = async (productId, updatedData) => {
        if (!productId) {
            console.error("ID da Store ou do Produto não encontrado!");
            return;
        }

        try {
            // Envia os dados para atualização via PATCH
            const response = await axios.put(`/stores/products/${productId}`, updatedData);

            // Atualiza os dados do produto localmente
            runInAction(() => {
                Object.keys(response.data.product).forEach((key) => {
                    this.currentProduct[key] = response.data.product[key];
                });
            });

            console.log("Produto atualizado com sucesso:", response.data);
            console.log("Produto atualizado localmente:", this.currentProduct);
        } catch (error) {
            console.error("Erro ao atualizar os dados do Produto!", error);
        }
    };


}

export const productStore = new ProductStore();
