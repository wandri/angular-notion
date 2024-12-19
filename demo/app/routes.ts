import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: ':pageId', component: PageComponent },
      { path: '', component: PageComponent },
    ],
  },
];
