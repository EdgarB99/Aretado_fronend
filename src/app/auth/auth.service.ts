import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Login } from '../interface/login.interface'
import { catchError, Observable, of, throwError, map } from 'rxjs';
import { Usuario } from 'src/app/interface/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl='http://localhost:3000';
  errorMsg!: string;
  private _auth: Usuario | undefined;

  constructor( private http: HttpClient) { }


  registrarUsuario(usuario:Usuario): Observable<Usuario>{
    return this.http.post<Usuario>(`${this.baseUrl}/auth`,usuario)
  }

  getAuth(login:Login): Observable<Login>{
    return this.http.post<Login>(`${this.baseUrl}/auth/login`,login)
    .pipe(
      catchError(error => {
          if (error.error instanceof ErrorEvent) {
              this.errorMsg = `Error: ${error.error.message}`;
          } else {
              this.errorMsg = this.getServerErrorMessage(error);
          }

          return throwError(this.errorMsg);
      })
  );
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
        case 404: {
            return `Not Found: ${error.message}`;
        }
        case 403: {
            return `Access Denied: ${error.message}`;
        }
        case 500: {
            return `Internal Server Error: ${error.message}`;
        }
        default: {
            return `Unknown Server Error: ${error.message}`;
        }

    }
}

verificaAutenticacion(): Observable<boolean> {

   

    if ( !localStorage.getItem('id') ) {
      return of(false);
    }

    let usuarioId = localStorage.getItem('id')!;

    return this.http.get<Usuario>(`${ this.baseUrl }/auth/${usuarioId}`)
              .pipe(
                map( auth => {
                  this._auth = auth;
                  return true;
                })
              );

  }
  
}
