import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from 'src/environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = environments.baseUrl
  // En algunas ocaciones no abra usuario, por lo cual se pone ?
  private user?: User;

  constructor(private http: HttpClient, private router: Router) { }

  get currentUser(): User | undefined {
    // Si el user no existe
    if( !this.user ) return undefined;
    // structuredClone crea un clone del objeto con todas sus props, similar al ...
    return structuredClone( this.user )
  }


  login( email: string, password: string ):Observable<User> {
    // http.post('login',{ email, password });
    return this.http.get<User>(`${ this.baseUrl }/users/1`)
      .pipe(
        // Efectos secundarios
          //1.Obtener el user
        tap( user => this.user = user ),
          // 2. Almacernarlo en el localStorage
        tap( user => localStorage.setItem('token', 'aASDgjhasda.asdasd.aadsf123k' )),
      );
  }

  // Este metodo se debe injectar en los guards para validar
  checkAuthentication(): Observable<boolean>{
    // 1. Validar si el usuario no esta autenticado( no cuenta con token)
    if( !localStorage.getItem('token') ) return of(false)

    const token = localStorage.getItem('token')

    //2. Si esta autenticado almacenar el token
    return this.http.get<User>(`${ this.baseUrl}/users/1`)
      .pipe(
         //2.1.Obtener el user
        tap( user => this.user = user),
          // La !! indica que user es true( es decir que cuenta con un valor diferente a undefined)
        map( user => !!user),
        catchError( err => of(false))
      )
  }

  logout(){
    this.user = undefined;
    localStorage.clear()
  }

}
