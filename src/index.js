"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MySQLDatabase {
    salvar(dados) {
        console.log("Salvando dados no MySQL: ", dados);
    }
}
// 2. Single Responsibility Principle (SRP) - Serviço de E-mail
class EmailService {
    enviarEmailConfirmacao(email, pedido) {
        console.log(`Enviando e-mail de confirmação para ${email} sobre o pedido: `, pedido);
    }
}
// 3. Single Responsibility Principle (SRP) - Repositório de Pedidos
class OrderRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    salvarPedido(pedido) {
        this.db.salvar(pedido);
    }
}
class VIPDiscount {
    aplicarDesconto(valorTotal) {
        return valorTotal * 0.20;
    }
}
class StudentDiscount {
    aplicarDesconto(valorTotal) {
        return valorTotal * 0.10;
    }
}
class NoDiscount {
    aplicarDesconto(valorTotal) {
        return 0;
    }
}
// 5. Single Responsibility Principle (SRP) - Calculadora de Desconto
class DiscountCalculator {
    discountStrategy;
    constructor(discountStrategy) {
        this.discountStrategy = discountStrategy;
    }
    calcularDesconto(valorTotal) {
        return this.discountStrategy.aplicarDesconto(valorTotal);
    }
}
// 7. Classe Pedido Refatorada
class Pedido {
    valorTotal;
    tipoCliente;
    orderRepository;
    emailService;
    discountCalculator;
    constructor(valorTotal, tipoCliente, orderRepository, emailService, discountCalculator) {
        this.valorTotal = valorTotal;
        this.tipoCliente = tipoCliente;
        this.orderRepository = orderRepository;
        this.emailService = emailService;
        this.discountCalculator = discountCalculator;
    }
    getValorTotalComDesconto() {
        return this.valorTotal - this.discountCalculator.calcularDesconto(this.valorTotal);
    }
    salvar() {
        this.orderRepository.salvarPedido(this);
    }
    enviarConfirmacao(email) {
        this.emailService.enviarEmailConfirmacao(email, this);
    }
}
// 8. Implementações específicas para produtos físicos
class PhysicalProductFreightCalculator {
    calcularFrete() {
        return 15.0;
    }
}
class PhysicalProductShippingLabelPrinter {
    imprimirEtiquetaFisica() {
        console.log("Etiqueta física impressa para produto físico.");
    }
}
// 9. Implementações específicas para produtos digitais
class DigitalProductFreightCalculator {
    calcularFrete() {
        // Produtos digitais não possuem frete, retorna 0 ou lança erro se for um caso inválido para o contexto
        return 0;
    }
}
// 10. Pedido de Produto Físico
class PedidoProdutoFisico extends Pedido {
    freightCalculator;
    shippingLabelPrinter;
    constructor(valorTotal, tipoCliente, orderRepository, emailService, discountCalculator, freightCalculator, shippingLabelPrinter) {
        super(valorTotal, tipoCliente, orderRepository, emailService, discountCalculator);
        this.freightCalculator = freightCalculator;
        this.shippingLabelPrinter = shippingLabelPrinter;
    }
    processarPagamento() {
        console.log("Pagamento processado para produto físico.");
    }
    gerarNotaFiscal() {
        console.log("Nota fiscal gerada para produto físico.");
    }
    calcularFrete() {
        return this.freightCalculator.calcularFrete();
    }
    imprimirEtiquetaFisica() {
        this.shippingLabelPrinter.imprimirEtiquetaFisica();
    }
}
// 11. Pedido de Produto Digital
class PedidoProdutoDigital extends Pedido {
    freightCalculator;
    constructor(valorTotal, tipoCliente, orderRepository, emailService, discountCalculator, freightCalculator) {
        super(valorTotal, tipoCliente, orderRepository, emailService, discountCalculator);
        this.freightCalculator = freightCalculator;
    }
    processarPagamento() {
        console.log("Pagamento processado online para produto digital.");
    }
    gerarNotaFiscal() {
        console.log("Nota fiscal digital gerada para produto digital.");
    }
    calcularFrete() {
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
const pedidoFisicoVIP = new PedidoProdutoFisico(1000, "VIP", orderRepo, emailSvc, discountCalcVIP, physicalFreightCalculator, physicalShippingLabelPrinter);
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
const pedidoDigitalEstudante = new PedidoProdutoDigital(200, "ESTUDANTE", orderRepo, emailSvc, discountCalcStudent, digitalFreightCalculator);
pedidoDigitalEstudante.processarPagamento();
pedidoDigitalEstudante.gerarNotaFiscal();
pedidoDigitalEstudante.salvar();
pedidoDigitalEstudante.enviarConfirmacao("estudante@example.com");
console.log("Valor total do pedido digital ESTUDANTE com desconto: ", pedidoDigitalEstudante.getValorTotalComDesconto());
console.log("Frete do pedido digital ESTUDANTE: ", pedidoDigitalEstudante.calcularFrete());
console.log("\n-----------------------------------\n");
// Pedido NORMAL de produto físico
const discountCalcNormal = new DiscountCalculator(noDiscount);
const pedidoFisicoNormal = new PedidoProdutoFisico(500, "NORMAL", orderRepo, emailSvc, discountCalcNormal, physicalFreightCalculator, physicalShippingLabelPrinter);
pedidoFisicoNormal.processarPagamento();
pedidoFisicoNormal.gerarNotaFiscal();
pedidoFisicoNormal.imprimirEtiquetaFisica();
pedidoFisicoNormal.salvar();
pedidoFisicoNormal.enviarConfirmacao("normal@example.com");
console.log("Valor total do pedido físico NORMAL com desconto: ", pedidoFisicoNormal.getValorTotalComDesconto());
console.log("Frete do pedido físico NORMAL: ", pedidoFisicoNormal.calcularFrete());
//# sourceMappingURL=index.js.map