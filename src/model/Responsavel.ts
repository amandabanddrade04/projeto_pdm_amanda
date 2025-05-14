import {Perfil} from './Perfil';
import {Usuario} from './Usuario';

export class Responsavel extends Usuario {
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
