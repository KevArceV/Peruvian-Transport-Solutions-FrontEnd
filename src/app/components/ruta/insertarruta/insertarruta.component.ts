import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnInit,
  AfterViewInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { RutaService } from '../../../services/Ruta.service';
import { Item } from '../../../models/Item';
import { ItemService } from '../../../services/Item.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ruta } from '../../../models/Ruta';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-insertarruta',
  imports: [CommonModule, FormsModule],
  templateUrl: './insertarruta.component.html',
  styleUrl: './insertarruta.component.css'
})
export class InsertarrutaComponent implements OnInit, AfterViewInit {
  private L: any;
  map!: any;
  marker!: any;
  

  // estado del formulario
  listaItem: Item[] = [];
  selectedItemId: number | null = null;

  // para distinguir insert / update
  edicion = false;
  idRuta = 0;
  ruta: Ruta = new Ruta();

  constructor(
    private rutaService: RutaService,
    private itemService: ItemService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // 1) Cargo lista de items
    this.itemService.list().subscribe(items => this.listaItem = items);

    // 2) Verifico si vienen params para edición, y cargo la ruta
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.edicion = true;
        this.idRuta = +params['id'];
        this.rutaService.listId(this.idRuta)
          .subscribe(existing => {
            this.ruta = existing;
            this.selectedItemId = existing.item.idItem;
            // si el mapa ya está listo, pintamos el marcador
            if (this.map) {
              this.placeMarker(this.ruta.lat, this.ruta.lng);
              this.map.setView([this.ruta.lat, this.ruta.lng], 13);
            }
          });
      }
    });
  }

  ngAfterViewInit(): void {
    // 3) Carga dinámica de Leaflet (solo en navegador)
    if (isPlatformBrowser(this.platformId)) {
      import('leaflet').then(L => {
        this.L = L;
        // ajuste rutas iconos
        delete (this.L.Icon.Default.prototype as any)._getIconUrl;
        this.L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/assets/images/leaflet/marker-icon-2x.png',
          iconUrl:       '/assets/images/leaflet/marker-icon.png',
          shadowUrl:     '/assets/images/leaflet/marker-shadow.png'
        });
        this.initMap();
      });
    }
  }

  private initMap(): void {
    const L = this.L;
  this.map = L.map('map').setView([-12.0464, -77.0428], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(this.map);

  // Si estamos en edición, ya colocamos el marker… (omito para brevedad)

  this.map.on('click', (e: any) => {
    // Antes: return this.snackBar.open(...);  <-- elimina esta forma
    if (!this.selectedItemId) {
      this.snackBar.open('Selecciona primero un Item.', 'Cerrar', { duration: 3000 });
      return;    // ← ahora devolvemos void
    }

    const { lat, lng } = e.latlng;
    this.ruta.lat = lat;
    this.ruta.lng = lng;
    this.placeMarker(lat, lng);
    // No return aquí: también void
  });

  }

  private placeMarker(lat: number, lng: number) {
     const L = this.L;
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng])
        .addTo(this.map)
        .bindPopup(`
          Item=${this.selectedItemId}<br>
          Lat=${lat.toFixed(5)}, Lng=${lng.toFixed(5)}
        `);
    }
    this.marker.openPopup();
  }

  aceptar(): void {
    // validaciones mínimas
    if (!this.selectedItemId) {
      this.snackBar.open('Debes escoger un Item.', 'Cerrar', { duration: 3000 });
      return;
    }
    if (this.ruta.lat === 0 && this.ruta.lng === 0) {
      this.snackBar.open('Haz clic en el mapa para elegir posición.', 'Cerrar', { duration: 3000 });
      return;
    }

    // vinculamos FK
    this.ruta.item = new Item();
    this.ruta.item.idItem = this.selectedItemId!;

    // elegimos insert o update
    const obs = this.edicion
      ? this.rutaService.update(this.ruta)
      : this.rutaService.insert(this.ruta);

    obs.subscribe({
      next: () => {
        const msg = this.edicion ? 'Ruta actualizada.' : 'Ruta creada.';
        this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
        // volver al listado (ajusta la ruta a tu app)
        this.router.navigate(['/rutaRuta']);
      },
      error: err => {
        console.error(err);
        this.snackBar.open('Error guardando la ruta.', 'Cerrar', { duration: 5000 });
      }
    });
  }
}
