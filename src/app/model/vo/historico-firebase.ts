import { BookType } from "xlsx";

export class HistoricoFirebase {
    createdAt?: number;
    image?: string;
    audio?: string;
    text?: string;
    bufferImagem?: any;
    user?: User;

}

export class User {
    _id?: number;
    tipoTenancy?: number;
    name?: string;
    avatar?: string;
}