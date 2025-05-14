// Tarefa original, criada pelo administrador
export type Tarefa = {
  id: string; // ID do documento no Firestore
  uid: string; // Identificador interno, se necessário
  nome: string;
  descricao: string;
  categoriaId: string;
};

// Tarefa atribuída a um dependente
export type TarefaAtribuida = {
  id: string; // ID do documento em "tarefas_atribuidas"
  dependenteId: string;
  tarefaId: string;
  categoriaId: string;
  dataAtribuicao: string; // ou Date, se você preferir tipar como objeto Date
  status: 'pendente' | 'concluida';
};
