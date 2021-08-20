import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JWTResponse } from '../domain/dtos/jwt-response.dto';
import { LoginDto } from '../domain/dtos/login.dto';
import { RegistrationDto } from '../domain/dtos/registration.dto';
import { UserDto } from '../domain/dtos/user.dto';
import { Initiative } from '../domain/models/initiative.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  logIn(loginDto: LoginDto): Observable<JWTResponse | undefined> {
    return this.http
      .post<JWTResponse | undefined>('/api/users/sign-in', loginDto)
      .pipe(catchError(this.errorHandler('signIn')));
  }

  saveCurrentUser(user: UserDto) {
    localStorage.clear();
    localStorage.setItem('current-user', JSON.stringify(user));
  }

  getCurrentUser(): UserDto {
    return JSON.parse(localStorage.getItem('current-user'));
  }

  isUserSignedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  isUserParticipatingInInitiative(
    user: UserDto,
    initiative: Initiative
  ): boolean {
    return initiative.participantEmails.includes(user.email);
  }

  isUserCreatorOfInitiative(initiatorEmail: string): boolean {
    return this.isUserSignedIn()
      ? this.getCurrentUser().email === initiatorEmail
      : false;
  }

  isUserSubmitterOfComment(submitterEmail: string): boolean {
    return this.isUserSignedIn()
      ? this.getCurrentUser().email === submitterEmail
      : false;
  }

  logOut(): void {
    localStorage.clear();
  }

  registerNewUser(
    registrationDto: RegistrationDto
  ): Observable<JWTResponse | undefined> {
    return this.http
      .post<JWTResponse | undefined>('/api/users/register', registrationDto)
      .pipe(catchError(this.errorHandler('registerNewUser')));
  }

  errorHandler(methodName: string) {
    return (error: any) => {
      // console.log(`An error occurred in the ${methodName} method`, error);

      if (error.status == 401) {
        this.toastr.error(error.error.message, 'Unauthorized access!');
      } else {
        this.toastr.error(error.error);
      }

      return of(undefined);
    };
  }
}
