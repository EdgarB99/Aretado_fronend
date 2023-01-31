import { MesPeso } from "./mesPeso.interface";
import { PesoAnterior } from "./peso-anterior.interface";

export interface Vaca{
    id:string;
    arete:string;
    fechaNacimiento:string;
    fechaIngreso:string;
    kg:number;
    lb:number;
    usuarioId:string;
    loteId:string;
    razaId:string;
    mesPeso:MesPeso[];
    peso:PesoAnterior;
}

