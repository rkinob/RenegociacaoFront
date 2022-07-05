import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RenegociacaoPassoAPassoComponent } from './components/renegociacao-passo-a-passo/renegociacao-passo-a-passo.component';
import { InformarCpfComponent } from './components/renegociacao-passo-a-passo/informar-cpf/informar-cpf.component';
import { ConfirmarDadosComponent } from './components/renegociacao-passo-a-passo/confirmar-dados/confirmar-dados.component';
import { SelecionarContratosComponent } from './components/renegociacao-passo-a-passo/selecionar-contratos/selecionar-contratos.component';
import { SelecionarOfertaComponent } from './components/renegociacao-passo-a-passo/selecionar-oferta/selecionar-oferta.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RenegociacaoService } from './services/renegociacao.service';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
registerLocaleData(localePt, 'pt');
@NgModule({
  declarations: [
    AppComponent,
    RenegociacaoPassoAPassoComponent,
    InformarCpfComponent,
    ConfirmarDadosComponent,
    SelecionarContratosComponent,
    SelecionarOfertaComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgxSpinnerModule
  ],
  providers: [
    RenegociacaoService,
      {
        provide: LOCALE_ID,
        useValue: "pt-BR"
      }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
