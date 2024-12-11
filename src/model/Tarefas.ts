import {Categoria} from './Categoria';

export class Tarefas extends Categoria {
  public codtarefa: string;
  public descricao: string;
  constructor(codtarefa: string, descricao: string, codcategoria: string, nomecategoria: string) {
    super(codcategoria, nomecategoria);
    this.codtarefa = codtarefa;
    this.descricao = descricao;
  }
}
