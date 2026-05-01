# Refatoração de Sistema E-commerce com Princípios S.O.L.I.D.

## Visão Geral do Projeto
Este projeto consiste na refatoração de um sistema legado de e-commerce, originalmente desenvolvido em TypeScript, com o objetivo de aplicar e demonstrar os cinco princípios S.O.L.I.D. (Single Responsibility Principle, Open/Closed Principle, Liskov Substitution Principle, Interface Segregation Principle e Dependency Inversion Principle). O código original apresentava alto acoplamento e baixa manutenibilidade, e a refatoração buscou transformá-lo em uma arquitetura mais robusta, flexível e escalável.

## Alunos
- **Leonardo Estevão Alves** - RA: 00250458-1
- **Vinícius Eduardo Guimaraes dos Santos** - RA: 247434-1

## Tecnologias Utilizadas
- **TypeScript**: Linguagem de programação principal.
- **Node.js**: Ambiente de execução para o TypeScript.
- **Git/GitHub**: Controle de versão e hospedagem do código.

## Princípios S.O.L.I.D. Aplicados

### 1. Single Responsibility Principle (SRP)
- **Antes**: A classe `Pedido` acumulava responsabilidades de cálculo, persistência e notificação.
- **Depois**: Responsabilidades foram segregadas em classes como `EmailService` (envio de e-mails), `OrderRepository` (persistência de pedidos) e `DiscountCalculator` (cálculo de descontos), garantindo que cada classe tenha apenas uma razão para mudar.

### 2. Open/Closed Principle (OCP)
- **Antes**: A lógica de desconto em `Pedido` exigia modificação direta para novos tipos de cliente.
- **Depois**: Introdução da interface `IDiscountStrategy` e implementações concretas (`VIPDiscount`, `StudentDiscount`, `NoDiscount`). A `DiscountCalculator` utiliza essas estratégias, permitindo a adição de novos descontos sem modificar o código existente.

### 3. Liskov Substitution Principle (LSP)
- **Antes**: `PedidoProdutoDigital` lançava exceções para métodos de frete e etiqueta, quebrando o contrato da classe base.
- **Depois**: A hierarquia foi reestruturada com interfaces mais específicas (`IFreightCalculator`, `IShippingLabelPrinter`) e composição. `PedidoProdutoDigital` agora retorna 0 para frete, em vez de lançar uma exceção, mantendo a consistência comportamental.

### 4. Interface Segregation Principle (ISP)
- **Antes**: A interface `ITarefasPedido` era muito genérica, forçando classes a implementar métodos irrelevantes.
- **Depois**: `ITarefasPedido` foi dividida em interfaces menores e mais coesas (`IPaymentProcessor`, `IInvoiceGenerator`, `IShippingLabelPrinter`, `IFreightCalculator`), permitindo que as classes implementem apenas o que realmente precisam.

### 5. Dependency Inversion Principle (DIP)
- **Antes**: `Pedido` dependia diretamente da implementação concreta `BancoDeDadosMySQL`.
- **Depois**: Introdução da abstração `IDatabase`. `OrderRepository` (e, por extensão, `Pedido`) agora depende da abstração `IDatabase`, e a implementação concreta (`MySQLDatabase`) é injetada, desacoplando o código de alto nível das implementações de baixo nível.

## Como Executar o Código

Para executar o exemplo de código refatorado:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/htmlleo/ecommerce-solid-refactoring.git
    cd ecommerce-solid-refactoring
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Compile o código TypeScript:**
    ```bash
    npx tsc
    ```

4.  **Execute o código JavaScript compilado:**
    ```bash
    node dist/index.js
    ```

Você verá a saída no console demonstrando o funcionamento dos pedidos com os princípios SOLID aplicados.

## Relatório Detalhado
Para uma análise mais aprofundada das mudanças e justificativas arquiteturais, consulte o arquivo `RELATORIO_REFACTORING_SOLID.md` presente neste repositório.
