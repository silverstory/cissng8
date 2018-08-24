import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatToolbarModule,
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatDividerModule,
  MatIconModule,
  MatSnackBarModule,
  MatGridListModule
} from '@angular/material';

// import {MatDividerModule} from '@angular/material/divider';

@NgModule({
  imports: [CommonModule],
  exports: [
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSnackBarModule,
    MatGridListModule
  ]
})
export class AppMaterialModule {}
