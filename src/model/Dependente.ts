import {Perfil} from './perfil';
import {Usuario} from './usuario';

export class Dependente extends Usuario {
  public perfil: Perfil;
  constructor(
    uid: string,
    nome: string,
    email: string,
    senha: string,
    urlFoto: string,
    perfil: Perfil,
  ) {
    super(uid, nome, email, senha, urlFoto, perfil);
    this.perfil = perfil;
  }
}
