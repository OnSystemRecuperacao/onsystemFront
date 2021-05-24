import { Cliente } from "./cliente";
import { Prestador } from "./prestador";

export class Ocorrencia{

    idOcorrencia?: number;
    statusOcorrencia?: string;
    aceiteOcorrencia?: string;
    dataHoraAberturaOcorrencia?: Date;
    cliente?: Cliente = {};
    prestador?: Prestador = {};
    latitudeOcorrencia?: number;
    longitudeOcorrencia?: number;
    latitudePrestador?: number;
    longitudePrestador?: number;
    dataHoraInicioOcorrencia?: Date;
    dataHoraFimOcorrencia?: Date;
    antenista?: Boolean;
    escoltaArmado?: Boolean;
     reguladorSinis?: Boolean;

}