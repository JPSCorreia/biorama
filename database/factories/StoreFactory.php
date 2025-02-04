<?php

namespace Database\Factories;

use App\Models\Store;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;

class StoreFactory extends Factory
{
    protected $model = Store::class;

    public function definition()
    {
        setlocale(LC_ALL, 'pt_PT.UTF-8'); // Forçar UTF-8 para o Faker
        mb_internal_encoding("UTF-8"); // Garantir que a codificação interna é UTF-8

        $vendor_id = Vendor::all()->random()->id;

        $storeType = $this->faker->randomElement([
            'Mercearia Biológica',
            'Moda Sustentável',
            'Cosméticos Naturais',
            'Casa e Decoração Ecológica'
        ]);

        $descriptions = [
            'Mercearia Biológica' => [
                "A nossa mercearia biológica é mais do que um simples mercado. Aqui, cada produto é cuidadosamente selecionado para garantir que vem diretamente de agricultores e produtores locais que seguem práticas sustentáveis. Acreditamos que a alimentação saudável começa com ingredientes naturais, livres de químicos artificiais e cultivados de forma ética. Trabalhamos com uma rede de fornecedores que partilham o nosso compromisso com a qualidade, o sabor e a frescura.",
                "Oferecemos uma vasta gama de produtos biológicos, desde frutas e vegetais frescos a leguminosas, frutos secos, cereais e snacks saudáveis. Além disso, disponibilizamos uma seleção de produtos a granel para reduzir o desperdício de embalagens e promover um consumo mais consciente. Com cada compra, está a apoiar a economia local e a adotar um estilo de vida mais equilibrado e sustentável.",
                "A nossa missão é tornar os produtos biológicos acessíveis a todos, sem comprometer a qualidade. Para além da alimentação, disponibilizamos bebidas naturais, produtos sem glúten e opções para dietas específicas. Visite-nos e descubra como uma alimentação mais saudável pode ser deliciosa e responsável ao mesmo tempo! 🌿"
            ],
            'Moda Sustentável' => [
                "Na nossa loja de moda sustentável, acreditamos que a beleza e o respeito pelo planeta podem andar de mãos dadas. Cada peça da nossa coleção é produzida de forma ética, utilizando materiais ecológicos como algodão orgânico, linho, bambu e tecidos reciclados. Procuramos alternativas que minimizem o impacto ambiental, garantindo que cada peça de roupa reflete um compromisso com a sustentabilidade.",
                "Trabalhamos apenas com marcas e artesãos que seguem práticas responsáveis, garantindo que todas as etapas do processo de fabrico – desde a obtenção das matérias-primas até à produção final – respeitam as pessoas e o meio ambiente. As nossas roupas são desenhadas para serem duráveis, versáteis e atemporais, permitindo que os nossos clientes façam escolhas mais conscientes e reduzam o desperdício.",
                "Além da moda feminina e masculina, disponibilizamos acessórios ecológicos, como carteiras feitas de materiais reciclados, calçado sustentável e até roupa desportiva eco-friendly. Ao escolher a nossa loja, está a apoiar um futuro mais justo e ecológico. Vista-se com propósito e faça parte da mudança para um mundo mais sustentável. 🌎"
            ],
            'Cosméticos Naturais' => [
                "A nossa loja de cosméticos naturais nasceu da paixão por cuidar da pele de forma saudável e responsável. Todos os nossos produtos são formulados com ingredientes 100% naturais, livres de parabenos, silicones, sulfatos e químicos agressivos. Valorizamos a pureza e a eficácia dos extratos vegetais, óleos essenciais e minerais que respeitam o equilíbrio natural da pele.",
                "Desde cremes hidratantes a champôs sólidos, óleos essenciais e maquilhagem ecológica, oferecemos uma vasta gama de produtos cruelty-free, vegan e livres de plástico desnecessário. Acreditamos que cada escolha faz a diferença, por isso trabalhamos apenas com marcas que garantem transparência e responsabilidade ambiental na produção dos seus cosméticos.",
                "Para além dos produtos de cuidado diário, temos uma linha de aromaterapia e bem-estar, incluindo velas naturais e difusores de óleos essenciais. Oferecemos ainda embalagens reutilizáveis e soluções zero desperdício para um consumo mais responsável. Cuide da sua pele e do planeta com a nossa seleção exclusiva de produtos naturais. 🍃"
            ],
            'Casa e Decoração Ecológica' => [
                "Transforme a sua casa num espaço mais sustentável com a nossa coleção de produtos ecológicos para o lar. Acreditamos que cada pequeno gesto conta, e é por isso que oferecemos alternativas sustentáveis para a sua rotina diária. Desde utensílios biodegradáveis a móveis feitos com materiais reciclados, cada peça é selecionada para reduzir o impacto ambiental e promover um estilo de vida mais verde.",
                "Trabalhamos com artesãos e designers locais para trazer soluções inovadoras, práticas e esteticamente apelativas. A nossa gama inclui velas naturais, tecidos orgânicos, decoração sustentável e até produtos de limpeza ecológicos, garantindo que pode criar um ambiente harmonioso e eco-friendly sem abdicar da qualidade e do design.",
                "Além da decoração, disponibilizamos produtos de organização sustentável, como caixas e cestos feitos de fibras naturais, soluções de armazenamento sem plástico e alternativas biodegradáveis para o dia a dia. Junte-se a nós nesta jornada por um lar mais consciente. Descubra como pequenos detalhes podem fazer uma grande diferença na sua pegada ecológica e inspire-se para viver de forma mais sustentável. 🏡"
            ]
        ];


        return [
            'vendor_id' => $vendor_id,
            'name' => $this->faker->unique()->company(),
            'phone_number' => $this->faker->numerify('#########'),
            'email' => $this->faker->unique()->safeEmail(),
            'description' => mb_convert_encoding(implode("\n\n", [
                "🌱 **{$storeType}**",
                $this->faker->randomElement($descriptions[$storeType]),
                "📦 Encomende já e faça parte do movimento sustentável. Juntos, construímos um futuro mais verde! 🍃"
            ]), 'UTF-8', 'auto'),
            'rating' => $this->faker->randomFloat(2, 0, 5),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
