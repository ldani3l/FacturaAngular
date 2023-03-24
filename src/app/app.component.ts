import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Factura } from './models/factura.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Producto } from './models/producto.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'facturas-cafe-britt';


  factura: Factura = {
    DETALLES: [],
    FACTURA: {
      TOTAL: 0,
      FECHA: '',
      NUMERO_FACTURA: 0,
      USUARIO:  ''
    }
  };

  facturaForm!: FormGroup;
  dataFecha!:   string;
  datafactura!: number;
  dataTotal:    number = 0;
  respuesta:    string = '';
  productos!:   Producto[];
  producto!:    Producto;

  constructor(private http: HttpClient, private readonly fb: FormBuilder) { }
  ngOnInit(): void{
    this.facturaForm = this.initForm();
    this.getProductos();
  }

  initForm(): FormGroup {
    return this.fb.group({
      fecha:          ['', [Validators.required]],
      numero_factura: ['', [Validators.required]],
      producto:       ['', [Validators.required]],
      cantidad:       ['', [Validators.required]],
    })
  }

  agregarDetalle(){
    let producto = this.facturaForm.value['producto'];
    let cantidad = this.facturaForm.value['cantidad'];

    this.http.get(`https://api.cafebritt.com/develop/test/functions/api.cfc?method=AgregaDetalle&token=7878454500&codigo_articulo=${producto}&cantidad=${cantidad}&numero_factura=${this.datafactura}`)
     .subscribe((data: any) => {
        this.respuesta = data.ALERTA;
        let obj = <Producto> this.productos.find(o => o.CODIGO_ARTICULO == producto);
        obj.CANTIDAD = cantidad;
        obj.TOTAL_LINEA = obj.PRECIO * cantidad;
        this.factura ? this.factura.DETALLES.push(obj) : '';
        console.log(this.factura);
        this.dataTotal = this.dataTotal + obj.TOTAL_LINEA;
     });
  }

  getProductos(){
    this.http.get(`https://api.cafebritt.com/develop/test/functions/api.cfc?method=BuscarProducto&token=7878454500&producto=`)
      .subscribe((data: any) => {
        this.productos = data.PRODUCTOS;
        console.log(this.productos)
      });
  }

  delDetalle(code: number){
    this.http.get(`https://api.cafebritt.com/develop/test/functions/api.cfc?method=BorrarDetalle&token=7878454500&linea=${code}&numero_factura=${this.factura.FACTURA.NUMERO_FACTURA}`)
      .subscribe((data: any) => {
        this.respuesta = data.ALERTA;
        delete this.factura.DETALLES[code];
        console.log(this.factura);
      });
  }

  crearFactura(){
    let numero_factura = this.facturaForm.value['numero_factura'];
    let fecha = this.facturaForm.value['fecha'] ?? '';
    this.http.get(`https://api.cafebritt.com/develop/test/functions/api.cfc?method=CreaFactura&token=7878454500&numero_factura=${numero_factura}&fecha=${fecha}`)
      .subscribe((data: any) => {
        this.respuesta = data.ALERTA;
        this.dataFecha = fecha;
        this.datafactura = numero_factura;
        if(this.factura){
          this.factura.FACTURA.FECHA = fecha;
          this.factura.FACTURA.NUMERO_FACTURA = numero_factura;
        }
        console.log(this.factura);
      });
  }

}
