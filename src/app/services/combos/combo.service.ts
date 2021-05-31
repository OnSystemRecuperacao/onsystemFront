import { Injectable } from '@angular/core';
import { Perfis } from 'src/app/model/enums/perfis.enum';
import { SimNaoEnum } from 'src/app/model/enums/simnao.enum';
import { SituacaoEnum } from 'src/app/model/enums/situacao.enum';
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

    getSituacao(){
        return [{ label: SituacaoEnum[1], value: SituacaoEnum['ATIVO'] }, { label: SituacaoEnum[2], value: SituacaoEnum['INATIVO'] }]
    }
}