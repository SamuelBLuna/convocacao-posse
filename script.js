// Configuração do Firebase
const firebaseConfig = {
  databaseURL: "https://convocacao-posse-default-rtdb.firebaseio.com/"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Função para criar e exibir os cards dos aprovados
function exibirAprovados(aprovados) {
  const lista = document.getElementById('lista-aprovados');
  lista.innerHTML = ''; // Limpa a lista antes de adicionar os novos itens

  aprovados.forEach(aprovado => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <div class="card-content">
        <h3>${aprovado.nome}</h3>
        <p>${aprovado.cargo || 'Cargo não especificado'}</p>
        <p>Edição: ${aprovado.edicao || 'N/A'}</p>
        <p>Posição: ${aprovado.posicao || 'N/A'}</p>
      </div>
    `;

    lista.appendChild(card);
  });
}

// Função para buscar dados do Firebase
function buscarAprovadosFirebase() {
  const database = firebase.database();
  const ref = database.ref('convocado_posse');
  
  ref.once('value')
    .then((snapshot) => {
      const dados = snapshot.val();
      const aprovados = [];
      
      // Converte o objeto em array
      for (const key in dados) {
        if (dados.hasOwnProperty(key)) {
          aprovados.push({
            id: key,
            nome: dados[key].nome || '',
            edicao: dados[key].edicao || '',
            posicao: dados[key].posicao || '',
            cargo: 'Agente Técnico Administrativo' // Adiciona o cargo fixo
          });
        }
      }
      
      // Ordena por posição em ordem DECRESCENTE (maiores primeiro)
      aprovados.sort((a, b) => b.posicao - a.posicao);
      
      exibirAprovados(aprovados);
    })
    .catch((error) => {
      console.error('Erro ao buscar dados:', error);
      alert('Erro ao carregar os dados. Verifique o console para mais detalhes.');
    });
}

// Chama a função para buscar e exibir os aprovados ao carregar a página
window.onload = buscarAprovadosFirebase;