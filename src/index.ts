
// 1. Dependency Inversion Principle (DIP) - Abstração para Banco de Dados
interface IDatabase {
    salvar(dados: any): void;
}

class MySQLDatabase implements IDatabase {
    salvar(dados: any): void {
        console.log("Salvando dados no MySQL: ", dados);
    }
}

// 2. Single Responsibility Principle (SRP) - Serviço de E-mail
class EmailService {
    enviarEmailConfirmacao(email: string, pedido: any): void {
        console.log(`Enviando e-mail de confirmação para ${email} sobre o pedido: `, pedido);
    }
}

// 3. Single Responsibility Principle (SRP) - Repositório de Pedidos
class OrderRepository {
    private db: IDatabase;

    constructor(db: IDatabase) {
        this.db = db;
    }

    salvarPedido(pedido: any): void {
        this.db.salvar(pedido);
    }
}

// 4. Open/Closed Principle (OCP) - Estratégia de Desconto
interface IDiscountStrategy {
    aplicarDesconto(valorTotal: number): number;
}

class VIPDiscount implements IDiscountStrategy {
    aplicarDesconto(valorTotal: number): number {
        return valorTotal * 0.20;
    }
}

class StudentDiscount implements IDiscountStrategy {
    aplicarDesconto(valorTotal: number): number {
        return valorTotal * 0.10;
    }
}

class NoDiscount implements IDiscountStrategy {
    aplicarDesconto(valorTotal: number): number {
        return 0;
    }
}

// 5. Single Responsibility Principle (SRP) - Calculadora de Desconto
class DiscountCalculator {
    private discountStrategy: IDiscountStrategy;

    constructor(discountStrategy: IDiscountStrategy) {
        this.discountStrategy = discountStrategy;
    }

    calcularDesconto(valorTotal: number): number {
        return this.discountStrategy.aplicarDesconto(valorTotal);
    }
}

// 6. Liskov Substitution Principle (LSP) & Interface Segregation Principle (ISP) - Interfaces de Tarefas do Pedido
interface IPaymentProcessor {
    processarPagamento(): void;
}

interface IInvoiceGenerator {
    gerarNotaFiscal(): void;
}

interface IShippingLabelPrinter {
    imprimirEtiquetaFisica(): void;
}

interface IFreightCalculator {
    calcularFrete(): number;
}

// 7. Classe Pedido Refatorada
class Pedido {
    public valorTotal: number;
    public tipoCliente: string;
    private orderRepository: OrderRepository;
    private emailService: EmailService;
    private discountCalculator: DiscountCalculator;

    constructor(
        valorTotal: number,
        tipoCliente: string,
        orderRepository: OrderRepository,
        emailService: EmailService,
        discountCalculator: DiscountCalculator
    ) {
        this.valorTotal = valorTotal;
        this.tipoCliente = tipoCliente;
        this.orderRepository = orderRepository;
        this.emailService = emailService;
        this.discountCalculator = discountCalculator;
    }

    getValorTotalComDesconto(): number {
        return this.valorTotal - this.discountCalculator.calcularDesconto(this.valorTotal);
    }

    salvar(): void {
        this.orderRepository.salvarPedido(this);
    }

    enviarConfirmacao(email: string): void {
        this.emailService.enviarEmailConfirmacao(email, this);
    }
}

// 8. Implementações específicas para produtos físicos
class PhysicalProductFreightCalculator implements IFreightCalculator {
    calcularFrete(): number {
        return 15.0;
    }
}

class PhysicalProductShippingLabelPrinter implements IShippingLabelPrinter {
    imprimirEtiquetaFisica(): void {
        console.log("Etiqueta física impressa para produto físico.");
    }
}

// 9. Implementações específicas para produtos digitais
class DigitalProductFreightCalculator implements IFreightCalculator {
    calcularFrete(): number {
        // Produtos digitais não possuem frete, retorna 0 ou lança erro se for um caso inválido para o contexto
        return 0; 
    }
}

// 10. Pedido de Produto Físico
class PedidoProdutoFisico extends Pedido implements IPaymentProcessor, IInvoiceGenerator, IFreightCalculator, IShippingLabelPrinter {
    private freightCalculator: IFreightCalculator;
    private shippingLabelPrinter: IShippingLabelPrinter;

    constructor(
        valorTotal: number,
        tipoCliente: string,
        orderRepository: OrderRepository,
        emailService: EmailService,
        discountCalculator: DiscountCalculator,
        freightCalculator: IFreightCalculator,
        shippingLabelPrinter: IShippingLabelPrinter
    ) {
        super(valorTotal, tipoCliente, orderRepository, emailService, discountCalculator);
        this.freightCalculator = freightCalculator;
        this.shippingLabelPrinter = shippingLabelPrinter;
    }

