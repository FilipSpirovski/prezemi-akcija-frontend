import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { InitiativeDto } from 'src/app/domain/dtos/initiative.dto';
import { Initiative } from 'src/app/domain/models/initiative.model';
import { InitiativeService } from 'src/app/services/initiative.service';

@Component({
  selector: 'app-initiative-edit',
  templateUrl: './initiative-edit.component.html',
  styleUrls: ['./initiative-edit.component.css'],
})
export class InitiativeEditComponent implements OnInit {
  initiativeForm;
  editInitiative$: Subject<InitiativeDto>;
  putInitiative$: Observable<Initiative | undefined>;
  initiative$: Observable<Initiative | undefined>;
  initiative: Initiative | undefined;

  constructor(
    private fb: FormBuilder,
    private initiativeService: InitiativeService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
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

    this.initiative$ = this.route.paramMap.pipe(
      map((paramMap) => +paramMap.get('id')),
      mergeMap((id) => this.initiativeService.getInitiativeById(id))
    );

    this.editInitiative$ = new Subject<InitiativeDto>();

    this.putInitiative$ = this.editInitiative$.pipe(
      mergeMap((initiativeDto) =>
        this.initiativeService.editInitiative(this.initiative.id, initiativeDto)
      )
    );
  }

  ngOnInit(): void {
    this.initiative$.subscribe((initiative) => {
      this.initiative = initiative;

      this.initiativeForm.patchValue(initiative);
      this.categoryName.setValue(initiative.category);
      this.eventTypeName.setValue(initiative.eventType);
    });

    this.putInitiative$.subscribe((initiative) => {
      if (initiative !== undefined) {
        this.toastr.success('Initiative successfully updated!');

        this.router.navigate(['/initiatives']);
      } else {
        this.router.navigate(['/initiatives/edit', this.initiative.id]);
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

    this.editInitiative$.next(initiativeDto);
  }

  onCancel(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
