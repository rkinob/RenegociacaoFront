import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Subject, of, throwError } from 'rxjs';
import { Cliente } from 'src/app/models/cliente';
import { Contrato } from 'src/app/models/contrato';
import { RenegociacaoService } from 'src/app/services/renegociacao.service';
import Swal from 'sweetalert2';
import { RenegociacaoDadosTestes } from '../renegociacao-dados-testes.spec';


import { ConfirmarDadosComponent } from './confirmar-dados.component';

let mockRenegociacaoService: jasmine.SpyObj<RenegociacaoService>;
let mockNgxSpinnerService: jasmine.SpyObj<NgxSpinnerService>;

const cpfValido = '74590439077';
const clienteDadosCompletos = { idCliente: "", nome: "Teste", cpf: cpfValido, email: "teste@teste.com.br"};
const clienteDadosSemNome = { idCliente: "", nome: null, cpf: cpfValido, email: "teste@teste.com.br"};

describe('ConfirmarDadosComponent', () => {
  let component: ConfirmarDadosComponent;
  let fixture: ComponentFixture<ConfirmarDadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmarDadosComponent ],
      imports: [ BrowserModule ,ReactiveFormsModule, FormsModule, HttpClientTestingModule, BrowserAnimationsModule, NgxSpinnerModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarDadosComponent);
    component = fixture.componentInstance;

    mockRenegociacaoService = jasmine.createSpyObj('RenegociacaoService', ['ConsultarContratos','SalvarCliente','cliente']);
    mockNgxSpinnerService = jasmine.createSpyObj('NgxSpinnerService', ['show','hide']);
    mockRenegociacaoService.cliente = new Subject<Cliente>();
    mockRenegociacaoService.limparDados = new Subject<boolean>();
    mockRenegociacaoService.contratosCliente = new Subject<Contrato[]>();
    var someObject = jasmine.createSpyObj(Swal, [ 'fire' ]);
    component.mensagem = someObject;
    //mockNgxSpinnerService.show.and.returnValue(Promise.resolve({}));
    //mockNgxSpinnerService.hide.and.returnValue(Promise.resolve({}));
    component.spinner = mockNgxSpinnerService;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Mostrar mensagem de que cliente não possui nenhum contrato ativo  ', () => {

    mockRenegociacaoService.SalvarCliente.and.returnValue(of(clienteDadosCompletos));
    mockRenegociacaoService.ConsultarContratos.and.returnValue(of([]));
    spyOn(component, 'setNumeroPasso');

    fixture.detectChanges();
    component.cliente = clienteDadosCompletos;
    component.renegociacaoService = mockRenegociacaoService;
    component.renegociacaoService.cliente.next(clienteDadosCompletos);
    component.formDados.controls.Cpf.setValue(clienteDadosCompletos.cpf);
    component.formDados.controls.Nome.setValue(clienteDadosCompletos.nome);
    component.formDados.controls.Email.setValue(clienteDadosCompletos.email);

    component.salvarCliente();
    expect(mockRenegociacaoService.ConsultarContratos).toHaveBeenCalled();
    expect(component.setNumeroPasso).toHaveBeenCalledTimes(0);

  });

  it('Avançar para a tela de contratos caso o cliente tenha contratos  ', () => {

    spyOn(component, 'setNumeroPasso');
    mockRenegociacaoService.SalvarCliente.and.returnValue(of(clienteDadosCompletos));
    mockRenegociacaoService.ConsultarContratos.and.returnValue(of(RenegociacaoDadosTestes.GerarContratos()));
    fixture.detectChanges();
    component.renegociacaoService = mockRenegociacaoService;
    component.preencherFormulario(clienteDadosCompletos);
    component.cliente = clienteDadosCompletos;
    component.formDados.controls.Nome.setValue(clienteDadosCompletos.nome);
    component.formDados.controls.Email.setValue(clienteDadosCompletos.email);

    component.salvarCliente();
    expect(mockRenegociacaoService.ConsultarContratos).toHaveBeenCalled();
    expect(mockRenegociacaoService.SalvarCliente).toHaveBeenCalled();
    expect(component.setNumeroPasso).toHaveBeenCalledTimes(1);

  });

  it('Mostrar mensagem de erro ao salvar cliente', () => {
    mockRenegociacaoService.ConsultarContratos.and.returnValue(of(RenegociacaoDadosTestes.GerarContratos()));
    mockRenegociacaoService.SalvarCliente.and.returnValue(throwError(() => 'Erro ao salvar cliente'));
    spyOn(component, 'setNumeroPasso');
    fixture.detectChanges();
    component.renegociacaoService = mockRenegociacaoService;
    component.preencherFormulario(clienteDadosCompletos);
    component.cliente = clienteDadosCompletos;
    component.formDados.controls.Nome.setValue(clienteDadosCompletos.nome);
    component.formDados.controls.Email.setValue(clienteDadosCompletos.email);
    component.salvarCliente();
    expect(mockRenegociacaoService.SalvarCliente).toHaveBeenCalled();
    expect(component.setNumeroPasso).toHaveBeenCalledTimes(0);


  });

  it('Mostrar mensagem de erro ao consultar contratos', () => {
    mockRenegociacaoService.SalvarCliente.and.returnValue(of(clienteDadosCompletos));
    mockRenegociacaoService.ConsultarContratos.and.returnValue(throwError(() => 'Erro ao consultar contratos'));
    spyOn(component, 'setNumeroPasso');
    fixture.detectChanges();
    component.renegociacaoService = mockRenegociacaoService;
    component.preencherFormulario(clienteDadosCompletos);
    component.cliente = clienteDadosCompletos;
    component.formDados.controls.Nome.setValue(clienteDadosCompletos.nome);
    component.formDados.controls.Email.setValue(clienteDadosCompletos.email);
    component.salvarCliente();
    expect(mockRenegociacaoService.ConsultarContratos).toHaveBeenCalled();
    expect(component.setNumeroPasso).toHaveBeenCalledTimes(0);


  });

  it('Testar setNumeroPasso', () => {
    fixture.detectChanges();
    spyOn(component.numerodoPasso, 'emit');
    component.setNumeroPasso(2);
    expect(component.numerodoPasso.emit).toHaveBeenCalled();

  });

  it('Não salvar o cliente se estiver sem o nome preenchido', () => {
    mockRenegociacaoService.SalvarCliente.and.returnValue(of(clienteDadosCompletos));
    mockRenegociacaoService.ConsultarContratos.and.returnValue(throwError(() => 'Erro ao consultar contratos'));
    spyOn(component, 'setNumeroPasso');
    fixture.detectChanges();
    component.renegociacaoService = mockRenegociacaoService;
    //component.preencherFormulario(clienteDadosSemNome);
    component.cliente = clienteDadosCompletos;
    component.formDados.controls.Nome.setValue(clienteDadosSemNome.nome);
    component.formDados.controls.Email.setValue(clienteDadosSemNome.email);
    component.salvarCliente();
    expect(mockRenegociacaoService.ConsultarContratos).toHaveBeenCalledTimes(0);
    expect(component.setNumeroPasso).toHaveBeenCalledTimes(0);


  });

});
