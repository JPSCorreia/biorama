export const user = [
    { user_id: 1, first_name: "João", last_name: "Silva", email: "joao.silva@exemplo.com", deleted: 0 },
    { user_id: 2, first_name: "Maria", last_name: "Ferreira", email: "maria.ferreira@exemplo.com", deleted: 0 },
    { user_id: 3, first_name: "António", last_name: "Costa", email: "antonio.costa@exemplo.com", deleted: 0 },
    { user_id: 4, first_name: "Ana", last_name: "Pereira", email: "ana.pereira@exemplo.com", deleted: 0 },
    { user_id: 5, first_name: "Carlos", last_name: "Rodrigues", email: "carlos.rodrigues@exemplo.com", deleted: 0 },
  ];
  
  export const home_address = [
    { home_address_id: 1, user_id: 1, address_name: "Casa", first_name: "João", last_name: "Silva", phone_number: "912345678", street_address: "Rua das Flores, 123", postal_code: "1234-567", city: "Lisboa", comment: "N/A" },
    { home_address_id: 2, user_id: 2, address_name: "Casa", first_name: "Maria", last_name: "Ferreira", phone_number: "923456789", street_address: "Rua dos Pinheiros, 456", postal_code: "2345-678", city: "Porto", comment: "N/A" },
    { home_address_id: 3, user_id: 3, address_name: "Casa", first_name: "António", last_name: "Costa", phone_number: "934567890", street_address: "Rua das Oliveiras, 789", postal_code: "3456-789", city: "Coimbra", comment: "N/A" },
    { home_address_id: 4, user_id: 4, address_name: "Casa", first_name: "Ana", last_name: "Pereira", phone_number: "945678901", street_address: "Rua dos Castanheiros, 101", postal_code: "4567-890", city: "Braga", comment: "N/A" },
    { home_address_id: 5, user_id: 5, address_name: "Casa", first_name: "Carlos", last_name: "Rodrigues", phone_number: "956789012", street_address: "Rua dos Sobreiros, 202", postal_code: "5678-901", city: "Faro", comment: "N/A" },
  ];
  
  export const order = [
    { order_id: 1, user_id: 1, store_id: 1, status_id: 1, street_address: "Rua das Flores, 123", postal_code: "1234-567", city: "Lisboa", created: "2024-06-24T12:34:56Z", comment: "Primeira encomenda" },
    { order_id: 2, user_id: 2, store_id: 2, status_id: 2, street_address: "Rua dos Pinheiros, 456", postal_code: "2345-678", city: "Porto", created: "2024-06-24T12:34:56Z", comment: "Segunda encomenda" },
    { order_id: 3, user_id: 3, store_id: 1, status_id: 1, street_address: "Rua das Oliveiras, 789", postal_code: "3456-789", city: "Coimbra", created: "2024-06-24T12:34:56Z", comment: "Terceira encomenda" },
    { order_id: 4, user_id: 4, store_id: 3, status_id: 2, street_address: "Rua dos Castanheiros, 101", postal_code: "4567-890", city: "Braga", created: "2024-06-24T12:34:56Z", comment: "Quarta encomenda" },
    { order_id: 5, user_id: 5, store_id: 2, status_id: 1, street_address: "Rua dos Sobreiros, 202", postal_code: "5678-901", city: "Faro", created: "2024-06-24T12:34:56Z", comment: "Quinta encomenda" },
  ];
  
  export const status = [
    { status_id: 1, name: "A Aguardar Pagamento" },
    { status_id: 2, name: "Em Processamento" },
    { status_id: 3, name: "Enviado" },
    { status_id: 4, name: "Entregue" },
    { status_id: 5, name: "Cancelado" },
  ];
  
  export const order_product = [
    { order_id: 1, product_id: 1, price: 19.99, discount: 0, quantity: 1 },
    { order_id: 2, product_id: 2, price: 29.99, discount: 5, quantity: 2 },
    { order_id: 3, product_id: 3, price: 39.99, discount: 0, quantity: 1 },
    { order_id: 4, product_id: 4, price: 49.99, discount: 10, quantity: 3 },
    { order_id: 5, product_id: 5, price: 59.99, discount: 15, quantity: 1 },
  ];
  
  export const product = [
    { product_id: 1, store_id: 1, product_name: "Tomates Biológicos", description: "Tomates frescos e biológicos", discount: 0, price: 19.99, image_link: "http://example.com/tomates.jpg", is_unit: 1 },
    { product_id: 2, store_id: 2, product_name: "Alfaces Orgânicas", description: "Alfaces crocantes e orgânicas", discount: 5, price: 29.99, image_link: "http://example.com/alfaces.jpg", is_unit: 1 },
    { product_id: 3, store_id: 1, product_name: "Cenouras Naturais", description: "Cenouras doces e naturais", discount: 0, price: 39.99, image_link: "http://example.com/cenouras.jpg", is_unit: 1 },
    { product_id: 4, store_id: 3, product_name: "Batatas Ecológicas", description: "Batatas saborosas e ecológicas", discount: 10, price: 49.99, image_link: "http://example.com/batatas.jpg", is_unit: 1 },
    { product_id: 5, store_id: 2, product_name: "Pepinos Frescos", description: "Pepinos crocantes e frescos", discount: 15, price: 59.99, image_link: "http://example.com/pepinos.jpg", is_unit: 1 },
  ];
  
  export const product_review = [
    { product_review_id: 1, user_id: 1, product_id: 1, rating: 5, comment: "Produto excelente!", created: "2024-06-24T12:34:56Z" },
    { product_review_id: 2, user_id: 2, product_id: 2, rating: 4, comment: "Muito bom!", created: "2024-06-24T12:34:56Z" },
    { product_review_id: 3, user_id: 3, product_id: 3, rating: 3, comment: "Produto satisfatório", created: "2024-06-24T12:34:56Z" },
    { product_review_id: 4, user_id: 4, product_id: 4, rating: 2, comment: "Abaixo do esperado", created: "2024-06-24T12:34:56Z" },
    { product_review_id: 5, user_id: 5, product_id: 5, rating: 1, comment: "Muito fraco", created: "2024-06-24T12:34:56Z" },
  ];
  
  export const product_category = [
    { product_id: 1, category_id: 1 },
    { product_id: 2, category_id: 2 },
    { product_id: 3, category_id: 1 },
    { product_id: 4, category_id: 3 },
    { product_id: 5, category_id: 2 },
  ];
  
  export const category = [
    { category_id: 1, name: "Produtos Biológicos" },
    { category_id: 2, name: "Legumes" },
    { category_id: 3, name: "Frutas" },
  ];
  
  export const product_gallery = [
    { product_gallery_id: 1, product_id: 1, image_link: "http://example.com/tomates1.jpg" },
    { product_gallery_id: 2, product_id: 1, image_link: "http://example.com/tomates2.jpg" },
    { product_gallery_id: 3, product_id: 2, image_link: "http://example.com/alfaces1.jpg" },
    { product_gallery_id: 4, product_id: 3, image_link: "http://example.com/cenouras1.jpg" },
    { product_gallery_id: 5, product_id: 4, image_link: "http://example.com/batatas1.jpg" },
  ];
  
  export const store = [
    { store_id: 1, vendor_id: 1, store_name: "Loja Verde", store_phone: "212345678", email: "lojaverde@exemplo.com", description: "Loja de produtos biológicos e sustentáveis", profile_picture_link: "http://example.com/lojaverde.jpg", street_address: "Rua do Mercado, 10", postal_code: "1000-200", city: "Lisboa", deleted: 0 },
    { store_id: 2, vendor_id: 2, store_name: "Horta Bio", store_phone: "223456789", email: "hortabio@exemplo.com", description: "Produtos frescos e orgânicos", profile_picture_link: "http://example.com/hortabio.jpg", street_address: "Rua das Hortas, 20", postal_code: "2000-300", city: "Porto", deleted: 0 },
    { store_id: 3, vendor_id: 1, store_name: "Eco Frutas", store_phone: "234567890", email: "ecofrutas@exemplo.com", description: "Frutas ecológicas e sustentáveis", profile_picture_link: "http://example.com/ecofrutas.jpg", street_address: "Rua das Árvores, 30", postal_code: "3000-400", city: "Coimbra", deleted: 0 },
  ];
  
  export const store_gallery = [
    { store_gallery_id: 1, store_id: 1, image_link: "http://example.com/lojaverde1.jpg" },
    { store_gallery_id: 2, store_id: 2, image_link: "http://example.com/hortabio1.jpg" },
    { store_gallery_id: 3, store_id: 3, image_link: "http://example.com/ecofrutas1.jpg" },
  ];
  
  export const store_review = [
    { store_review_id: 1, user_id: 1, store_id: 1, rating: 5, comment: "Ótima loja!", created: "2024-06-24T12:34:56Z" },
    { store_review_id: 2, user_id: 2, store_id: 2, rating: 4, comment: "Boa loja!", created: "2024-06-24T12:34:56Z" },
    { store_review_id: 3, user_id: 3, store_id: 1, rating: 3, comment: "Loja mediana", created: "2024-06-24T12:34:56Z" },
  ];
  
  export const vendor = [
    { vendor_id: 1, user_id: 1, nif: "123456789", deleted: 0 },
    { vendor_id: 2, user_id: 2, nif: "234567890", deleted: 0 },
  ];