    processarPagamento(): void {
        console.log("Pagamento processado para produto físico.");
    }

    gerarNotaFiscal(): void {
        console.log("Nota fiscal gerada para produto físico.");
    }

    calcularFrete(): number {
        return this.freightCalculator.calcularFrete();
    }

    imprimirEtiquetaFisica(): void {
        this.shippingLabelPrinter.imprimirEtiquetaFisica();
    }
}

// 11. Pedido de Produto Digital
class PedidoProdutoDigital extends Pedido implements IPaymentProcessor, IInvoiceGenerator, IFreightCalculator {
    private freightCalculator: IFreightCalculator;

    constructor(
        valorTotal: number,
        tipoCliente: string,
        orderRepository: OrderRepository,
        emailService: EmailService,
        discountCalculator: DiscountCalculator,
        freightCalculator: IFreightCalculator
    ) {
        super(valorTotal, tipoCliente, orderRepository, emailService, discountCalculator);
        this.freightCalculator = freightCalculator;
    }

    processarPagamento(): void {
        console.log("Pagamento processado online para produto digital.");
    }

    gerarNotaFiscal(): void {
        console.log("Nota fiscal digital gerada para produto digital.");
    }

    calcularFrete(): number {
        return this.freightCalculator.calcularFrete();
    }
}

// Exemplo de uso:
const mysqlDb = new MySQLDatabase();
const orderRepo = new OrderRepository(mysqlDb);
const emailSvc = new EmailService();

// Descontos
const vipDiscount = new VIPDiscount();
const studentDiscount = new StudentDiscount();
const noDiscount = new NoDiscount();

// Calculadoras de frete
const physicalFreightCalculator = new PhysicalProductFreightCalculator();
const digitalFreightCalculator = new DigitalProductFreightCalculator();

// Impressora de etiqueta
const physicalShippingLabelPrinter = new PhysicalProductShippingLabelPrinter();

// Pedido VIP de produto físico
const discountCalcVIP = new DiscountCalculator(vipDiscount);
const pedidoFisicoVIP = new PedidoProdutoFisico(
    1000,
    "VIP",
    orderRepo,
    emailSvc,
    discountCalcVIP,
    physicalFreightCalculator,
    physicalShippingLabelPrinter
);
pedidoFisicoVIP.processarPagamento();
pedidoFisicoVIP.gerarNotaFiscal();
pedidoFisicoVIP.imprimirEtiquetaFisica();
pedidoFisicoVIP.salvar();
pedidoFisicoVIP.enviarConfirmacao("vip@example.com");
console.log("Valor total do pedido físico VIP com desconto: ", pedidoFisicoVIP.getValorTotalComDesconto());
console.log("Frete do pedido físico VIP: ", pedidoFisicoVIP.calcularFrete());

console.log("\n-----------------------------------\n");

// Pedido ESTUDANTE de produto digital
const discountCalcStudent = new DiscountCalculator(studentDiscount);
const pedidoDigitalEstudante = new PedidoProdutoDigital(
    200,
    "ESTUDANTE",
    orderRepo,
    emailSvc,
    discountCalcStudent,
    digitalFreightCalculator
);
pedidoDigitalEstudante.processarPagamento();
pedidoDigitalEstudante.gerarNotaFiscal();
pedidoDigitalEstudante.salvar();
pedidoDigitalEstudante.enviarConfirmacao("estudante@example.com");
console.log("Valor total do pedido digital ESTUDANTE com desconto: ", pedidoDigitalEstudante.getValorTotalComDesconto());
console.log("Frete do pedido digital ESTUDANTE: ", pedidoDigitalEstudante.calcularFrete());

console.log("\n-----------------------------------\n");

// Pedido NORMAL de produto físico
const discountCalcNormal = new DiscountCalculator(noDiscount);
const pedidoFisicoNormal = new PedidoProdutoFisico(
    500,
    "NORMAL",
    orderRepo,
    emailSvc,
    discountCalcNormal,
    physicalFreightCalculator,
    physicalShippingLabelPrinter
);
pedidoFisicoNormal.processarPagamento();
pedidoFisicoNormal.gerarNotaFiscal();
pedidoFisicoNormal.imprimirEtiquetaFisica();
pedidoFisicoNormal.salvar();
pedidoFisicoNormal.enviarConfirmacao("normal@example.com");
console.log("Valor total do pedido físico NORMAL com desconto: ", pedidoFisicoNormal.getValorTotalComDesconto());
console.log("Frete do pedido físico NORMAL: ", pedidoFisicoNormal.calcularFrete());
