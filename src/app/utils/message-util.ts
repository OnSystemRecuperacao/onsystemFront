import { Message } from "primeng/api";

export default class MessageUtils {
    
    static onSuccessMessage(message: string): Message { 
        return {severity:'success', summary: 'Sucesso', detail: message}; 
    }   
    
    static onErrorMessage(message: string): Message { 
        return {severity:'error', summary: 'Erro', detail: message};
    } 
}