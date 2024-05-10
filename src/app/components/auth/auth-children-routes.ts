import { SuccessfullRegistrationComponent } from './successfull-registration/successfull-registration.component';
import { QuickRegistrationComponent } from './quick-registration/quick-registration.component';
import { VerificationCodeComponent } from './verification-code/verification-code.component';

import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { RegistrationV1Component } from './registration-v1/registration-v1.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ErrorsComponent } from "../errors/errors.component";
import { LoginComponent } from "./login/login.component";

export const authChildrenRoutes: any[] = [
  { path: '', redirectTo: '/Auth/Login', pathMatch: 'full' },
  {
    path: 'Login',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'Register',
    component: QuickRegistrationComponent,
    pathMatch: 'full'
  },
  {
    path: 'Register-V1',
    component: RegistrationV1Component,
    pathMatch: 'full'
  },
  {
    path: 'Successful-registration',
    component: SuccessfullRegistrationComponent,
    pathMatch: 'full'
  },
  {
    path: 'Forget-password',
    component: ForgetPasswordComponent,
    pathMatch: 'full'
  },
  {
    path: 'Verification-code',
    component: VerificationCodeComponent,
    pathMatch: 'full'
  },
  {
    path: 'Reset-password',
    component: ResetPasswordComponent,
    pathMatch: 'full'
  },
  { path: '**', component: ErrorsComponent }
];
