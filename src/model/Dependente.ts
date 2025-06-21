import {Perfil} from './Perfil';
import {Usuario} from './Usuario';

export class Dependente extends Usuario {
  public responsavelId: string;

  constructor(
    uid: string,
    nome: string,
    email: string,
    urlFoto: string,
    perfil: Perfil,
    responsavelId: string,
    senha?: string,
  ) {
    super(uid, nome, email, urlFoto, perfil, senha);
    this.responsavelId = responsavelId;
  }
}
