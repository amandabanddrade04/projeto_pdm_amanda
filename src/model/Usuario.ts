import {Perfil} from './perfil';

export class Usuario {
  public uid: string;
  public nome: string;
  public email: string;
  public cpf: string;
  public datanasc: string;
  public telefone: string;
  public senha: string;
  public perfil: Perfil;
  public urlFoto: string;
  constructor(
    uid: string,
    nome: string,
    email: string,
    cpf: string,
    datanasc: string,
    telefone: string,
    senha: string,
    urlFoto: string,
    perfil: Perfil,
  ) {
    this.uid = uid;
    this.nome = nome;
    this.email = email;
    this.cpf = cpf;
    this.datanasc = datanasc;
    this.telefone = telefone;
    this.senha = senha;
    this.perfil = perfil;
    this.urlFoto = urlFoto;
  }
}
