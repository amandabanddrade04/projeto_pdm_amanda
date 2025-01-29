import {Perfil} from './Perfil';
import {Usuario} from './Usuario';

export class Dependente extends Usuario {
  public responsavel: Usuario;

  constructor(
    uid: string,
    nome: string,
    email: string,
    urlFoto: string,
    perfil: Perfil,
    responsavel: Usuario,
    senha?: string,
  ) {
    super(uid, nome, email, urlFoto, perfil, senha);
    this.responsavel = responsavel;
  }
}
