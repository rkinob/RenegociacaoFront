import { Component, OnInit,  Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Cliente } from 'src/app/models/cliente';
import { RenegociacaoService } from 'src/app/services/renegociacao.service';
import { OnlyNumbers } from 'src/app/utils/only-numbers';
import { maskCPF, Validacoes } from 'src/app/utils/valicacoes';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-informar-cpf',
  templateUrl: './informar-cpf.component.html',
  styleUrls: ['./informar-cpf.component.css',  '../renegociacao-passo-a-passo.component.css']
})
export class InformarCpfComponent implements OnInit {
  @Input() exibirPagina: boolean = false;
  @Output() numerodoPasso = new EventEmitter<number>();
  numerodoPassoAtual = 1;
  public mensagem = Swal;
  constructor(private _fb: FormBuilder, public renegociacaoService: RenegociacaoService, public spinner: NgxSpinnerService) { }




  public formCpf = this._fb.group({
                    Cpf: ['', [Validators.required, Validacoes.ValidaCpf]],
                    });

  public Cpf = this.formCpf.controls.Cpf;

  public somenteNumeros(event: any): void {
    OnlyNumbers.keyPressNumbers(event);
  }

  ngOnInit(): void {
    this.renegociacaoService.limparDados.subscribe({
      next: (value) => {
        if (value) {
          this.formCpf.reset();
          this.renegociacaoService.contratosCliente.next([]);
          this.renegociacaoService.ofertasContratos.next([]);
          this.renegociacaoService.cliente.next(new Cliente());
        }
      }
    });

  }

  setNumeroPasso(value: number) {
    this.numerodoPasso.emit(value);
  }

  consultarDadosCliente() {
    this.spinner.show();
    this.renegociacaoService.ConsultarCliente(Validacoes.retirarMascara(this.Cpf.value??"")).subscribe(
      {
        next: (cliente) => {

          this.renegociacaoService.cliente.next(cliente);
          this.setNumeroPasso(this.numerodoPassoAtual + 1);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          this.mensagem.fire(error, '', 'error');
        }
      }
    );
  }

  handleChangeMask(event: any) {
    const elemento = <HTMLInputElement> event.target;
    this.Cpf.setValue(maskCPF(event.target.value));

  }


}
