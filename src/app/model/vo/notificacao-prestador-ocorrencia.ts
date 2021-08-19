import { Ocorrencia } from "./ocorrencia";
import { Tenancy } from "./tenancy";

export class NotificacaoPrestadorOcorrencia{
    public prestador?: Tenancy = {};
    public ocorrencia?: Ocorrencia = {};
}