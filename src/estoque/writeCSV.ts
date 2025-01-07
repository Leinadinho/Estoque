import * as fs from 'fs';
import { Produto } from './produto.model';

export async function writeCSV(filepath: string, produtos: Produto[]): Promise<void> {
    const header = "nome,valor,peso,quantidade,removido\n";
    const data = produtos.map(produto => `${produto.nome},${produto.valor},${produto.peso},${produto.quantidade},${produto.removido ? 1 : 0}`).join("\n");

    fs.writeFileSync(filepath, header + data, 'utf-8');
}
