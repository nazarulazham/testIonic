import { Component } from '@angular/core';
import {
  BarcodeScannerOptions,
  BarcodeScanner
} from "@ionic-native/barcode-scanner/ngx";
import { UserService } from '../api/user.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AlertController, ModalController } from '@ionic/angular';
import { map, finalize } from "rxjs/operators";
import { Observable } from 'rxjs';
import firebase from "firebase";
import { QrComponent } from '../qr/qr.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  encodeData: any;
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;
  user:any={};

  userInput = {
      email: '',
      department: '',
      name: ''
    };
  base64Image: string;
  downloadURL: Observable<string>;
  

  constructor(private barcodeScanner: BarcodeScanner,
    public userService: UserService,
    private camera: Camera,
    private alertCtrl: AlertController,
    private mc: ModalController,) {
    this.encodeData = "https://www.FreakyJolly.com";
    //Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
  }

  scanCode() {
    // this.openQR()
    this.barcodeScanner
      .scan()
      .then(barcodeData => {

        // alert("Barcode data " + JSON.stringify(barcodeData));
        this.scannedData = barcodeData;
        this.openQR();
      })
      .catch(err => {
        console.log("Error", err);
      });
  }

  async openQR() {
    const modal = await this.mc.create({
      component: QrComponent,
      componentProps: {
        dataScanned: this.scannedData,
      }
    });
    modal.onDidDismiss().then((res: any) => {
      
    })
    return await modal.present();
  }

  encodedText() {
    this.userService.setUser(this.userInput.email, this.userInput).then(res => {
      console.log(res)
    })

    // this.barcodeScanner
    //   .encode(this.barcodeScanner.Encode.TEXT_TYPE, this.userInput.email)
    //   .then(
    //     encodedData => {
    //       console.log(encodedData);
    //       this.encodeData = encodedData;

    //     },
    //     err => {
    //       console.log("Error occured : " + err);
    //     }
    //   );
  }

  ngOnInit() {
    
    this.userService.getUser('qwe').then(res => {
      this.userInput.name=res["name"]
      console.log(this.user.email);

    }, err => {
      console.log(err);
    })
  }

  async takePhoto(sourceType: number) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
      console.error(err);
    });
  }
  upload(): void {
    var currentDate = Date.now();
    const file1: any = this.base64ToImage(this.base64Image);
    console.log(this.base64Image)

    let  userInput1: {
      email: String,
      department: String,
      name: String
      file:String
  
    } = {
        email: null,
        department: null,
        name: null,
        file:this.base64Image
      };

    this.userService.addImage('qwe',userInput1).then(res => {
      console.log(res);
      this.showSuccesfulUploadAlert();
    }, err => {
      console.log(err);
    })
    // const filePath = `Images/${currentDate}`;
    // let storage = firebase.storage();
    // const fileRef = storage.ref(filePath);

    // const task = storage.set(`Images/${currentDate}`, file1);
    // task.snapshotChanges()
    //   .pipe(finalize(() => {
    //     this.downloadURL = fileRef.getDownloadURL();
    //     this.downloadURL.subscribe(downloadURL => {
    //       if (downloadURL) {
    //         this.showSuccesfulUploadAlert();
    //       }
    //       console.log(downloadURL);
    //     });
    //   })
    //   )
    //   .subscribe(url => {
    //     if (url) {
    //       console.log(url);
    //     }
    //   });
  }

  async showSuccesfulUploadAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'basic-alert',
      header: 'Uploaded',
      subHeader: 'Image uploaded successful to Firebase storage',
      message: 'Check Firebase storage.',
      buttons: ['OK']
    });

    await alert.present();
  }

  base64ToImage(dataURI) {
    const fileDate = dataURI.split(',');
    // const mime = fileDate[0].match(/:(.*?);/)[1];
    const byteString = atob(fileDate[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    return blob;
  }

  try(){
    // console.log(this.userInput.email)
    this.userService.updateUser('qwe', this.userInput).then(res => {
      console.log(res)
    })
  }
}
