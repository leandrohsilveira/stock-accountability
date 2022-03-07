import acoes from './acoes.json'

const acoesOrdenadas = acoes.sort(
    (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
)

const acoesComTotais = acoesOrdenadas.map(acao => ({
    ...acao,
    total: acao.qtd * acao.precoUnitario
}))

const acoesComCustoMedio = acoesComTotais.map(
    (acao, indice) => {
        if (acao.tipo === 'COMPRA') {
            const acoesAnteriores = acoesComTotais.slice(0, indice + 1)
            .filter(a => (a.id === acao.id && acao.tipo === 'COMPRA'))
            const acumulado = acoesAnteriores.reduce((acc, a) => acc + a.total, 0)
            const qtds = acoesAnteriores.reduce((acc, a) => acc + a.qtd, 0)
            return {
                ...acao,
                custoMedio: acumulado / qtds
            }
        }
        return acao
    }
)

const acoesComLucro = acoesComCustoMedio.map(
    (acao, indice) => {
        if (acao.tipo === 'VENDA') {
            const acoesAnteriores: any = acoesComCustoMedio.slice(0, indice + 1)
                .filter(a => (a.id === acao.id && a.tipo === 'COMPRA'))
            return {
                ...acao,
                lucro: acao.total - (acoesAnteriores.at(0)?.custoMedio ?? 0)
            }
        }
        return acao
    }
)

console.table(acoesComLucro)