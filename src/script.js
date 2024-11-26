    /* Ínicio extra */

    // Formatar CPF
    document.getElementById('CPF').addEventListener('input', function (e) {
        let cpf = e.target.value.replace(/\D/g, ''); 
        if (cpf.length > 11) { 
            cpf = cpf.substring(0, 11);
        }

        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')
                 .replace(/(\d{3})(\d)/, '$1.$2')
                 .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = cpf;
    });


    // Função para calcular idade a partir da data de nascimento
function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}


    // Formatar o número para reais
function formatarParaReais(input) {
    let valor = input.value.replace(/\D/g, ''); 
    valor = (parseInt(valor) / 100).toFixed(2); 

    let formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    input.value = formatador.format(valor);

    verificarEntradaMenorQueValorTotal();
    
}

['valorTotal', 'entrada'].forEach(id => {
    document.getElementById(id).addEventListener('input', function() {
        formatarParaReais(this);
    });
});

document.getElementById('parcelas').addEventListener('keypress', apenasNumeros);
document.getElementById('juros').addEventListener('keypress', apenasNumeros);
document.getElementById('anoModelo').addEventListener('input', function (e) {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 4) {
        valor = valor.substring(0, 4);
    }
    e.target.value = valor;
});

document.getElementById('nome').addEventListener('input', function (e) {
    e.target.value = e.target.value.replace(/[0-9]/g, '');
});



    // Verificar se o valor total é menor do que a entrada
function verificarEntradaMenorQueValorTotal() {
    const valorTotal = parseFloat(document.getElementById('valorTotal').value.replace(/\D/g, '')) / 100;
    const entrada = parseFloat(document.getElementById('entrada').value.replace(/\D/g, '')) / 100;

    if (entrada > valorTotal) {
        document.getElementById('entrada').setCustomValidity("A entrada deve ser menor ou igual ao valor total.");
    } else {
        document.getElementById('entrada').setCustomValidity("");
    }
}

    // Não permitir que o usuário digite letras apenas números
function apenasNumeros(event) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode === 46 && event.target.id === 'juros') return true; 
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
    }
}

// Adicionando funcionalidade ao botão "Voltar"
document.getElementById('voltar').addEventListener('click', function () {
    document.getElementById('dados-pessoais').style.display = 'block';
    document.getElementById('dados-veiculo').style.display = 'none';
});



    /* Extra fim */


    // Ínicio do Simulador De Financiamento
document.addEventListener('DOMContentLoaded', function () {
    const formDadosPessoais = document.getElementById('dados-pessoais');
    const formDadosVeiculo = document.getElementById('dados-veiculo');
    const resultadoSimulacao = document.getElementById('resultado-simulacao');

    // Exibir apenas o formulário de dados pessoais
    formDadosPessoais.style.display = 'block';
    formDadosVeiculo.style.display = 'none';
    resultadoSimulacao.style.display = 'none';

    // Gerenciar o clique no botão "Continuar" dos dados pessoais
    formDadosPessoais.addEventListener('submit', function (e) {
        e.preventDefault(); 
        formDadosPessoais.style.display = 'none'; 
        formDadosVeiculo.style.display = 'block';
    });

    // Gerenciar o clique no botão "Continuar" dos dados do veículo
    formDadosVeiculo.addEventListener('submit', function (e) {
        e.preventDefault();

        // Simulação de resultados
        const valorTotal = parseFloat(document.getElementById('valorTotal').value.replace(/\D/g, '')) / 100;
        const entrada = parseFloat(document.getElementById('entrada').value.replace(/\D/g, '')) / 100;
        const parcelas = parseInt(document.getElementById('parcelas').value);
        const taxaJuros = parseFloat(document.getElementById('juros').value) / 100;

        // Cálculo do simulador
        const valorFinanciado = valorTotal - entrada;
        const valorParcela = (valorFinanciado * taxaJuros) / (1 - Math.pow(1 + taxaJuros, -parcelas));
        const totalPago = valorParcela * parcelas;

        // Guardar os dados do usuário para aparecer no resultado final
        resultadoSimulacao.innerHTML = `
            <h2>Resultado da Simulação</h2>
            <p>Valor do Veículo: R$ ${valorTotal.toFixed(2)}</p>
            <p>Entrada: R$ ${entrada.toFixed(2)}</p>
            <p>Parcelas: ${parcelas} x R$ ${valorParcela.toFixed(2)}</p>
            <p>Total a ser pago: R$ ${totalPago.toFixed(2)}</p>
            <button id="refazer">Refazer Simulação</button>
        `;

        formDadosVeiculo.style.display = 'none';
        resultadoSimulacao.style.display = 'block';

        // Botão para refazer a simulação
        document.getElementById('refazer').addEventListener('click', function () {
            formDadosPessoais.style.display = 'block';
            formDadosVeiculo.style.display = 'none';
            resultadoSimulacao.style.display = 'none';
        });
    });
});