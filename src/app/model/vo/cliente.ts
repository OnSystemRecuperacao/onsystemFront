import { Data } from "@angular/router";
import { DadosBancarios } from "./dados-bancarios";
import { Endereco } from "./endereco";

export class Cliente{    
    idCliente?: number;
    endereco?: Endereco = {};
    contaBancaria?: DadosBancarios = {};
    nomeCliente?: string;
    nomeResponsavel?: string;
    tipoPessoa?: string;
    numCpfCnpj?: string;
    numInscricaoEstadual?: string;
    situacaoCliente?: string;
    telefoneCliente?: string;
    emailCliente?: string;
    informacaoContrato?: string;
    observacoesGerais?: string;
    codigoUsuarioInclusao?: number;
    dataInclusao?: Data;
    codigoUsuarioAlteracao?: number;
    dataAlteracao?: Data;
}