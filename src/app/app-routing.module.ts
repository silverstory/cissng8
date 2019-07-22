import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EmployeeComponent } from './employee/employee.component';
import { VisitorComponent } from './visitor/visitor.component';
import { ResidentComponent } from './resident/resident.component';
import { AuthGuard } from './auth/auth.guard';
import { ProfileNotFoundComponent } from './profile-not-found/profile-not-found.component';
import { OPIDComponent } from './op-id/op-id.component';
import { AccessApprovalComponent } from './access-approval/access-approval.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { PrintLayoutComponent } from './print-layout/print-layout.component';
import { PrintComponent } from './print/print.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard], pathMatch: 'full' },
  { path: 'print',
    outlet: 'print',
    component: PrintLayoutComponent,
    children: [
      { path: 'invoice/:invoiceIds', component: InvoiceComponent }
    ]
  },
  {
    path: 'print/:token',
    component: PrintComponent,
    canActivate: [AuthGuard],
    data: { state: 'op-id' },
    runGuardsAndResolvers: 'paramsChange'
  },
  { path: 'OP-ID/:text', component: OPIDComponent, data: { state: 'op-id' }, runGuardsAndResolvers: 'paramsChange' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'signup', component: SignupComponent, pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], pathMatch: 'full' },
  { path: 'access-approval', component: AccessApprovalComponent, canActivate: [AuthGuard], pathMatch: 'full' },
  {
    path: 'employee/:id',
    component: EmployeeComponent,
    data: { state: 'employee' },
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'paramsChange'
  },
  {
    path: 'visitor/:id',
    component: VisitorComponent,
    data: { state: 'visitor' },
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'paramsChange'
  },
  {
    path: 'resident/:id',
    component: ResidentComponent,
    data: { state: 'resident' },
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'paramsChange'
  },
  { path: 'profilenotfound', component: ProfileNotFoundComponent, data: { state: 'profilenotfound' }, canActivate: [AuthGuard] },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'}) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }

// Reloading current route in Angular 5
// There are two possible values for onSameUrlNavigation ’reload’ or false. The default value is false, causing nothing to happen when the router is asked to navigate to the active route. We want to set this value to reload. It is worth noting reload does not actually do the work of reloading the route, it only re-triggers events on the router that we then need to hook into.
// To determine how those events are actually fired, you need to specify the runGuardsAndResolvers configuration option on your route. This can take one of three values
// paramsChange — only fire when route params have changed e.g. where the id in /user/:id changes
// paramsOrQueryParamsChange — fire when a route param changes or a query param changes. e.g. the id or the limit property change in /user/:id/invites?limit=10
// always — Always fire when the route is navigated
// With these two changes your router is configured. The next step is to handle the events that your router will produce within one of your components. To do this you will need to import the Router into your component and then hook into the events of interest. In this example, I have hooked into the NavigationEnd event which is fired once the router has completed its navigation from one route to another. Due to the way we have configured the app, this will now fire even if you try to navigate to the current route.
