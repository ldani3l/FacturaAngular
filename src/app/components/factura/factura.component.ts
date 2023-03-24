import { Component, OnInit, Input } from '@angular/core';
import { Factura } from 'src/app/models/factura.model';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
})
export class FacturaComponent implements OnInit {

  @Input() factura!: Factura;
  constructor() { }

  ngOnInit(): void { }

}
