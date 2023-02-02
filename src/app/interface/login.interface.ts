export interface Login{
    usuario: Usuario;
    token:string;
}

export interface Usuario{
    id: string;
    email: string;
    password: string;
}