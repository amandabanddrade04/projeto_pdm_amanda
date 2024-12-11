import {Perfil} from './perfil';
import {Usuario} from './usuario';

export class Responsavel extends Usuario {
  public perfil: Perfil;
  constructor(
    codusuario: string,
    nome: string,
    email: string,
    cpf: string,
    datanasc: string,
    telefone: string,
    senha: string,
    urlFoto: string,
    perfil: Perfil,
  ) {
    super(codusuario, nome, email, cpf, datanasc, telefone, senha, urlFoto, perfil);
    this.perfil = perfil;
  }
}
