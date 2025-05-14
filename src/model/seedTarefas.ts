import firestore from '@react-native-firebase/firestore';

export const popularTarefas = async () => {
  const tarefas = [
    // Domésticas
    {
      uid: '1',
      nome: 'Guardar os brinquedos',
      descricao: 'Organizar brinquedos no lugar certo após brincar.',
      categoriaId: 'domesticas',
    },
    {
      uid: '2',
      nome: 'Arrumar a cama',
      descricao: 'Puxar o lençol, ajeitar o travesseiro e coberta.',
      categoriaId: 'domesticas',
    },
    {
      uid: '3',
      nome: 'Recolher papéis da casa',
      descricao: 'Ajudar a jogar no lixo papéis e revistas antigas.',
      categoriaId: 'domesticas',
    },
    {
      uid: '4',
      nome: 'Guardar roupas dobradas',
      descricao: 'Guardar roupas limpas já dobradas no armário.',
      categoriaId: 'domesticas',
    },
    {
      uid: '5',
      nome: 'Separar brinquedos para doação',
      descricao: 'Escolher brinquedos que não usa mais para doar.',
      categoriaId: 'domesticas',
    },

    // Supervisionadas
    {
      uid: '6',
      nome: 'Ajudar a pôr a mesa',
      descricao: 'Colocar pratos, talheres e copos com ajuda de um adulto.',
      categoriaId: 'supervisionadas',
    },
    {
      uid: '7',
      nome: 'Ajudar a alimentar o pet',
      descricao: 'Colocar ração e água para o pet com supervisão.',
      categoriaId: 'supervisionadas',
    },
    {
      uid: '8',
      nome: 'Ajudar a regar as plantas',
      descricao: 'Usar um regador pequeno para molhar as plantas com ajuda.',
      categoriaId: 'supervisionadas',
    },

    // Escolares
    {
      uid: '9',
      nome: 'Separar o material da escola',
      descricao: 'Organizar os itens escolares para o próximo dia de aula.',
      categoriaId: 'escolares',
    },
    {
      uid: '10',
      nome: 'Organizar a mochila',
      descricao: 'Colocar cadernos e estojos na mochila para o dia seguinte.',
      categoriaId: 'escolares',
    },
    {
      uid: '11',
      nome: 'Guardar cadernos e livros após estudar',
      descricao: 'Organizar os materiais escolares após o uso.',
      categoriaId: 'escolares',
    },

    // Pessoais
    {
      uid: '12',
      nome: 'Escolher a própria roupa',
      descricao: 'Montar o look do dia com autonomia.',
      categoriaId: 'pessoais',
    },
    {
      uid: '13',
      nome: 'Escovar os dentes',
      descricao: 'Escovar os dentes pela manhã e antes de dormir.',
      categoriaId: 'pessoais',
    },
    {
      uid: '14',
      nome: 'Pentear o cabelo',
      descricao: 'Pentear o cabelo sozinha(o) ou com pouca ajuda.',
      categoriaId: 'pessoais',
    },

    // Financeiros
    {
      uid: '15',
      nome: 'Guardar dinheiro no cofrinho',
      descricao: 'Guardar pequenas quantias como mesada ou recompensa.',
      categoriaId: 'financeiros',
    },
    {
      uid: '16',
      nome: 'Separar moedas para economizar',
      descricao: 'Juntar moedas para alcançar um objetivo futuro.',
      categoriaId: 'financeiros',
    },
    {
      uid: '17',
      nome: 'Ajudar a fazer lista de compras',
      descricao: 'Participar da escolha de itens para o mercado com os pais.',
      categoriaId: 'financeiros',
    },
  ];

  for (let tarefa of tarefas) {
    await firestore().collection('tarefas').doc(tarefa.uid).set(tarefa);
  }

  console.log('✅ Todas as tarefas foram inseridas com sucesso!');
};
