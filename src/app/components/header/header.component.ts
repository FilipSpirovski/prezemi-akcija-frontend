import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  checkIfUserIsSignedIn(): boolean {
    return this.userService.isUserSignedIn();
  }

  logOut(): void {
    this.userService.logOut();

    this.toastr.success('Successful sign-out!');

    this.router.navigate(['/home']);
  }
}
