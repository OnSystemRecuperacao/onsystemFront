import { DadosBancarios } from "./dados-bancarios";
import { Endereco } from "./endereco";

export class Prestador {
  id?: number = 0;
  nome?: string = "";
  cpfCnpj?: string= "";
  rg?: string= "";
  cnh?: string= "";
  categoriaCNH?: string = "";
  endereco?: Endereco = {};
  contaBancaria?: DadosBancarios = {};
  telefone?: string = "";
  email?: string = "";
  antenista?: string  = "";   
  regSinistro?: string  = "";
  escoltaArmado?: string  = "";
  observacoes?: string = "";
  fotoPrestador?: string = "";
  situacao?: string = "";
 
}
