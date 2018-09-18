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
  MatGridListModule,
  MatRadioModule,
  MatDialogModule,
  MatSlideToggleModule,
  MatMenuModule,
  MatTooltipModule
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
    MatGridListModule,
    MatRadioModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatTooltipModule
  ]
})
export class AppMaterialModule {}
