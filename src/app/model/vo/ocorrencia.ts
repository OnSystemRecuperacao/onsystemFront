import { Cliente } from "./cliente";
import { Localizacao } from "./localizacao";
import { Prestador } from "./prestador";
import { Tenancy } from "./tenancy";

export class Ocorrencia{
 
    id?: number;
    tenancyCliente?: Tenancy = {};
    localizacao?: Localizacao = {};
    observacoes?: String;
    numeroProcesso?: number;
    motivo?: String;
    antenista?: Boolean;
    escoltaArmado?: Boolean;
    reguladorSinis?: Boolean;
    visivel?: Boolean;
    idPrestador?: number;
    status?: String;
    idCentral?: string;
    placa?: string;
    prestadoresSelecionados?: Prestador[];
    estados?: any;
    dataAbertura?: string;

}