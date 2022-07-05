import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { throwError } from "rxjs";
@Injectable({
  providedIn: "root"
})

export abstract class BaseService {
  protected urlServiceV1: string = environment.apiUrlv1;


  protected ObterHeaderJson() {
      return {
          headers: new HttpHeaders({
              'Content-Type': 'application/json;charset=utf-8',
              'Accept':'application/json;charset=utf-8',
          })
      };
  }
  protected errorHandler(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.log('Um erro ocorreu:', error.error.message);
    } else {
        if (error.status === 401) {
            location.href = '/login';
            return throwError('Acesso não autorizado ou sessão expirou. Por favor faça o login novamente!')
        } else if (error.status === 403) {
            location.href = '/';
            return throwError('Não tem acesso a funcionalidade!')
        } else if (error.status === 400) {


            if (error.error) {
                if (error.error[Object.keys(error.error)[0]].value)
                    return throwError(error.error[Object.keys(error.error)[0]].value);
                if (typeof error.error === 'string' || error.error instanceof String)
                return throwError(error.error);

                return throwError('Algo de errado aconteceu. Por favor tente novamente!');
            } else {
                return throwError(error);
            }
        }
    }
    // return an observable with a user-facing error message
    return throwError('Algo de errado aconteceu. Por favor tente novamente!');
}
}
