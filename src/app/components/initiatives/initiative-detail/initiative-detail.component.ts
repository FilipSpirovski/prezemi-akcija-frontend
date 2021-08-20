import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { DeleteActionResponse } from 'src/app/domain/dtos/delete-action-response.dto';
import { ParticipationNotification } from 'src/app/domain/dtos/participation-notification.dto';
import { Initiative } from 'src/app/domain/models/initiative.model';
import { InitiativeService } from 'src/app/services/initiative.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-initiative-detail',
  templateUrl: './initiative-detail.component.html',
  styleUrls: ['./initiative-detail.component.css'],
})
export class InitiativeDetailComponent implements OnInit {
  initiative$: Observable<Initiative | undefined>;
  initiative: Initiative | undefined;
  participate$: Subject<ParticipationNotification>;
  participation$: Observable<Initiative | undefined>;
  participating: boolean;
  deleteInitiative$: Subject<number>;
  deletedInitiative$: Observable<DeleteActionResponse | undefined>;

  constructor(
    private initiativeService: InitiativeService,
    private userService: UserService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initiative$ = this.route.paramMap.pipe(
      map((paramMap) => +paramMap.get('id')),
      mergeMap((id) => this.initiativeService.getInitiativeById(id))
    );

    this.participate$ = new Subject<ParticipationNotification>();

    this.participation$ = this.participate$.pipe(
      mergeMap((notification) => {
        if (notification.participating) {
          return this.initiativeService.addParticipantToInitiative(
            this.initiative.id
          );
        } else {
          return this.initiativeService.removeParticipantFromInitiative(
            this.initiative.id
          );
        }
      })
    );

    this.deleteInitiative$ = new Subject<number>();

    this.deletedInitiative$ = this.deleteInitiative$.pipe(
      mergeMap((initiativeId) =>
        this.initiativeService.deleteInitiative(initiativeId)
      )
    );
  }

  ngOnInit(): void {
    if (!this.userService.isUserSignedIn()) {
      this.router.navigate(['/login']);
    }

    this.initiative$.subscribe((initiative) => {
      this.initiative = initiative;

      if (initiative !== undefined) {
        this.setParticipation();
      }
    });

    this.participation$.subscribe((initiative) => {
      this.initiative = initiative;

      if (initiative !== undefined) {
        this.toastr.success('Action successfully performed!');

        this.setParticipation();
      }
    });

    this.deletedInitiative$.subscribe((message) => {
      if (message !== undefined) {
        this.toastr.success('Initiative successfully deleted!');

        this.router.navigate(['/initiatives']);
      }
    });
  }

  setParticipation(): void {
    const currentUser = this.userService.getCurrentUser();
    this.participating = this.userService.isUserParticipatingInInitiative(
      currentUser,
      this.initiative
    );
  }

  changeParticipation(): void {
    const currentUser = this.userService.getCurrentUser();
    const notification: ParticipationNotification = {
      jwt: currentUser.jwt,
      participating: !this.participating,
    };
    this.participate$.next(notification);
  }

  isUserCreatorOfInitiative(initiatorEmail: string): boolean {
    return this.userService.isUserCreatorOfInitiative(initiatorEmail);
  }

  deleteInitiative(initiativeId: number): void {
    this.deleteInitiative$.next(initiativeId);
  }
}
