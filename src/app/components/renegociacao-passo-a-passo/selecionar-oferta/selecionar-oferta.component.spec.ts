import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Subject, of } from 'rxjs';
import { Oferta } from 'src/app/models/oferta';
import { RenegociacaoService } from 'src/app/services/renegociacao.service';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/utils/custom-adapter';
import Swal from 'sweetalert2';
import { RenegociacaoDadosTestes } from '../renegociacao-dados-testes.spec';

import { SelecionarOfertaComponent } from './selecionar-oferta.component';

let mockRenegociacaoService: jasmine.SpyObj<RenegociacaoService>;
let mockNgxSpinnerService: jasmine.SpyObj<NgxSpinnerService>;

describe('SelecionarOfertaComponent', () => {
  let component: SelecionarOfertaComponent;
  let fixture: ComponentFixture<SelecionarOfertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelecionarOfertaComponent ],
      imports: [ ReactiveFormsModule, FormsModule, HttpClientTestingModule, NgbModule, BrowserAnimationsModule, NgxSpinnerModule],
      providers: [
        {provide: NgbDateAdapter, useClass: CustomAdapter},
        {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelecionarOfertaComponent);
    component = fixture.componentInstance;
    mockRenegociacaoService = jasmine.createSpyObj('RenegociacaoService', ['ConsultarOfertas','ConfirmarOferta']);
    mockRenegociacaoService.ofertasContratos = new Subject<Oferta[]>();
    var mockSwal = jasmine.createSpyObj(Swal, [ 'fire' ]);
    mockSwal.fire.and.returnValue(Promise.resolve({isConfirmed: true}));
    mockRenegociacaoService.limparDados = new Subject<boolean>();

    component.mensagem = mockSwal;

    mockNgxSpinnerService = jasmine.createSpyObj('NgxSpinnerService', ['show','hide']);
    component.spinner = mockNgxSpinnerService;
    component.exibirPagina = true;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('Testar se confirma as ofertas ',fakeAsync(()=>{
    const ofertas = RenegociacaoDadosTestes.GerarOfertas(RenegociacaoDadosTestes.GerarContratos());
    mockRenegociacaoService.ConsultarOfertas.and.returnValue(of(ofertas));
    mockRenegociacaoService.ConfirmarOferta.and.returnValue(of(ofertas));
    component.renegociacaoService = mockRenegociacaoService;
    spyOn(component, 'setNumeroPasso');

    fixture.detectChanges();

    component.renegociacaoService.ofertasContratos.next(ofertas);

    fixture.detectChanges();

    component.confirmarOferta();
    tick();
    fixture.detectChanges();
    expect(component.setNumeroPasso).toHaveBeenCalledTimes(1);

  }));


  it('Testar se carrega as ofertas ',fakeAsync(()=>{
    const ofertas = RenegociacaoDadosTestes.GerarOfertas(RenegociacaoDadosTestes.GerarContratos());
    mockRenegociacaoService.ConsultarOfertas.and.returnValue(of(ofertas));
    mockRenegociacaoService.ConfirmarOferta.and.returnValue(of(ofertas));
    component.renegociacaoService = mockRenegociacaoService;
    fixture.detectChanges();

    component.renegociacaoService.ofertasContratos.next(ofertas);


    tick();
    fixture.detectChanges();

    expect(component.ofertas.length).toBe(ofertas.length);
    expect(component.formOfertas.length).toBe(ofertas.length);

  }));




});
