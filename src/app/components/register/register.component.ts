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
import { JWTResponse } from 'src/app/domain/dtos/jwt-response.dto';
import { RegistrationDto } from 'src/app/domain/dtos/registration.dto';
import { UserDto } from 'src/app/domain/dtos/user.dto';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registrationForm;
  register$: Subject<RegistrationDto>;
  token$: Observable<JWTResponse | undefined>;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.maxLength(255),
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
        ]),
      ],
      name: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(255)]),
      ],
      surname: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(255)]),
      ],
    });

    this.register$ = new Subject<RegistrationDto>();

    this.token$ = this.register$.pipe(
      mergeMap((registrationDto) =>
        this.userService.registerNewUser(registrationDto)
      )
    );
  }

  ngOnInit(): void {
    this.token$.subscribe((jwtResponse) => {
      if (jwtResponse !== undefined) {
        this.toastr.success('Successful registration!');

        const currentUser: UserDto = {
          email: jwtResponse.email,
          jwt: jwtResponse.jwt,
        };
        this.userService.saveCurrentUser(currentUser);

        this.router.navigate(['/home']);
      } else {
        this.registrationForm.reset();
      }
    });
  }

  matchingPasswordsValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password: string = group.get('password').value;
      const confirmPassword: string = group.get('confirmPassword').value;

      return password === confirmPassword
        ? null
        : {
            passwordsDoNotMatch: true,
          };
    };
  }

  get email(): FormControl {
    return this.registrationForm.get('email');
  }

  get password(): FormControl {
    return this.registrationForm.get('password');
  }

  get name(): FormControl {
    return this.registrationForm.get('name');
  }

  get surname(): FormControl {
    return this.registrationForm.get('surname');
  }

  onSubmit(): void {
    const registrationDto: RegistrationDto = {
      email: this.email.value,
      password: this.password.value,
      confirmPassword: this.password.value,
      role: 'ROLE_USER',
      name: this.name.value,
      surname: this.surname.value,
    };
    this.register$.next(registrationDto);

    this.router.navigate(['/home']);
  }

  onCancel(): void {
    this.router.navigate(['/home']);
  }
}
