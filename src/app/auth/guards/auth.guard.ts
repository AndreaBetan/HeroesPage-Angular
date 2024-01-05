import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, UrlSegment, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../servicies/auth.service';


@Injectable({providedIn: 'root'})
export class AuthGuard implements CanMatch, CanActivate {

  constructor( private authService: AuthService, private router: Router ) { }

  private checkAuthStatus (): boolean | Observable<boolean> {
    return this.authService.checkAuthentication()
    .pipe(
      tap( isAuthenticated => {
        if(!isAuthenticated)
          this.router.navigate(['./auth/login'])
      })
      )
  }

  // CanMatch: Para entrar a una ruta que hace match con el url
  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    // console.log('Can Match')
    // console.log({ route, segments})

    return this.checkAuthStatus();
  }
  // CanActivate: Activa una ruta en particular
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    // console.log('Can Activate')
    // console.log({ route, state})

    return this.checkAuthStatus();
  }

}
