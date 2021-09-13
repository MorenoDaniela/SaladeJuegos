import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/Servicios/chat.service';
import { IngresarService } from 'src/app/Servicios/ingresar.service';
import { Mensaje } from 'src/app/Clases/mensaje';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  mensaje: string;
  listadoMensajesMostrar: Array<Mensaje> = new Array<Mensaje>();
  constructor(public authService: IngresarService, public chatService: ChatService,public router: Router )
  {
  }

  ngOnInit(): void {
    this.cargarMensajes();
  }

  mandarMensaje(){
    this.chatService.enviarMensaje(this.mensaje,this.authService.Usuario.id,this.authService.Usuario.email);
  }


  cargarMensajes(): void {

    this.chatService.MensajesRef.snapshotChanges().pipe(
      map( data => {
        this.listadoMensajesMostrar = new Array<Mensaje>();
        data.map(mensaje =>{
          var mensaje2: Mensaje = new Mensaje();
          mensaje2.email = mensaje.payload.doc.data().email;
          mensaje2.fecha = mensaje.payload.doc.data().fechaMensaje;
          mensaje2.id = mensaje.payload.doc.data().id;
          mensaje2.mensaje = mensaje.payload.doc.data().mensaje;

          if (this.authService.Usuario.id==mensaje.payload.doc.data().id)
          {
            mensaje2.siSoy=true;
          }else
          {
            mensaje2.siSoy=false;
          }
          this.listadoMensajesMostrar.push(mensaje2);
        })
      })
    ).subscribe(datos => {
    });
   }

}
