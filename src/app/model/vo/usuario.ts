import { Tenancy } from "./tenancy";

export class Usuario {    
    id?: number = 0;
    tenancy?: Tenancy;
    nome?: string = "";
    email?: string = "";
    senha?: string = "";
    situacao?: string;
}
    
