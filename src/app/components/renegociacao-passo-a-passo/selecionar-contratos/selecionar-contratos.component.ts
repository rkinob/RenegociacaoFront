import { AfterViewChecked, Component, EventEmitter, Input, LOCALE_ID, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Contrato } from 'src/app/models/contrato';
import { RenegociacaoService } from 'src/app/services/renegociacao.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-selecionar-contratos',
  templateUrl: './selecionar-contratos.component.html',
  styleUrls: ['./selecionar-contratos.component.css', '../renegociacao-passo-a-passo.component.css'],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: "pt-BR"
    }]
})
export class SelecionarContratosComponent implements OnInit, OnDestroy {
  @Input() exibirPagina: boolean = false;
  @Output() numerodoPasso = new EventEmitter<number>();
  public contratos: Contrato[] = [];
  public mensagem = Swal;
  numerodoPassoAtual = 3;

  constructor(private _fb: FormBuilder,
              public renegociacaoService: RenegociacaoService,
              public spinner: NgxSpinnerService) { }

  public formContratos = this._fb.group({
    IdContrato: this._fb.array([], [Validators.required]),
  });

  public contratosSelecionados = (this.formContratos.controls.IdContrato as FormArray);

  ngOnInit(): void {

    this.renegociacaoService.contratosCliente.subscribe({
      next: (contratos) => {
        this.contratosSelecionados.clear();
        this.contratos = contratos;
      }
    });
  }

  onCheckboxChange(event: any) {

    if (event.target.checked) {
      this.contratosSelecionados.push(new FormControl(event.target.value));
    } else {
      const index = this.contratosSelecionados.controls
      .findIndex(x => x.value === event.target.value);
      this.contratosSelecionados.removeAt(index);
    }
  }

  ngOnDestroy(): void {
    this.renegociacaoService.contratosCliente.unsubscribe();
  }

  verificarOferta(): void {
    if (this.formContratos.valid) {
      const IdscontratosSelecionados = (this.formContratos.controls.IdContrato as FormArray);
      const contratosSelecionados: Contrato[] = [];

      for (let i = 0; i < IdscontratosSelecionados.length; i++) {
        const contrato = this.contratos.find(item => item.idContrato === IdscontratosSelecionados.controls[i].value);
        if(contrato != undefined)
          contratosSelecionados.push(contrato);
      }
      this.spinner.show();
      this.renegociacaoService.ConsultarOfertas(contratosSelecionados).subscribe({
        next: (ofertas) => {
          if (ofertas.length > 0) {
            this.renegociacaoService.ofertasContratos.next(ofertas);
            this.setNumeroPasso(this.numerodoPassoAtual + 1);
            this.spinner.hide();
          }
          else {
            this.spinner.hide();
            this.mensagem.fire({ icon: 'error', title: 'Nenhuma oferta encontrada' });
          }
        },
        error: (error) => {
          this.spinner.hide();
          this.mensagem.fire(error, '', 'error');
        }
      });

    }
  }
  setNumeroPasso(value: number) {
    this.numerodoPasso.emit(value);
  }
}
