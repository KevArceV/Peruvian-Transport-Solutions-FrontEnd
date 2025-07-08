import { Routes } from '@angular/router';

import { PagoComponent } from './components/pago/pago.component';
import { InsertarpagoComponent } from './components/pago/insertarpago/insertarpago.component';

import { ItemComponent } from './components/item/item.component';
import { InsertaritemComponent } from './components/item/insertaritem/insertaritem.component';
import { RolComponent } from './components/rol/rol.component';
import { InsertarrolComponent } from './components/rol/insertarrol/insertarrol.component';

import { EstadoComponent } from './components/estado/estado.component';
import { InsertarestadoComponent } from './components/estado/insertarestado/insertarestado.component';
import { ViajeComponent } from './components/viaje/viaje.component';
import { InsertarviajeComponent } from './components/viaje/insertarviaje/insertarviaje.component';
import { BusComponent } from './components/bus/bus.component';
import { ListarbusComponent } from './components/bus/listarbus/listarbus.component';

import { InsertarusuarioComponent } from './components/usuario/insertarusuario/insertarusuario.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { HomeComponent } from './components/home/home.component';
import { ReseniaComponent } from './components/resenia/resenia.component';
import { InsertarreseniaComponent } from './components/resenia/insertarresenia/insertarresenia.component';
import { ListarreseniaComponent } from './components/resenia/listarresenia/listarresenia.component';
import { LoginComponent } from './components/login/login.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { ReporteuserbyrolComponent } from './components/reportes/reporteuserbyrol/reporteuserbyrol.component';
import { InsertarasientoComponent } from './components/asiento/insertarasiento/insertarasiento.component';
import { AsientoComponent } from './components/asiento/asiento.component';
import { ListaritemComponent } from './components/item/listaritem/listaritem.component';
import { ReservaBoletoComponent } from './components/reserva-boleto/reserva-boleto.component';
import { InsertarreservaBoletoComponent } from './components/reserva-boleto/insertarreserva-boleto/insertarreserva-boleto.component';
import { ListarreservanBoletoComponent } from './components/reserva-boleto/listarreserva-boleto/listarreservan-boleto.component';
import { InsertarbusComponent } from './components/bus/insertarbus/insertarbus.component';
import { RutaComponent } from './components/ruta/ruta.component';
import { InsertarrutaComponent } from './components/ruta/insertarruta/insertarruta.component';
import { ItemUsuarioComponent } from './components/item-usuario/item-usuario.component';

import { seguridadGuard } from './guard/seguridad.guard';
import { ReporteasientoporbusComponent } from './components/reportes/reporteasientoporbus/reporteasientoporbus.component';
import { ReportepaymentsbytypeComponent } from './components/reportes/reportepaymentsbytype/reportepaymentsbytype.component';
import { InsertaritemusuarioComponent } from './components/item-usuario/insertaritem-usiario/insertaritem-usiario.component';
import { ReporteitemusuariotopComponent } from './components/reportes/reporteitemusuariotop/reporteitemusuariotop.component';



export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component:LoginComponent
  },
  {
    path: 'home',
    component:HomeComponent
  },
  {
  path:'rutaUsuario', component:UsuarioComponent,
  children:[
    {
      path:'insertar', component:InsertarusuarioComponent
    },

    {
      path:'actualizaciones/:id', component:InsertarusuarioComponent
    }
  ],
  canActivate: [seguridadGuard],
},
  {
  path:'rutaPago', component:PagoComponent,
  children:[
    {
      path:'insertar', component:InsertarpagoComponent
    },

    {
      path:'actualizaciones/:id', component:InsertarpagoComponent
    }
  ],
  canActivate: [seguridadGuard],
},
{
  path: 'rutaResenia',
  component: ReseniaComponent,
  children: [
     { path: '', component: ListarreseniaComponent }, // este path vacío actúa como default
    {
      path: 'insertar',
      component: InsertarreseniaComponent
    },
    {
      path: 'actualizaciones/:id',
      component: InsertarreseniaComponent
    }
  ],
  canActivate: [seguridadGuard],
},
{
  path: 'rutaEstado',
  component: EstadoComponent,
  children: [
    {
      path: 'insertar',
      component: InsertarestadoComponent
    },
    {
      path: 'actualizaciones/:id',
      component: InsertarestadoComponent
    }
  ],
  canActivate: [seguridadGuard],
},
{
  path: 'rutaRol',
  component: RolComponent,
  children: [
    {
      path: 'insertar',
      component: InsertarrolComponent
    },
    {
      path: 'actualizaciones/:id',
      component: InsertarrolComponent
    }
  ],
  canActivate: [seguridadGuard],
},
{
    path: 'rutareportes',
    component: ReportesComponent,
    children: [
    {
      path: 'userbyrol',
      component: ReporteuserbyrolComponent
    },
    {
      path: 'seatsperbus',
      component: ReporteasientoporbusComponent
    },
    {
      path: 'paymentsbytype',
      component: ReportepaymentsbytypeComponent
    },
    {
      path: 'topitem',
      component: ReporteitemusuariotopComponent
    }
    ],canActivate: [seguridadGuard],
  },
{
  path:'rutaAsiento', component:AsientoComponent,
  children:[
    {
      path:'insertar', component:InsertarasientoComponent
    },

    {
      path:'actualizaciones/:id', component:InsertarasientoComponent
    }
  ],canActivate: [seguridadGuard],
},
{
  path:'rutaItem', component:ItemComponent,
  children:[
    {
      path:'insertar', component:InsertaritemComponent
    },

    {
      path:'actualizaciones/:id', component:InsertaritemComponent
    }
  ],canActivate: [seguridadGuard],
},
{
  path:'rutaReservaBoleto', component:ReservaBoletoComponent,
  children:[
    {
      path:'insertar', component:InsertarreservaBoletoComponent
    },

    {
      path:'actualizaciones/:id', component:InsertarreservaBoletoComponent
    }
  ],canActivate: [seguridadGuard],
},
{
  path:'rutaViaje', component:ViajeComponent,
  children:[
    {
      path:'insertar', component:InsertarviajeComponent
    },

    {
      path:'actualizaciones/:id', component:InsertarviajeComponent
      }
  ],canActivate: [seguridadGuard],
},
{
  path:'rutaBus', component:BusComponent,
  children:[
    {
      path:'insertar', component:InsertarbusComponent
    },

    {
      path:'actualizaciones/:id', component:InsertarbusComponent
      }
  ],canActivate: [seguridadGuard],
},
{
  path:'rutaRuta', component:RutaComponent,
  children:[
    {
      path:'insertar', component:InsertarrutaComponent
    },

    {
      path:'actualizaciones/:id', component:InsertarrutaComponent
      }
  ],canActivate: [seguridadGuard],
},
{
  path:'rutaItemUsuario', component:ItemUsuarioComponent,
  children:[
    {
      path:'insertar', component:InsertaritemusuarioComponent
    },

    {
      path:'actualizaciones/:id', component:InsertaritemusuarioComponent
      }
  ],canActivate: [seguridadGuard],
}
];