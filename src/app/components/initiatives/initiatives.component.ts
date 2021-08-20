import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Initiative } from 'src/app/domain/models/initiative.model';
import { InitiativeService } from 'src/app/services/initiative.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-initiatives',
  templateUrl: './initiatives.component.html',
  styleUrls: ['./initiatives.component.css'],
})
export class InitiativesComponent implements OnInit {
  populateData$: Subject<void>;
  initiatives$: Observable<Initiative[] | undefined>;

  constructor(
    private service: InitiativeService,
    private userService: UserService,
    private router: Router
  ) {
    this.populateData$ = new Subject<void>();

    this.initiatives$ = this.populateData$.pipe(() =>
      this.service.getInitiatives()
    );
  }

  ngOnInit(): void {
    if (!this.userService.isUserSignedIn()) {
      this.router.navigate(['/login']);
    }

    this.populateData$.next();
  }
}
