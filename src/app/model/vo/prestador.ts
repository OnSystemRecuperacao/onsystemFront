import { DadosBancarios } from "./dados-bancarios";
import { Endereco } from "./endereco";

export class Prestador {
  id?: number = 0;
  contaBancaria?: DadosBancarios = {};
  endereco?: Endereco = {};
  nomePrestador?: string = "";
  numCpf?: string= "";
  rg?: string= "";
  numCnh?: string= "";
  categoriaCnh?: string = "";
  telefone?: string = "";
  emailPrestador?: string = "";
  antenista?: boolean;
  regSinistro?: boolean;
  escoltaArmado?: boolean;
  observacoes?: string = "";
  fotoPrestador?: string = "";
  situacao?: string = "";
  codigoUsuarioInclusao?: number = 0;
  dataInclusao?: Date;
  codigoUsuarioAlteracao?: number = 0;
  dataAlteracao?: string  = "";
}
