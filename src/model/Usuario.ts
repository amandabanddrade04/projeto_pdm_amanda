import {Perfil} from './perfil';

export class Usuario {
  public uid: string;
  public nome: string;
  public email: string;
  public senha?: string;
  public perfil: Perfil;
  public urlFoto: string;
  constructor(
    uid: string,
    nome: string,
    email: string,
    urlFoto: string,
    perfil: Perfil,
    senha?: string,
  ) {
    this.uid = uid;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.perfil = perfil;
    this.urlFoto = urlFoto;
  }
}
