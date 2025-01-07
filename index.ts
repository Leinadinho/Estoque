import * as readlineSync from 'readline-sync';
import { EstoqueService } from './estoque/estoque.service';
import { Produto } from './estoque/produto.model';

const estoqueService = new EstoqueService();

async function adicionarProduto() {
    const nome = readlineSync.question('Digite o nome do produto: ');
    const valor = parseFloat(readlineSync.question('Digite o valor do produto: '));
    const peso = parseFloat(readlineSync.question('Digite o peso do produto (em kg): '));
    const quantidade = parseInt(readlineSync.question('Digite a quantidade do produto: '), 10);

    const produto: Produto = { nome, valor, peso, quantidade };

    try {
        await estoqueService.criar(produto);
        console.log('Produto adicionado com sucesso!');
    } catch (error) {
        console.error(error.message);
    }
}

async function removerProduto() {
    const nome = readlineSync.question('Digite o nome do produto que deseja remover: ');
    try {
        await estoqueService.removerProduto(nome);
    } catch (error) {
        console.error(error.message);
    }
}

async function listarProdutos() {
    const produtos = await estoqueService.listarProdutos();
    if (produtos.length === 0) {
        console.log('Nenhum produto encontrado.');
        return;
    }

    console.log('Produtos no estoque:');
    produtos.forEach(produto => {
        console.log(`${produto.nome} - R$${produto.valor} - ${produto.peso} kg - Quantidade: ${produto.quantidade}`);
    });
}

async function mostrarValorTotal() {
    const total = await estoqueService.calcularValorTotal();
    console.log(`Valor total do inventário: ${total}`);
}

async function mostrarPesoTotal() {
    const total = await estoqueService.calcularPesoTotal();
    console.log(`Peso total do inventário: ${total}`);
}

async function main() {
    while (true) {
        const opcao = readlineSync.question(
            'Escolha uma opção:\n1. Adicionar Produto\n2. Remover Produto\n3. Listar Produtos\n4. Ver Valor Total\n5. Ver Peso Total\n6. Sair\n'
        );

        switch (opcao) {
            case '1':
                await adicionarProduto();
                break;
            case '2':
                await removerProduto();
                break;
            case '3':
                await listarProdutos();
                break;
            case '4':
                await mostrarValorTotal();
                break;
            case '5':
                await mostrarPesoTotal();
                break;
            case '6':
                console.log('Saindo...');
                return;
            default:
                console.log('Opção inválida. Tente novamente.');
        }
    }
}

main();
