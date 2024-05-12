// Components
import { SuccessfullRegistrationComponent } from './successfull-registration/successfull-registration.component';
import { VerificationCodeComponent } from './verification-code/verification-code.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { RegistrationV1Component } from './registration-v1/registration-v1.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginComponent } from "./login/login.component";
// TS Files for child routes
import { errorsChildrenRoutes } from '../errors/errors-children-routes';

export const authChildrenRoutes: any[] = [
  { path: '', redirectTo: '/Auth/Login', pathMatch: 'full' },
  {
    path: 'Login',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'Register',
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
  // Errors
  {
    path: ':lang/Errors',
    loadComponent: () =>
      import('./../../components/errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  },
  {
    path: 'Errors',
    loadComponent: () =>
      import('./../../components/errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  },
  { path: '**', redirectTo: '/en/Errors' } // Redirect all unknown paths to '/Errors'
];
