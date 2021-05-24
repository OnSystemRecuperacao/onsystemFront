import { environment } from "src/environments/environment";

export default class Utils {
    
    static makeURLRequest(path: string): string { 
        return environment.baseUrl + path;
    }  
    
    static leftPad(value: string, totalWidth: number) {
        let retorno = value;
        if(value.length < totalWidth){
          var length = totalWidth - value.toString().length + 1;
          retorno =  Array(length).join(0 || '0') + value;
        }
        return retorno;
    }
}