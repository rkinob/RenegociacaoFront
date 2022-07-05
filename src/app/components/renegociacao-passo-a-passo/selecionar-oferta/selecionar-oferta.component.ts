import { Component, EventEmitter, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Oferta } from 'src/app/models/oferta';
import { RenegociacaoService } from 'src/app/services/renegociacao.service';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/utils/custom-adapter';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-selecionar-oferta',
  templateUrl: './selecionar-oferta.component.html',
  styleUrls: ['./selecionar-oferta.component.css', '../renegociacao-passo-a-passo.component.css'],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: "pt-BR"
    },
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}]
})
export class SelecionarOfertaComponent implements OnInit {
  @Input() exibirPagina: boolean = false;
  @Output() numerodoPasso = new EventEmitter<number>();
  public ofertas: Oferta[] = [];
  numerodoPassoAtual = 4;
  formPai: FormGroup;
  formOfertas: FormArray;
  model: NgbDateStruct;
  public mensagem = Swal;

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  minPickerDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  };

  dataMaxima = this.addDays(new Date(), 5);

  maxPickerDate = {
    year: this.dataMaxima.getFullYear(),
    month: this.dataMaxima.getMonth() + 1,
    day: this.dataMaxima.getDate()
  };

  constructor(private _fb: FormBuilder,
              public renegociacaoService: RenegociacaoService,
              public spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.formPai = new FormGroup({
      formOfertas: new FormArray([])
    });


    this.renegociacaoService.ofertasContratos.subscribe({
      next: (ofertas) => {
        this.ofertas = ofertas;
        this.formPai.reset();

        this.formOfertas = this.formPai.get('formOfertas') as FormArray;
        this.formOfertas.reset();
        this.formOfertas.clear();

        for(let i = 0; i < this.ofertas.length; i++) {
          this.formOfertas.push(this._fb.group({
            DataPagamento: ['', Validators.required],
            FormaPagamento: ['', Validators.required],
          }));
        }
      }
    });
  }

  confirmarOferta(): void {
    const mensagemConfirmacao = this.mensagem.fire({
      title: 'Tem certeza de que deseja confirmar a oferta?',
      showDenyButton: true,
      icon: 'question',
      showCloseButton:true,
      showCancelButton: false,
      confirmButtonText: 'Sim',
      denyButtonText: `Não`,
      customClass: {
        title: 'popup-title'
      }

    })

    mensagemConfirmacao.then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.renegociacaoService.ConfirmarOferta(this.ofertas).subscribe({

          next: (ofertas) => {
            this.spinner.hide();
            this.setNumeroPasso(1);
            this.formOfertas.clear();
            this.renegociacaoService.limparDados.next(true);
            this.mensagem.fire('Acordo realizado com sucesso, foi enviado um e-mail com o link para acessar os dados do acordo.', '', 'success');
          }
        });

      }
    })

  }
  public setNumeroPasso(value: number) {
    this.numerodoPasso.emit(value);
  }
}
