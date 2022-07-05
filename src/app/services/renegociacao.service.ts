import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of, Observable,  Subject, throwError, catchError } from "rxjs";
import { RenegociacaoDadosTestes } from "../components/renegociacao-passo-a-passo/renegociacao-dados-testes.spec";
import { Cliente } from "../models/cliente";
import { Contrato } from "../models/contrato";
import { Oferta } from "../models/oferta";
import { BaseService } from "./base.service";

@Injectable({
  providedIn: 'root'
})

export class RenegociacaoService extends BaseService {
  private baseURL = this.urlServiceV1 + 'api/renegociacao';
  public cliente: Subject<Cliente> = new Subject<Cliente>();
  public contratosCliente: Subject<Contrato[]> = new Subject<Contrato[]>();
  public ofertasContratos: Subject<Oferta[]> = new Subject<Oferta[]>();
  public limparDados: Subject<boolean> = new Subject<boolean>();

  constructor(private httpClient: HttpClient) {
    super();
  }



  public ConsultarCliente(cpf: string): Observable<Cliente> {
    return this.httpClient.get<Cliente>(this.baseURL + '/ConsultarCliente/' + cpf, this.ObterHeaderJson()).pipe(
      catchError(this.errorHandler));
  }

  public SalvarCliente(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.put<Cliente>(this.baseURL + '/SalvarCliente', cliente, this.ObterHeaderJson()).pipe(
      catchError(this.errorHandler));

  }

  public ConsultarContratos(cpf: string): Observable<Contrato[]> {
    return this.httpClient.get<Contrato[]>(this.baseURL + '/ConsultarContratos/' + cpf, this.ObterHeaderJson()).pipe(
      catchError(this.errorHandler));

  }

  public ConsultarOfertas(contratos: Contrato[]): Observable<Oferta[]> {
    return this.httpClient.post<Oferta[]>(this.baseURL + '/ConsultarOfertas/',  contratos, this.ObterHeaderJson()).pipe(
      catchError(this.errorHandler));
  }

  // Confirmar oferta
  public ConfirmarOferta(ofertas: Oferta[]): Observable<Oferta[]> {
    return this.httpClient.post<Oferta[]>(this.baseURL + '/ConfirmarOfertas', ofertas, this.ObterHeaderJson()).pipe(
      catchError(this.errorHandler));

  }


}
