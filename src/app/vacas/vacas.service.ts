import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../interface/usuario.interface';
import { Observable } from 'rxjs';
import { Lote } from '../interface/lote.interface';
import { Raza } from '../interface/raza.interface';
import { NameUsuarioLote } from '../interface/name-usuario-lote';
import { NameUsuarioRaza } from '../interface/name-usuario-raza';
import { Vaca } from '../interface/vaca.interface';
import { AreteUsuario } from '../interface/arete-usuario.dto';
import { Peso } from '../interface/peso.interface';
import { MesPeso } from '../interface/mesPeso.interface';
import { CreateMesPeso } from '../interface/create-mes-peso.interface';
import { UpdateVaca } from '../interface/update-vaca.interface';
import { PesoAnterior } from '../interface/peso-anterior.interface';
import { CreateRaza } from '../interface/create-raza.interface';

@Injectable({
  providedIn: 'root'
})
export class VacasService {

  baseUrl='http://localhost:3000';

  constructor(private http:HttpClient) { }

  getUsuarioById(id:string): Observable<Usuario>{
    return this.http.get<Usuario>(`${this.baseUrl}/auth/${id}`)
  }

  getPesoById(id:string): Observable<PesoAnterior>{
    return this.http.get<PesoAnterior>(`${this.baseUrl}/peso/${id}`)
  }

  getVacasByUsuarioId(id:string): Observable<Vaca[]>{
    return this.http.get<Vaca[]>(`${this.baseUrl}/vacas/usuario/${id}`)
  }

  getLotesByUsuarioId(id:string): Observable<Lote[]>{
    return this.http.get<Lote[]>(`${this.baseUrl}/lote/usuario/${id}`)
  }

  getRazasByUsuarioId(id:string): Observable<Raza[]>{
    return this.http.get<Raza[]>(`${this.baseUrl}/raza/usuario/${id}`)
  }

  getLoteByNameAndUsuarioId(datos:NameUsuarioLote): Observable<Lote>{
    return this.http.post<Lote>(`${this.baseUrl}/lote/nombre`,datos);
  }

  getRazaByNameAndUsuarioId(datos:NameUsuarioRaza): Observable<Raza>{
    return this.http.post<Raza>(`${this.baseUrl}/raza/nombre`,datos);
  }

  getVacaByAreteAndUsuarioId(datos:AreteUsuario): Observable<Vaca>{
    return this.http.post<Vaca>(`${this.baseUrl}/vacas/arete`,datos)
  }

  createLote(lote:Lote): Observable<Lote>{
    return this.http.post<Lote>(`${this.baseUrl}/lote`,lote);
  }

  createRaza(raza:CreateRaza): Observable<Raza>{
    return this.http.post<Raza>(`${this.baseUrl}/raza`,raza);
  }

  createVaca(vaca:Vaca): Observable<Vaca>{
    return this.http.post<Vaca>(`${this.baseUrl}/vacas`, vaca);
  }

  createPeso(id:string,peso:Peso): Observable<Vaca>{
    return this.http.post<Vaca>(`${this.baseUrl}/peso/${id}/peso`, peso);
  }

  createMesPeso(mesPeso:CreateMesPeso): Observable<CreateMesPeso>{
    return this.http.post<CreateMesPeso>(`${this.baseUrl}/mes-peso`, mesPeso);
  }

  getLoteById(id:string): Observable<Lote>{
    return this.http.get<Lote>(`${this.baseUrl}/lote/${id}`);
  }

  getRazaById(id:string): Observable<Raza>{
    return this.http.get<Raza>(`${this.baseUrl}/raza/${id}`);
  }

  actualizarLote(id:string, lote:Lote): Observable<Lote>{
    return this.http.patch<Lote>(`${this.baseUrl}/lote/${id}`,lote);
  }

  actualizarRaza(id:string, raza:Raza): Observable<Raza>{
    return this.http.patch<Raza>(`${this.baseUrl}/raza/${id}`,raza);
  }

  actualiarVaca(id:string,vaca:UpdateVaca): Observable<UpdateVaca>{
    return this.http.patch<UpdateVaca>(`${this.baseUrl}/vacas/${id}`,vaca);
  }

  actualizarPeso(id:string, peso:Peso): Observable<PesoAnterior>{
    return this.http.patch<PesoAnterior>(`${this.baseUrl}/peso/${id}`,peso);
  }

  actualizarMesPeso(id:string, mesPeso:MesPeso){
    return this.http.patch<MesPeso>(`${this.baseUrl}/mes-peso/${id}`,mesPeso);
  }

  getVacasByLoteId(id:string): Observable<Vaca[]>{
    return this.http.get<Vaca[]>(`${this.baseUrl}/vacas/lote/${id}`)
  }

}
