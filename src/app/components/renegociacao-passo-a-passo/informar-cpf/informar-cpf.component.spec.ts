import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Observable, of, Subject, throwError } from 'rxjs';
import { Cliente } from 'src/app/models/cliente';
import { Contrato } from 'src/app/models/contrato';
import { Oferta } from 'src/app/models/oferta';
import { RenegociacaoService } from 'src/app/services/renegociacao.service';
import Swal from 'sweetalert2';
import { InformarCpfComponent } from './informar-cpf.component';


const cpfValido = '74590439077';
const cpfInvalido = '74590439078';

let mockRenegociacaoService: jasmine.SpyObj<RenegociacaoService>;
let mockNgxSpinnerService: jasmine.SpyObj<NgxSpinnerService>;


describe('InformarCpfComponent', () => {
  let component: InformarCpfComponent;
  let fixture: ComponentFixture<InformarCpfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformarCpfComponent ],
      providers: [{provide: Swal, useValue: {}}],
      imports: [ BrowserModule , ReactiveFormsModule, FormsModule, HttpClientTestingModule, BrowserAnimationsModule, NgxSpinnerModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformarCpfComponent);
    component = fixture.componentInstance;
    mockRenegociacaoService = jasmine.createSpyObj('RenegociacaoService', ['ConsultarCliente']);
    mockRenegociacaoService.cliente = new Subject<Cliente>();
    mockRenegociacaoService.limparDados = new Subject<boolean>();
    mockRenegociacaoService.contratosCliente = new Subject<Contrato[]>();
    mockRenegociacaoService.ofertasContratos = new Subject<Oferta[]>();
    var someObject = jasmine.createSpyObj(Swal, [ 'fire' ]);
    component.mensagem = someObject;

    mockNgxSpinnerService = jasmine.createSpyObj('NgxSpinnerService', ['show','hide']);
    component.spinner = mockNgxSpinnerService;
    //fixture.detectChanges();
  });

  it('should create', () => {
    mockRenegociacaoService.ConsultarCliente.and.returnValue(of({ idCliente: "", nome: "Rodrigo Kinob", cpf: cpfValido, email: "teste@teste.com.br"}));


    component.renegociacaoService = mockRenegociacaoService;

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('Clicar no botão Continuar com CPF correto', () => {

    mockRenegociacaoService.ConsultarCliente.and.returnValue(of({ idCliente: "", nome: "Rodrigo Kinob", cpf:cpfValido, email: "teste@teste.com.br"}));

    component.renegociacaoService = mockRenegociacaoService;
    spyOn(component, 'setNumeroPasso');
    fixture.detectChanges();

    component.Cpf.setValue(cpfValido);
    component.consultarDadosCliente();

    expect(mockRenegociacaoService.ConsultarCliente).toHaveBeenCalled();
    expect(component.setNumeroPasso).toHaveBeenCalled();



  });

  it('Limpar formulário', () => {

    mockRenegociacaoService.ConsultarCliente.and.returnValue(of({ idCliente: "", nome: "Rodrigo Kinob", cpf:cpfValido, email: "teste@teste.com.br"}));

    component.renegociacaoService = mockRenegociacaoService;

    spyOn(component, 'setNumeroPasso');

    fixture.detectChanges();
    component.Cpf.setValue(cpfValido);
    mockRenegociacaoService.limparDados.next(true);
    expect(component.Cpf.value).toBeNull();
  });

  it('Clicar no botão Continuar com CPF não existente', () => {

    mockRenegociacaoService.ConsultarCliente.and.returnValue(throwError(() => 'Cliente não encontrado'));
    component.renegociacaoService = mockRenegociacaoService;

    spyOn(component, 'setNumeroPasso');

    fixture.detectChanges();

    component.Cpf.setValue(cpfValido);
    component.consultarDadosCliente();

    expect(mockRenegociacaoService.ConsultarCliente).toHaveBeenCalled();
    //expect(mockRenegociacaoService.cliente.next).toHaveBeenCalled();
    expect(component.setNumeroPasso).toHaveBeenCalledTimes(0);

  });

  it('Testar setNumeroPasso', () => {

    component.renegociacaoService = mockRenegociacaoService;
    spyOn(component.numerodoPasso, 'emit');
    fixture.detectChanges();
    component.setNumeroPasso(2);
    expect(component.numerodoPasso.emit).toHaveBeenCalled();

  });

  it('Informar CPF inválido', () => {

    component.renegociacaoService = mockRenegociacaoService;
    spyOn(component.numerodoPasso, 'emit');
    fixture.detectChanges();

    component.Cpf.setValue(cpfInvalido);
    component.formCpf.controls.Cpf.markAsTouched();
    fixture.detectChanges();

    expect(component.formCpf.invalid).toBeTruthy();
  });

  it('Informar CPF válido', () => {

    component.renegociacaoService = mockRenegociacaoService;

    spyOn(component.numerodoPasso, 'emit');
    fixture.detectChanges();

    component.Cpf.setValue(cpfValido);
    component.formCpf.controls.Cpf.markAsTouched();
    fixture.detectChanges();
    expect(component.formCpf.valid).toBeTruthy();


  });


});
