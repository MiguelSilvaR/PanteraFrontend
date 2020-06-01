import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-psv',
  templateUrl: './psv.component.html',
  styleUrls: ['./psv.component.scss']
})
export class PsvComponent implements OnInit {

  fileToUpload: File = null;


  constructor(
    private api:ApiService
  ) { }

  ngOnInit(): void {
  }

  handleFileInput(files: FileList) {
    this.showLoading()
    this.fileToUpload = files.item(0);
    this.uploadDocument()
  }

  uploadDocument() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.sendPSV(fileReader.result.toString())
    }
    fileReader.readAsText(this.fileToUpload);
  }

  sendPSV(psv:string) {
    let info = {
      information: psv
    }
    let loginSubs = this.api.postPSV(info).subscribe(({ data }:any) => {
      console.log("Done");
      loginSubs.unsubscribe();
      Swal.close()
      this.successMessage()
    },(error) => {
      console.log(error)
      loginSubs.unsubscribe();
      Swal.close()
      this.errMessage()
    }); 
  }

  showLoading() {
    Swal.fire({
      allowOutsideClick: false,
      icon: "info",
      text: "Espere por favor, estamos subiendo el contenido"
    });
    Swal.showLoading();
  }

  successMessage() {
    Swal.fire({
      allowOutsideClick: false,
      icon: "success",
      text: "El contenido fue cargado con éxito"
    });
  }

  errMessage() {
    Swal.fire({
      allowOutsideClick: false,
      icon: "error",
      title: 'Oops...',
      text: "Algo salió mal, inténtelo de nuevo"
    });
  }

}
