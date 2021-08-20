import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ForumComponent } from './components/forum/forum.component';
import { HomeComponent } from './components/home/home.component';
import { InitiativeCreateComponent } from './components/initiatives/initiative-create/initiative-create.component';
import { InitiativeDetailComponent } from './components/initiatives/initiative-detail/initiative-detail.component';
import { InitiativeEditComponent } from './components/initiatives/initiative-edit/initiative-edit.component';
import { InitiativesComponent } from './components/initiatives/initiatives.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Route[] = [
  { path: 'home', component: HomeComponent },
  { path: 'initiatives/new', component: InitiativeCreateComponent },
  { path: 'initiatives/edit/:id', component: InitiativeEditComponent },
  { path: 'initiatives/:id', component: InitiativeDetailComponent },
  { path: 'initiatives', component: InitiativesComponent },
  { path: 'forum/:id', component: ForumComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
