# TODO

## Lista de requerimentos/funcionalidades a implementar

### Funcionalidades

- Criar componentes de Perfil e Gestão de Perfil.

- Criar gestão de conta(é diferente de perfil?).
  
- Criar componente para encomenda e lista de encomendas e funcionalidade.

- Criar componente para morada e lista de moradas.

- Criar componente para categorias de produtos e funcionalidade para listar todos os produtos dessa categoria.

- Criar funcionalidade para adicionar um produto novo á base de dados e fazer upload a uma imagem para esse produto.

- Criar funcionalidade para utilizador se registar como vendedor.

- Criar funcionalidade para vendedor poder criar uma nova loja.

- Criar funcionalidade para vendedor poder editar as suas lojas.

- Criar componente para loja, lista de lojas tanto para browse a lojas como para o vendedor fazer gestão das suas lojas.

- Criar funcionalidade para Search(por produto, loja, vendedor ou por local).

- Criar componente para contactos.

- Fazer um componente para homepage.

- Modificar lista de produtos mostrar as colunas correctas e para poder adicionar mais do que um produto de cada vez ao carrinho(ter em conta como vamos fazer para produtos que sao vendidos á unidade vs produtos que sao vendido ao quilo).

- Mostrar e dar acesso a diferentes tipos de componentes quando o utilizador está logged in vs quando não está e ter em conta se é vendedor ou não(Protected Routes do auth0-react).

- Funcionalidade para vendedor adicionar e editar produtos que vende em cada loja.

- Funcionalidade para poder fazer browse ás lojas de um certo vendedor.

- Funcionalidade para um vendedor poder apagar a sua loja(e ter em conta que temos de apagar todos os produtos dessa loja)

- Fazer form checking para introdução de dados(formik? se não tiver obsoleto).

- Thumbnails para produtos e lojas(?).

- Dividir os componentes em sub componentes se fizer sentido(reutilização noutros componentes).

- Criar diferentes stores para cada funcionalidade que necessita.

- Adicionar funcionalidade  do cliente pedir dados ao servidor e guardar em store.

- Outras diversas funcionalidades para cada componente.

### Material UI

- Adicionar Skeleton placeholder para quando a data tiver a fazer load(para os componentes do tipo tabela, etc).

- Adicionar CircularProgress placeholder para quando a página tiver a fazer load(para os componentes container).

- Lazy loading(?)
  
- Adicionar Alert components quando produtos forem adicionados ao carrinho, uma encomenda for feita, etc...

- Talvez Backdrop quando for feita uma encomenda ou o utilizador tiver a adicionar uma morada.

- Breadcrumbs(secalhar com icons) para por exemplo num produto voltar para a lista de produtos ou para search(se tiver vindo do search), encomenda voltar para lista de encomendas etc.

- Stepper componentes para encomendas? ou outro tipo de setups.

- talvez Image list com title bars para categorias de produtos? ou até para os proprios produtos ou lojas?

- Adicionar componentes Rating aos produtos e vendedores.

### Auth

- Criar uma conta no Auth0.
  
- Fazer implementação no React(componentes wrappers).

- Utilizar alguns plugins para google, instagram, github, talvez outros, e testar.
  
- Permitir registo e login por email.

- Criar alguns utilizadores para teste.

### Servidor / API

- Compreender como criar um servidor em Laravel, fazer bootstrap ao projecto e criar repositorio no GitHub.
  
- Compreender como trabalha e depois fazer setup ao Inertia.js.

- Fazer as routes e queries SQL.

- Fazer verificação de dados antes de introduzir na base de dados.

- Segurança a nivel de proteção contra diversos tipos de ataques.

- Certificar que servidor e cliente funciona a nivel de CORS.

### DevOps

- Criar base de dados para development com mock data.

- Alterar estrutura das directorias (talvez criar pastas para cada tipo de funcionalidade).

- Fazer um setup para dev(talvez docker image com base de dados mysql).
  
- Criar .env files para dev e production, criar logica para aplicação saber se está em production ou dev.
  
- Desligar console logging.
  
- Fazer Host ao Cliente, Servidor e Base de dados(vercel?).

### Documentação

- Fazer documento PDF com requerimentos, objectivos etc da aplicação.
- Fazer documentação da API (com as routes)(?).

### Testes

- Unit tests com o Jest á API(?).

### Responsive Design

- Implementar responsive design para telemovel e tablet, desde regras para mobile a componentes diferentes se for preciso.

### Mobile App

- Criar aplicação Android com React Native(?).
