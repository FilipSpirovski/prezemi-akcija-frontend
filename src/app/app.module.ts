import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbAccordionModule,
  NbActionsModule,
  NbBadgeModule,
  NbButtonModule,
  NbCardModule,
  NbContextMenuModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbMenuModule,
  NbRouteTabsetModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTabsetModule,
  NbTagModule,
  NbThemeModule,
  NbUserModule,
} from '@nebular/theme';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { InitiativesComponent } from './components/initiatives/initiatives.component';
import { ForumComponent } from './components/forum/forum.component';
import { InitiativeDetailComponent } from './components/initiatives/initiative-detail/initiative-detail.component';
import { CommentsComponent } from './components/forum/comments/comments.component';
import { InitiativeCreateComponent } from './components/initiatives/initiative-create/initiative-create.component';
import { InitiativeEditComponent } from './components/initiatives/initiative-edit/initiative-edit.component';
import { ToastrModule } from 'ngx-toastr';
import { jwtAuthenticationInterceptor } from './services/interceptors/jwt-authentication.interceptor';
import { ShortDescriptionPipe } from './services/pipes/short-description.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    InitiativesComponent,
    ForumComponent,
    InitiativeDetailComponent,
    CommentsComponent,
    InitiativeCreateComponent,
    InitiativeEditComponent,
    ShortDescriptionPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
    }),
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NbThemeModule.forRoot(),
    NbEvaIconsModule,
    NbLayoutModule,
    NbCardModule,
    NbActionsModule,
    NbButtonModule,
    NbIconModule,
    NbBadgeModule,
    NbAccordionModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbUserModule,
    NbSpinnerModule,
    NbListModule,
    NbMenuModule.forRoot(),
    NbContextMenuModule,
    NbTagModule,
    NbInputModule,
    NbFormFieldModule,
    NbSelectModule,
  ],
  providers: [jwtAuthenticationInterceptor],
  bootstrap: [AppComponent],
})
export class AppModule {}
