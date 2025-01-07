import * as fs from 'fs';
import { Produto } from './produto.model';
import { writeCSV } from './writeCSV';

export class EstoqueService {
    private filePath: string = './data/estoque.csv';

    public async listarProdutos(): Promise<Produto[]> {
        if (!fs.existsSync(this.filePath)) {
            return [];
        }

        const conteudo = fs.readFileSync(this.filePath, 'utf-8');
        const linhas = conteudo.split('\n').slice(1).filter(linha => linha.trim() !== '');

        return linhas.map(linha => {
            const [nome, valor, peso, quantidade, removido] = linha.split(',');
            return {
                nome,
                valor: parseFloat(valor),
                peso: parseFloat(peso),
                quantidade: parseInt(quantidade, 10),
                removido: removido === '1' ? true : false,
            };
        }).filter(produto => !produto.removido);
    }

    public async criar(data: Produto): Promise<void> {
        const produtos = await this.listarProdutos();
        const produtoExistente = produtos.find(p => p.nome === data.nome);

        if (produtoExistente) {
            throw new Error(`Produto com o nome "${data.nome}" já existe no estoque.`);
        }

        if (typeof data.nome !== 'string' || isNaN(data.valor) || isNaN(data.peso) || isNaN(data.quantidade)) {
            throw new Error('Dados inválidos para o produto.');
        }

        await writeCSV(this.filePath, [...produtos, data]);
    }

    public async removerProduto(nomeProduto: string): Promise<void> {
        const produtos = await this.listarProdutos();
        const produtoIndex = produtos.findIndex(p => p.nome === nomeProduto);

        if (produtoIndex === -1) {
            throw new Error(`Produto com nome "${nomeProduto}" não encontrado.`);
        }

        const produto = produtos[produtoIndex];
        const confirmacao = prompt(`Você tem certeza que deseja remover o produto ${produto.nome}? (S/N):`);

        if (confirmacao.toUpperCase() === 'S') {
            produto.removido = true;
            await writeCSV(this.filePath, produtos);
            console.log('Produto removido com sucesso.');
        }
    }

    public async calcularValorTotal(): Promise<string> {
        const produtos = await this.listarProdutos();
        const total = produtos.reduce((acc, produto) => acc + (produto.valor * produto.quantidade), 0);
        return `R$${total.toFixed(2)}`;
    }

    public async calcularPesoTotal(): Promise<string> {
        const produtos = await this.listarProdutos();
        const totalPeso = produtos.reduce((acc, produto) => acc + (produto.peso * produto.quantidade), 0);
        return `${totalPeso.toFixed(2)} kg`;
    }

    public async calcularQuantidadeTotal(): Promise<number> {
        const produtos = await this.listarProdutos();
        return produtos.reduce((acc, produto) => acc + produto.quantidade, 0);
    }
}
