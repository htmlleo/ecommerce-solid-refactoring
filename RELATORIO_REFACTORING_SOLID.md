# Relatório de Refatoração e Princípios S.O.L.I.D.

## Alunos:
- Leonardo Estevão Alves - RA: 00250458-1
- Vinícius Eduardo Guimaraes dos Santos - RA: 247434-1

## Introdução
Este relatório detalha o processo de refatoração de um código legado TypeScript, simulando um sistema de e-commerce, com o objetivo de aplicar os cinco princípios S.O.L.I.D. (Single Responsibility Principle, Open/Closed Principle, Liskov Substitution Principle, Interface Segregation Principle e Dependency Inversion Principle). A refatoração visa melhorar a escalabilidade, testabilidade e manutenibilidade do sistema, que inicialmente apresentava alto acoplamento e rigidez.

## Contexto do Problema
O código original centralizava diversas responsabilidades em poucas estruturas, especialmente na classe `Pedido`. Isso resultava em um sistema difícil de modificar e propenso a erros, características comuns em códigos legados que violam os princípios de design de software.

## Refatoração Baseada nos Princípios S.O.L.I.D.

A seguir, detalhamos as mudanças arquiteturais realizadas para aderir a cada um dos princípios S.O.L.I.D., acompanhadas de justificativas.

### 1. Single Responsibility Principle (SRP) - Princípio da Responsabilidade Única

**Problema Original:** A classe `Pedido` era responsável por calcular descontos, calcular frete, salvar o pedido no banco de dados e enviar e-mails de confirmação. Isso significava que qualquer alteração em uma dessas funcionalidades exigiria modificação na classe `Pedido`, violando o SRP.

**Solução Aplicada:**
- **`EmailService`:** Criada uma classe dedicada para o envio de e-mails, isolando essa responsabilidade. Agora, a classe `Pedido` delega a tarefa de envio de e-mail a esta nova classe.
- **`OrderRepository`:** Criada uma classe para gerenciar a persistência do pedido no banco de dados. A classe `Pedido` agora utiliza este repositório para salvar seus dados, sem se preocupar com os detalhes de implementação do banco de dados.
- **`DiscountCalculator` e `IDiscountStrategy`:** A lógica de cálculo de desconto foi extraída para uma interface `IDiscountStrategy` e classes concretas (`VIPDiscount`, `StudentDiscount`, `NoDiscount`), gerenciadas por uma `DiscountCalculator`. Isso garante que a classe `Pedido` não precise saber como os descontos são calculados, apenas que eles podem ser aplicados.

**Justificativa:** Ao segregar as responsabilidades, cada classe agora tem apenas uma razão para mudar. Isso torna o código mais modular, fácil de entender, testar e manter. Alterações futuras em uma funcionalidade específica não afetarão outras partes do sistema.

### 2. Open/Closed Principle (OCP) - Princípio Aberto/Fechado

**Problema Original:** O método `calcularDesconto()` na classe `Pedido` utilizava uma série de `if-else if` para determinar o desconto com base no `tipoCliente`. A adição de um novo tipo de cliente exigiria a modificação direta deste método, violando o OCP.

**Solução Aplicada:**
- **`IDiscountStrategy` e Implementações Concretas:** Foi introduzida a interface `IDiscountStrategy` com o método `aplicarDesconto()`. Classes como `VIPDiscount`, `StudentDiscount` e `NoDiscount` implementam essa interface, encapsulando a lógica de desconto para cada tipo de cliente.
- **`DiscountCalculator`:** Esta classe recebe uma `IDiscountStrategy` via construtor (injeção de dependência), permitindo que o algoritmo de desconto seja alterado em tempo de execução sem modificar a `DiscountCalculator` ou a classe `Pedido`.

**Justificativa:** O sistema agora está **aberto para extensão** (novos tipos de desconto podem ser adicionados criando novas implementações de `IDiscountStrategy`) e **fechado para modificação** (a lógica existente de cálculo de desconto não precisa ser alterada). Isso promove a flexibilidade e reduz o risco de introduzir bugs em funcionalidades já existentes.

### 3. Liskov Substitution Principle (LSP) - Princípio da Substituição de Liskov

**Problema Original:** A classe `PedidoProdutoDigital` lançava uma exceção no método `calcularFrete()` e `imprimirEtiquetaFisica()`, herdados da classe `Pedido` e da interface `ITarefasPedido` (que será abordada no ISP). Isso quebrava o contrato estabelecido pela classe base, pois um `PedidoProdutoDigital` não poderia ser substituído por um `Pedido` sem causar comportamento inesperado.

