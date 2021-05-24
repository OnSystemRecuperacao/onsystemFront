import { DadosBancarios } from "./dados-bancarios";
import { Endereco } from "./endereco";

export class Prestador {
  idPrestador?: number = 0;
  contaBancaria?: DadosBancarios = {};
  endereco?: Endereco = {};
  nomePrestador?: string = "";
  numCpf?: string= "";
  numRg?: string= "";
  numCnh?: string= "";
  categoriaCnh?: string = "";
  telefonePrestador?: string = "";
  emailPrestador?: string = "";
  antenista?: boolean;
  regSinistro?: boolean;
  escoltaArmado?: boolean;
  observacoes?: string = "";
  fotoPrestador?: string = "";
  situacaoPrestador?: string = "";
  codigoUsuarioInclusao?: number = 0;
  dataInclusao?: Date;
  codigoUsuarioAlteracao?: number = 0;
  dataAlteracao?: string  = "";
}
