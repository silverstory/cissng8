import { Component, OnInit } from '@angular/core';
import { PrintService } from '../print.service';

@Component({
  selector: 'app-tite',
  templateUrl: './tite.component.html',
  styleUrls: ['./tite.component.css']
})
export class TiteComponent implements OnInit {

  constructor(public printService: PrintService) { }

  onPrintInvoice() {
    const invoiceIds = ['101', '102'];
    this.printService
      .printDocument('invoice', invoiceIds);
  }

  ngOnInit() {
  }

}