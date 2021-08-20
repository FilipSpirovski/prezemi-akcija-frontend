import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Forum } from 'src/app/domain/models/forum.model';
import { ForumService } from 'src/app/services/forum.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
})
export class ForumComponent implements OnInit {
  forum$: Observable<Forum | undefined>;
  forum: Forum | undefined;

  constructor(
    private forumService: ForumService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.forum$ = this.route.paramMap.pipe(
      map((paramMap) => +paramMap.get('id')),
      mergeMap((id) => this.forumService.getForumForInitiative(id))
    );
  }

  ngOnInit(): void {
    if (!this.userService.isUserSignedIn()) {
      this.router.navigate(['/login']);
    }

    this.forum$.subscribe((forum) => (this.forum = forum));
  }
}
