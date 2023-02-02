import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Login } from '../interface/login.interface'
import { catchError, Observable, of, throwError, map } from 'rxjs';
import { Usuario } from 'src/app/interface/usuario.interface';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl='http://localhost:3000';
  errorMsg!: string;
  private _auth: Usuario | undefined;

  constructor( private http: HttpClient,
               private jwtHelper: JwtHelperService) { }


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

    if ( !localStorage.getItem('token') ) {
      return of(false);
    }

    let token = localStorage.getItem('token')!;
    const usuario:Usuario = this.decodeUserFromToken(token);
    const usuarioId = usuario.id;

    return this.http.get<Usuario>(`${ this.baseUrl }/auth/${usuarioId}`)
              .pipe(
                map( auth => {
                  this._auth = auth;
                  return true;
                })
              );

  }

  decodeUserFromToken(token:string) {
    return this.jwtHelper.decodeToken(token);
  }
  
}
