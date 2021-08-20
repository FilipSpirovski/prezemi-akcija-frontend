import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { InitiativeDto } from 'src/app/domain/dtos/initiative.dto';
import { Initiative } from 'src/app/domain/models/initiative.model';
import { InitiativeService } from 'src/app/services/initiative.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-initiative-create',
  templateUrl: './initiative-create.component.html',
  styleUrls: ['./initiative-create.component.css'],
})
export class InitiativeCreateComponent implements OnInit {
  initiativeForm;
  newInitiative$: Subject<InitiativeDto>;
  initiative$: Observable<Initiative | undefined>;

  constructor(
    private fb: FormBuilder,
    private initiativeService: InitiativeService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.initiativeForm = this.fb.group({
      categoryName: ['', Validators.required],
      title: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(255)]),
      ],
      description: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(1000)]),
      ],
      scheduledFor: [
        '',
        Validators.compose([Validators.required, this.dateValidator]),
      ],
      eventTypeName: ['', Validators.required],
      location: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(255)]),
      ],
    });

    this.newInitiative$ = new Subject<InitiativeDto>();

    this.initiative$ = this.newInitiative$.pipe(
      mergeMap((initiativeDto) =>
        this.initiativeService.createNewInitiative(initiativeDto)
      )
    );
  }

  ngOnInit(): void {
    if (!this.userService.isUserSignedIn()) {
      this.router.navigate(['/login']);
    }

    this.initiative$.subscribe((initiative) => {
      if (initiative !== undefined) {
        this.toastr.success('Initiative successfully created!');

        this.router.navigate(['/initiatives']);
      } else {
        this.router.navigate(['/initiatives/new']);
      }
    });
  }

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const scheduledFor: string = control.value;

      return new Date() < new Date(scheduledFor)
        ? null
        : {
            invalidDate: true,
          };
    };
  }

  get categoryName(): FormControl {
    return this.initiativeForm.get('categoryName');
  }

  get title(): FormControl {
    return this.initiativeForm.get('title');
  }

  get description(): FormControl {
    return this.initiativeForm.get('description');
  }

  get scheduledFor(): FormControl {
    return this.initiativeForm.get('scheduledFor');
  }

  get eventTypeName(): FormControl {
    return this.initiativeForm.get('eventTypeName');
  }

  get location(): FormControl {
    return this.initiativeForm.get('location');
  }

  onSubmit(): void {
    const initiativeDto: InitiativeDto = {
      categoryName: this.categoryName.value,
      title: this.title.value,
      description: this.description.value,
      scheduledFor: this.scheduledFor.value,
      eventTypeName: this.eventTypeName.value,
      location: this.location.value,
    };
    this.newInitiative$.next(initiativeDto);
  }

  onCancel(): void {
    this.router.navigate(['/home']);
  }
}
