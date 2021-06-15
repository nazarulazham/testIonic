import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { UserService } from '../api/user.service';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss'],
})
export class QrComponent implements OnInit {
  dataScanned:any
  base64Image: string;
  downloadURL: Observable<string>;

  user:any={};

  userInput1 = {
    email: '',
    department: '',
    name: '',
    file:''
  };

  constructor(
    public userService: UserService,
    private alertCtrl: AlertController,
    private camera: Camera,
  ) { }

  ngOnInit() {
    // console.log('test',this.dataScanned);
   
    let email = this.dataScanned.text;
    // console.log('email',email)
    this.userService.getUser(email).then(res => {
    this.user=res;
    console.log(this.user)
  
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
    // console.log(this.base64Image)

    

    this.userService.addImage(this.user.email,this.userInput1).then(res => {
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

}
