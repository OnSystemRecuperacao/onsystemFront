import { Tenancy } from "./tenancy";

export class Usuario {    
    id?: number = 0;
    tenancy?: Tenancy;
    tipo?: {
        descricao: string,
        id: number
    };
    nome?: string = "";
    email?: string = "";
    senha?: string = "";
    situacao?: string;
    admSistema?: boolean;
}
    
