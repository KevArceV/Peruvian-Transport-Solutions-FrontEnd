import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
}
from '@angular/forms';
import { Item } from '../../../models/Item';
import { ItemService } from '../../../services/Item.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-insertaritem',
imports: [
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule],
  templateUrl: './insertaritem.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './insertaritem.component.css'
})
export class InsertaritemComponent implements OnInit{
  form: FormGroup = new FormGroup({});
  item: Item = new Item();
  edicion: boolean = false;
  id: number = 0
  title: string = ""
  description: string = ""
  image: string = ""
  formats:{value:string;viewValue:string}[]=[
    {value:"XLSX",viewValue:"XLSX"},
    {value:"DOCS",viewValue:"DOCS"},
    {value:"PDF",viewValue:"PDF"},
  ]
  constructor(
  private aS: ItemService,
  private formBuilder: FormBuilder,
  private router: Router,  
  private route:ActivatedRoute
  ) {}

  ngOnInit(): void { //se ejecuta primero
    this.route.params.subscribe((data:Params)=>{
      this.id=data['id']
      this.edicion=data['id']!=null //boleano
      //actualiza y trae la data
      this.init()
    });
    this.form = this.formBuilder.group({
      id:[''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      image:['', Validators.required],
      format:['', Validators.required],
    });
  }

  aceptar() {
    if (this.form.valid) {
      this.item.idItem = this.form.value.id;
      this.item.titleItem = this.form.value.title;
      this.item.descriptionItem = this.form.value.description;
      this.item.imageItem = this.form.value.image;
      this.item.formatItem = this.form.value.format;
      

      const request = this.edicion
        ? this.aS.update(this.item)
        : this.aS.insert(this.item);

      request.subscribe(() => {
        this.aS.list().subscribe(data => {
          this.aS.setList(data);
          this.router.navigate(['rutaItem']);
        });
      });
    }
  }

  init() {
    if (this.edicion) {
      this.aS.listId(this.id).subscribe(data => {
        this.form = this.formBuilder.group({
          id: [data.idItem],
          title: [data.titleItem, Validators.required],
          description: [data.descriptionItem, Validators.required],
          image: [data.imageItem, Validators.required],
          format: [data.formatItem, Validators.required],

        });
      });
    }
  }


}
