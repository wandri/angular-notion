import { Routes } from '@angular/router';
import { PageComponent } from './page.component';

export const routes: Routes = [
  { path: ':pageId', component: PageComponent },
  { path: '', component: PageComponent },
];