**Solução Aplicada:**
- **Hierarquia de Interfaces e Composição:** Em vez de forçar `PedidoProdutoDigital` a herdar e lançar exceções para métodos irrelevantes, a lógica de frete e impressão de etiqueta foi segregada em interfaces específicas (`IFreightCalculator`, `IShippingLabelPrinter`).
- **Composição em vez de Herança Rígida:** As classes `PedidoProdutoFisico` e `PedidoProdutoDigital` agora compõem instâncias de `IFreightCalculator` e `IShippingLabelPrinter` (quando aplicável), em vez de herdar métodos que não fazem sentido para elas. A `DigitalProductFreightCalculator` retorna 0 para frete, indicando a ausência de custo, em vez de lançar uma exceção.

**Justificativa:** As classes filhas (`PedidoProdutoFisico`, `PedidoProdutoDigital`) agora podem substituir a classe pai (`Pedido`) e suas interfaces sem alterar o comportamento esperado do programa. Isso garante que o código que opera em instâncias da classe base ou de interfaces não seja surpreendido por exceções inesperadas ou comportamentos inconsistentes, promovendo a robustez do sistema.

### 4. Interface Segregation Principle (ISP) - Princípio da Segregação de Interfaces

**Problema Original:** A interface `ITarefasPedido` era muito abrangente, forçando classes como `PedidoProdutoDigital` a implementar métodos como `imprimirEtiquetaFisica()` que não eram relevantes para elas, resultando em implementações vazias ou que lançavam exceções.

**Solução Aplicada:**
- **Interfaces Menores e Mais Coesas:** A interface `ITarefasPedido` foi dividida em interfaces menores e mais específicas:
    - `IPaymentProcessor` (para processamento de pagamento)
    - `IInvoiceGenerator` (para geração de nota fiscal)
    - `IShippingLabelPrinter` (para impressão de etiqueta física)
    - `IFreightCalculator` (para cálculo de frete)

**Justificativa:** As classes agora implementam apenas as interfaces que realmente precisam. `PedidoProdutoDigital` implementa `IPaymentProcessor`, `IInvoiceGenerator` e `IFreightCalculator`, mas não `IShippingLabelPrinter`, pois produtos digitais não requerem etiquetas físicas. Isso evita que as classes sejam forçadas a depender de métodos que não utilizam, tornando as interfaces mais claras e o design mais flexível.

### 5. Dependency Inversion Principle (DIP) - Princípio da Inversão de Dependência

**Problema Original:** O método `salvarPedido()` na classe `Pedido` instanciava diretamente a classe concreta `BancoDeDadosMySQL`. Isso criava um acoplamento forte entre a lógica de negócio e uma implementação específica de banco de dados, dificultando a troca de banco de dados ou a realização de testes unitários.

**Solução Aplicada:**
- **Abstração `IDatabase`:** Foi introduzida a interface `IDatabase` com o método `salvar()`. A classe `MySQLDatabase` implementa esta interface.
- **Injeção de Dependência:** A classe `OrderRepository` (que agora lida com a persistência) recebe uma instância de `IDatabase` através de seu construtor. Da mesma forma, a classe `Pedido` recebe `OrderRepository`, `EmailService` e `DiscountCalculator` via injeção de dependência.

**Justificativa:** As classes de alto nível (`Pedido`, `OrderRepository`) agora dependem de abstrações (`IDatabase`, `EmailService`, `IDiscountStrategy`) e não de implementações concretas. Isso inverte a direção da dependência, tornando o sistema mais flexível, testável e fácil de estender. É possível trocar a implementação do banco de dados (por exemplo, para PostgreSQL ou MongoDB) sem modificar as classes de negócio, apenas fornecendo uma nova implementação de `IDatabase`.

## Conclusão

A aplicação dos princípios S.O.L.I.D. transformou o código legado em uma estrutura mais robusta, flexível e de fácil manutenção. Cada princípio abordou uma falha específica no design original, resultando em um sistema mais coeso e menos acoplado. As mudanças implementadas garantem que o sistema de e-commerce possa evoluir e se adaptar a novas funcionalidades e requisitos com muito mais facilidade no futuro.

## Referências
- [SOLID Principles - Wikipedia](https://en.wikipedia.org/wiki/SOLID)
- [Single-responsibility principle - Wikipedia](https://en.wikipedia.org/wiki/Single-responsibility_principle)
- [Open/closed principle - Wikipedia](https://en.wikipedia.org/wiki/Open/closed_principle)
- [Liskov substitution principle - Wikipedia](https://en.wikipedia.org/wiki/Liskov_substitution_principle)
- [Interface segregation principle - Wikipedia](https://en.wikipedia.org/wiki/Interface_segregation_principle)
- [Dependency inversion principle - Wikipedia](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
