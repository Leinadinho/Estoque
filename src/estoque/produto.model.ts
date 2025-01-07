export interface Produto {
    nome: string;
    valor: number;
    peso: number;
    quantidade: number;
    removido?: boolean; // remoção
}
