import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-renegociacao-passo-a-passo',
  templateUrl: './renegociacao-passo-a-passo.component.html',
  styleUrls: ['./renegociacao-passo-a-passo.component.css']
})
export class RenegociacaoPassoAPassoComponent implements OnInit {
  passoNumero = 1;
  textoPasso: string = '';
  valorPasso  = 25;

  constructor() { }

  ngOnInit(): void {
    this.textoPasso = this.textoReferenteAoPasso();
  }

  textoReferenteAoPasso(): string {
    switch (this.passoNumero) {
      case 1:
        return 'Passo 1 de 4 - Informe o seu CPF';
      case 2:
        return 'Passo 2 de 4 - Confirmar Dados';
      case 3:
        return 'Passo 3 de 4 - Selecione os contratos';
      case 4:
        return 'Passo 4 de 4 - Ofertas Disponíveis';
      default:
        return ''
    }
  }

  setNumeroPasso(value: any) {
    this.passoNumero = value;
    this.textoPasso = this.textoReferenteAoPasso();
  }

}
