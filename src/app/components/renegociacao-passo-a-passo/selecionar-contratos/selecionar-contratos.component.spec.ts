import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SelecionarContratosComponent } from './selecionar-contratos.component';
import { RenegociacaoService } from 'src/app/services/renegociacao.service';
import { Subject, of, throwError } from 'rxjs';

import Swal from 'sweetalert2';
import { Oferta } from 'src/app/models/oferta';
import { Contrato } from 'src/app/models/contrato';
import { By } from '@angular/platform-browser';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { RenegociacaoDadosTestes } from '../renegociacao-dados-testes.spec';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

registerLocaleData(localePt, 'pt');

let mockRenegociacaoService: jasmine.SpyObj<RenegociacaoService>;
let mockNgxSpinnerService: jasmine.SpyObj<NgxSpinnerService>;
describe('SelecionarContratosComponent', () => {
  let component: SelecionarContratosComponent;
  let fixture: ComponentFixture<SelecionarContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelecionarContratosComponent ],
      imports: [ ReactiveFormsModule, FormsModule, HttpClientTestingModule, BrowserAnimationsModule, NgxSpinnerModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelecionarContratosComponent);
    component = fixture.componentInstance;
    mockRenegociacaoService = jasmine.createSpyObj('RenegociacaoService', ['ConsultarOfertas']);
    mockRenegociacaoService.ofertasContratos = new Subject<Oferta[]>();
    var someObject = jasmine.createSpyObj(Swal, [ 'fire' ]);

    component.mensagem = someObject;

    mockNgxSpinnerService = jasmine.createSpyObj('NgxSpinnerService', ['show','hide']);
    component.spinner = mockNgxSpinnerService;
    component.exibirPagina = true;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deve mostrar as ofertas ao chamar a função verificarOferta caso haja algum contrato selecionado', () => {


    const contratos = RenegociacaoDadosTestes.GerarContratos();
    mockRenegociacaoService.contratosCliente = new Subject<Contrato[]>();
    mockRenegociacaoService.ConsultarOfertas.and.returnValue(of(RenegociacaoDadosTestes.GerarOfertas(contratos)));
    component.contratosSelecionados.push(new FormControl(contratos[0].idContrato));
    component.renegociacaoService = mockRenegociacaoService;

    fixture.detectChanges();


    spyOn(component, 'setNumeroPasso');
    spyOn(component.renegociacaoService.ofertasContratos,'next');

    component.verificarOferta();
    expect(component.setNumeroPasso).toHaveBeenCalled();
    expect(component.renegociacaoService.ConsultarOfertas).toHaveBeenCalled();
    expect(component.renegociacaoService.ofertasContratos.next).toHaveBeenCalled();
  });

  it('Deve mostrar mensagem de que nenhuma oferta foi encontrada', () => {


    const contratos = RenegociacaoDadosTestes.GerarContratos();
    mockRenegociacaoService.contratosCliente = new Subject<Contrato[]>();
    mockRenegociacaoService.ConsultarOfertas.and.returnValue(of([]));

    component.contratosSelecionados.push(new FormControl(contratos[0].idContrato));
    component.renegociacaoService = mockRenegociacaoService;

    fixture.detectChanges();


    spyOn(component, 'setNumeroPasso');
    spyOn(component.renegociacaoService.ofertasContratos,'next');

    component.verificarOferta();
    expect(component.setNumeroPasso).toHaveBeenCalledTimes(0);
    expect(component.renegociacaoService.ofertasContratos.next).toHaveBeenCalledTimes(0);
  });

  it('Deve mostrar mensagem de erro quando houver algum problema com o subscribe do ConsultarOfertas', () => {


    const contratos = RenegociacaoDadosTestes.GerarContratos();
    mockRenegociacaoService.contratosCliente = new Subject<Contrato[]>();
    mockRenegociacaoService.ConsultarOfertas.and.returnValue(throwError(() => 'Erro ao consultar ofertas'));
    component.contratosSelecionados.push(new FormControl(contratos[0].idContrato));
    component.renegociacaoService = mockRenegociacaoService;

    fixture.detectChanges();

    spyOn(component, 'setNumeroPasso');
    spyOn(component.renegociacaoService.ofertasContratos,'next');

    component.verificarOferta();
    expect(component.setNumeroPasso).toHaveBeenCalledTimes(0);
    expect(component.renegociacaoService.ofertasContratos.next).toHaveBeenCalledTimes(0);
    expect(component.mensagem.fire).toHaveBeenCalledTimes(1);
  });


  it('Deve apagar a lista de contratos selecionados quando chegar na página', () => {
    const contratos = RenegociacaoDadosTestes.GerarContratos();
    mockRenegociacaoService.contratosCliente = new Subject<Contrato[]>();
    component.contratosSelecionados.push(new FormControl(contratos[0].idContrato));
    component.renegociacaoService = mockRenegociacaoService;

    fixture.detectChanges();
    spyOn(component.contratosSelecionados, 'clear');
    component.renegociacaoService.contratosCliente.next(contratos);

    expect(component.contratosSelecionados.clear).toHaveBeenCalledTimes(1);
  });

    it('Testar onCheckboxChange',fakeAsync(()=>{

      const contratos = RenegociacaoDadosTestes.GerarContratos();
      mockRenegociacaoService.contratosCliente = new Subject<Contrato[]>();
      component.renegociacaoService = mockRenegociacaoService;
      fixture.detectChanges();

      const handleSpy = spyOn(component, 'onCheckboxChange').and.callThrough();
      component.renegociacaoService.contratosCliente.next(contratos);

     fixture.detectChanges();
     const primeiroContrato = fixture.debugElement.queryAll(By.css('input[type=checkbox]'))[0];
     primeiroContrato.triggerEventHandler('change', { target: { checked: true } });
     tick();

     expect(component.contratosSelecionados.length == 1).toBeTruthy();
     expect(handleSpy).toHaveBeenCalled();

     primeiroContrato.triggerEventHandler('change', { target: { checked: false } });
     tick();

     expect(component.contratosSelecionados.length == 0).toBeTruthy();

    }));

  it('Testar setNumeroPasso', () => {
    fixture.detectChanges();
    spyOn(component.numerodoPasso, 'emit');
    component.setNumeroPasso(2);
    expect(component.numerodoPasso.emit).toHaveBeenCalled();

  });

});
