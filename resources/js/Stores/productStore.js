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
    async fetchProductData(productId) {
        try {
            const response = await axios.get(`/products/${productId}`);
            runInAction(() => {
                this.setProductData(response.data.product);
                console.log("Product n a shot store quando dou fetch", response.data.product);

            });
        } catch (error) {
            console.error("Erro ao buscar os dados do produto:", error);
        }
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
                this.currentProduct = productData;
        });
    }

    updateProduct = async (storeId, productId, updatedData) => {
        console.log("Dados enviados para o backEnd",updatedData );
        if (!productId || !storeId) {
            console.error("ID da Store ou do Produto não encontrado!");
            return;
        }

        try {
            // Envia os dados para atualização via PATCH
            const response = await axios.put(`/stores/${storeId}/products/${productId}`, updatedData);


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

    deleteProduct = async (product) => {
        try {
            console.log("Enviando requisição DELETE para:", `/products/${product.id}`);
            await axios.delete(`/products/${product.id}`);

            // Remove localmente o produto da lista
            runInAction(() => {
                this.products = this.products.filter((p) => p.id !== product.id);
            });

            console.log("Produto apagado com sucesso!");
        } catch (error) {
            console.error("Erro ao apagar o produto:", error);
            throw error;
        }
    };


clearProductData(){
    runInAction(() =>{
        this.currentProduct = null;
        this.products = null;
        this.setProductData();
    })
}

}

export const productStore = new ProductStore();
