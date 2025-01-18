// import {Categoria} from './Categoria';

export class Tarefa {
  public uid: string;
  public nome: string;
  public descricao: string;
  constructor(uid: string, descricao: string, nome: string) {
    this.uid = uid;
    this.descricao = descricao;
    this.nome = nome;
  }
}
