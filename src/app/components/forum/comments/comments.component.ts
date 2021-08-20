import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { CommentDto } from 'src/app/domain/dtos/comment.dto';
import { Comment } from 'src/app/domain/models/comment.model';
import { ForumService } from 'src/app/services/forum.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {
  populateData$: Subject<void>;
  comments$: Observable<Comment[] | undefined>;
  comments: Comment[] | undefined;
  @Input() forumId: number;
  commentControl: FormControl;
  newComment$: Subject<CommentDto>;
  comment$: Observable<Comment | undefined>;

  constructor(
    private forumService: ForumService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.populateData$ = new Subject<void>();

    this.comments$ = this.populateData$.pipe(
      mergeMap(() => this.forumService.getCommentsForForum(this.forumId))
    );

    this.commentControl = new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
    ]);

    this.newComment$ = new Subject<CommentDto>();

    this.comment$ = this.newComment$.pipe(
      mergeMap((commentDto) => this.forumService.addNewComment(commentDto))
    );
  }

  ngOnInit(): void {
    if (!this.userService.isUserSignedIn()) {
      this.router.navigate(['/login']);
    }

    this.comments$.subscribe((comments) => (this.comments = comments));

    this.populateData$.next();

    this.comment$.subscribe((comment) => {
      if (comment !== undefined) {
        this.toastr.success('Comment successfully added!');
      }

      this.populateData$.next();
    });
  }

  get comment(): FormControl {
    return this.commentControl;
  }

  onSubmit(): void {
    const commentDto: CommentDto = {
      forumId: this.forumId,
      text: this.comment.value,
    };

    this.newComment$.next(commentDto);

    this.commentControl.reset();
  }

  isUserSubmitterOfComment(submitterEmail: string): boolean {
    return this.userService.isUserSubmitterOfComment(submitterEmail);
  }

  deleteComment(commentId: number): void {
    this.forumService.deleteComment(commentId).subscribe((message) => {
      if (message !== undefined) {
        this.toastr.success('Comment successfully deleted!');
      }

      this.populateData$.next();
    });
  }
}
