import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Comment } from '../domain/models/comment.model';
import { CommentDto } from '../domain/dtos/comment.dto';
import { DeleteActionResponse } from '../domain/dtos/delete-action-response.dto';
import { Forum } from '../domain/models/forum.model';

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getForumForInitiative(initiativeId: number): Observable<Forum | undefined> {
    return this.http
      .get<Forum | undefined>(`/api/forum/for-initiative/${initiativeId}`)
      .pipe(catchError(this.errorHandler('getForumForInitiative')));
  }

  getCommentsForForum(forumId: number): Observable<Comment[] | undefined> {
    return this.http
      .get<Comment[] | undefined>(`/api/forum/comments/for-forum/${forumId}`)
      .pipe(catchError(this.errorHandler('getCommentsForForum')));
  }

  addNewComment(commentDto: CommentDto): Observable<Comment | undefined> {
    return this.http
      .post<Comment | undefined>('/api/forum/comments/new', commentDto)
      .pipe(catchError(this.errorHandler('addNewComment')));
  }

  likeComment(commentId: number): Observable<Comment | undefined> {
    return this.http
      .put<Comment | undefined>(`/api/forum/comments/${commentId}/like`, {})
      .pipe(catchError(this.errorHandler('likeComment')));
  }

  dislikeComment(commentId: number): Observable<Comment | undefined> {
    return this.http
      .put<Comment | undefined>(`/api/forum/comments/${commentId}/dislike`, {})
      .pipe(catchError(this.errorHandler('dislikeComment')));
  }

  editComment(
    commentId: number,
    commentDto: CommentDto
  ): Observable<Comment | undefined> {
    return this.http
      .put<Comment | undefined>(
        `/api/forum/comments/${commentId}/edit`,
        commentDto
      )
      .pipe(catchError(this.errorHandler('editComment')));
  }

  deleteComment(
    commentId: number
  ): Observable<DeleteActionResponse | undefined> {
    return this.http
      .delete<DeleteActionResponse | undefined>(
        `/api/forum/comments/${commentId}/delete`
      )
      .pipe(catchError(this.errorHandler('deleteComment')));
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
