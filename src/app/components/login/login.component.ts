import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { JWTResponse } from 'src/app/domain/dtos/jwt-response.dto';
import { LoginDto } from 'src/app/domain/dtos/login.dto';
import { UserDto } from 'src/app/domain/dtos/user.dto';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm;
  login$: Subject<LoginDto>;
  token$: Observable<JWTResponse | undefined>;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
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
    });

    this.login$ = new Subject<LoginDto>();

    this.token$ = this.login$.pipe(
      mergeMap((loginDto) => this.userService.logIn(loginDto))
    );
  }

  ngOnInit(): void {
    this.token$.subscribe((jwtResponse) => {
      if (jwtResponse !== undefined) {
        this.toastr.success('Successful sign-in!');

        const currentUser: UserDto = {
          email: jwtResponse.email,
          jwt: jwtResponse.jwt,
        };
        this.userService.saveCurrentUser(currentUser);

        this.router.navigate(['/home']);
      } else {
        this.loginForm.reset();
      }
    });
  }

  get email(): FormControl {
    return this.loginForm.get('email');
  }

  get password(): FormControl {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    const loginDto: LoginDto = {
      email: this.email.value,
      password: this.password.value,
    };
    this.login$.next(loginDto);
  }

  onCancel(): void {
    this.router.navigate(['/home']);
  }
}
