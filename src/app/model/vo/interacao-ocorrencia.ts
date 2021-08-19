import { Ocorrencia } from "./ocorrencia";
import { Tenancy } from "./tenancy";

export class InteracaoOcorrencia{

    ocorrencia?: Ocorrencia = {} ;
    mensagem?: string;
    tipoTenancy?: Tenancy = {};
    dataHora?: Date;

}