import { Data } from "@angular/router";
import { DadosBancarios } from "./dados-bancarios";
import { Endereco } from "./endereco";

export class Cliente{    
    id?: number;
    endereco?: Endereco = {};
    contaBancaria?: DadosBancarios = {};
    nome?: string;
    nomeResponsavel?: string;
    tipoPessoa?: string;
    cpfCnpj?: string;
    incricaoEstadual?: string;
    situacao?: string;
    telefone?: string;
    email?: string;
    informacaoContrato?: string;
    observacoes?: string;    
}