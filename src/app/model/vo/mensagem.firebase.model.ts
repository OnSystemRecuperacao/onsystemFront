export class MensagemFirebase{
    _id?: string = '';
    createdAt?: number = 0;
    text?: string = '';
    audio?: string = '';
    image?: string = '';
    user?: User = {}; 
}

class User{
    _id?: number = 0;
    tipoTenancy?: number = 0;
    avatar?: string = "";
    name?: string = ""
}
