import { Routes } from '@angular/router';
import { StocksListComponent } from './stocks/stocks-list.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'stocks' },
    { path: 'stocks', component: StocksListComponent },
];
