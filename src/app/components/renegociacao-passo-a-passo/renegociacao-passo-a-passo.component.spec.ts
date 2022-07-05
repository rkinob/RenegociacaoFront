import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RenegociacaoPassoAPassoComponent } from './renegociacao-passo-a-passo.component';

describe('RenegociacaoPassoAPassoComponent', () => {
  let component: RenegociacaoPassoAPassoComponent;
  let fixture: ComponentFixture<RenegociacaoPassoAPassoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenegociacaoPassoAPassoComponent ],
      imports: [ ReactiveFormsModule, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenegociacaoPassoAPassoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // textoReferenteAoPasso
  it('testar textoReferenteAoPasso ', () => {
    component.setNumeroPasso(1);
    expect(component.textoReferenteAoPasso()).toBe('Passo 1 de 4 - Informe o seu CPF');

    component.setNumeroPasso(2);
    expect(component.textoReferenteAoPasso()).toBe('Passo 2 de 4 - Confirmar Dados');

    component.setNumeroPasso(3);
    expect(component.textoReferenteAoPasso()).toBe('Passo 3 de 4 - Selecione os contratos');

    component.setNumeroPasso(4);
    expect(component.textoReferenteAoPasso()).toBe('Passo 4 de 4 - Ofertas Disponíveis');

    component.setNumeroPasso(5);
    expect(component.textoReferenteAoPasso()).toBe('');

  });


});
