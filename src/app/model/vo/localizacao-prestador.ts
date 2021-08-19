import { Cliente } from "./cliente";
import { Localizacao } from "./localizacao";
import { Prestador } from "./prestador";
import { Tenancy } from "./tenancy";

export class LocalizacaoPrestador{
    prestador?: Prestador = {};
    localizacao?: Localizacao = {};
}