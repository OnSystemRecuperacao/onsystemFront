import { Injectable } from '@angular/core';
import { SimNaoEnum } from 'src/app/model/enums/simnao.enum';
import { TipoPessoaEnum } from 'src/app/model/enums/tipopessoa.enum';


@Injectable({
    providedIn: 'root',
})
export class ComboService {

    getSimNaoOptions(){
        return [{ label: SimNaoEnum[1], value: SimNaoEnum['SIM'] }, { label: SimNaoEnum[2], value: SimNaoEnum['NÃO'] }]
    }
    
    getTipoPessoa(){
        return [{ label: TipoPessoaEnum[1], value: TipoPessoaEnum['FÍSICA'] }, { label: TipoPessoaEnum[2], value: TipoPessoaEnum['JURÍDICA'] }]
    }
}