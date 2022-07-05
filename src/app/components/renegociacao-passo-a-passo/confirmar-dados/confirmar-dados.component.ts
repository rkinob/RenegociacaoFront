import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Cliente } from 'src/app/models/cliente';
import { RenegociacaoService } from 'src/app/services/renegociacao.service';
import { maskCPF } from 'src/app/utils/valicacoes';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-confirmar-dados',
  templateUrl: './confirmar-dados.component.html',
  styleUrls: ['./confirmar-dados.component.css', '../renegociacao-passo-a-passo.component.css']
})
export class ConfirmarDadosComponent implements OnInit {
  @Input() exibirPagina: boolean = false;
  @Output() numerodoPasso = new EventEmitter<number>();
  numerodoPassoAtual = 2;
  cliente: Cliente;
  public mensagem = Swal;

constructor(private _fb: FormBuilder,
              public renegociacaoService: RenegociacaoService,
              public spinner: NgxSpinnerService) { }

public formDados = this._fb.group({
                Cpf: ['', Validators.required],
                Nome: ['', Validators.required],
                Email: ['', Validators.compose([Validators.required, Validators.email])],
                });

public Nome = this.formDados.controls.Nome;
public Email = this.formDados.controls.Email;
public Cpf = this.formDados.controls.Cpf;

  ngOnInit(): void {
    this.renegociacaoService.cliente.subscribe({
      next: (cliente) => {
        this.preencherFormulario(cliente);
      }
    });
  }

  public preencherFormulario(cliente: Cliente): void {
    this.Cpf.setValue(maskCPF(cliente.cpf));
    this.Cpf.disable();
    this.Nome.setValue(cliente.nome);
    this.Email.setValue(cliente.email);
    this.cliente = cliente;


  }

  salvarCliente() {
    let clienteAlterado = new Cliente();
    clienteAlterado.cpf = this.cliente.cpf;
    clienteAlterado.nome = this.Nome.value??"";
    clienteAlterado.email = this.Email.value??"";
    if(this.formDados.valid) {
      this.spinner.show();
      this.renegociacaoService.ConsultarContratos(clienteAlterado.cpf).subscribe({
        next: (contratos) => {
         this.renegociacaoService.contratosCliente.next(contratos);

          if(contratos.length == 0) {
            // Não possui contratos
            this.spinner.hide();
            this.mensagem.fire("Cliente não possui nenhum contrato elegível para renegociação", '', 'error');
          }
          else {
            this.renegociacaoService.SalvarCliente(clienteAlterado).subscribe({
              next: (cliente) => {
                this.renegociacaoService.cliente.next(cliente);
                this.spinner.hide();
                this.setNumeroPasso(this.numerodoPassoAtual + 1);

              },
              error: (error) => {
                this.spinner.hide();
                this.mensagem.fire(error, '', 'error');
              }
            });
          }
        },
        error: (error) => {
          this.spinner.hide();
          this.mensagem.fire(error, '', 'error');
        }
      });
    }
  }

  public setNumeroPasso(value: number): void {
    this.numerodoPasso.emit(value);
  }


}
