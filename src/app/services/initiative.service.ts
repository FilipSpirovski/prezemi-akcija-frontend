import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DeleteActionResponse } from '../domain/dtos/delete-action-response.dto';
import { InitiativeDto } from '../domain/dtos/initiative.dto';
import { Initiative } from '../domain/models/initiative.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class InitiativeService {
  constructor(
    private http: HttpClient,
    private service: UserService,
    private toastr: ToastrService
  ) {}

  getInitiatives(): Observable<Initiative[] | undefined> {
    return this.http
      .get<Initiative[] | undefined>('/api/initiatives')
      .pipe(catchError(this.errorHandler('getInitiatives')));
  }

  getInitiativeById(id: number): Observable<Initiative | undefined> {
    return this.http
      .get<Initiative | undefined>(`/api/initiatives/${id}`)
      .pipe(catchError(this.errorHandler('getInitiativeById')));
  }

  getInitiativesInitiatedBy(): Observable<Initiative[] | undefined> {
    const currentUser = this.service.getCurrentUser();

    return this.http
      .get<Initiative[] | undefined>(
        `/api/initiatives/initiated-by/${currentUser.email}`
      )
      .pipe(catchError(this.errorHandler('getInitiativesInitiatedBy')));
  }

  createNewInitiative(
    initiativeDto: InitiativeDto
  ): Observable<Initiative | undefined> {
    return this.http
      .post<Initiative | undefined>('/api/initiatives/new', initiativeDto)
      .pipe(catchError(this.errorHandler('createNewInitiative')));
  }

  addParticipantToInitiative(
    initiativeId: number
  ): Observable<Initiative | undefined> {
    return this.http
      .put<Initiative | undefined>(
        `/api/initiatives/${initiativeId}/add-participant`,
        {}
      )
      .pipe(catchError(this.errorHandler('addParticipantToInitiative')));
  }

  removeParticipantFromInitiative(
    initiativeId: number
  ): Observable<Initiative | undefined> {
    return this.http
      .put<Initiative | undefined>(
        `/api/initiatives/${initiativeId}/remove-participant`,
        {}
      )
      .pipe(catchError(this.errorHandler('removeParticipantFromInitiative')));
  }

  editInitiative(
    initiativeId: number,
    initiativeDto: InitiativeDto
  ): Observable<Initiative | undefined> {
    return this.http
      .put<Initiative | undefined>(
        `/api/initiatives/${initiativeId}/edit`,
        initiativeDto
      )
      .pipe(catchError(this.errorHandler('editInitiative')));
  }

  deleteInitiative(
    initiativeId: number
  ): Observable<DeleteActionResponse | undefined> {
    return this.http
      .delete<DeleteActionResponse | undefined>(
        `/api/initiatives/${initiativeId}/delete`
      )
      .pipe(catchError(this.errorHandler('deleteInitiative')));
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
