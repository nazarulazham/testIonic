import { Injectable } from '@angular/core';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getUser(email) {
    let firestore_db = firebase.firestore();
    return new Promise((resolve, reject) => {
      firestore_db.collection('user').doc(email).get().then((doc) => {
        // console.log(doc.data())
        resolve(doc.data()  );
        // this.code_dalam_firestore = doc.data().Code
      }, err => {
        reject(err);
      });
    })
  }

  setUser(email, data) {
    let firestore_db = firebase.firestore();

    return new Promise((res, rej) => {
      firestore_db.collection('user').doc(email).set(data, { merge: true }).then(result => {
        console.log(result)
        res(result);
      }, err => {
        rej(err);
      });
    });
  }

  addImage(email, data) {
    let firestore_db = firebase.firestore();

    return new Promise((res, rej) => {
      firestore_db.collection('user').doc(email).set(data, { merge: true }).then(result => {
        console.log(result)
        res(result);
      }, err => {
        rej(err);
      });
    });
  }

  updateUser(email,data){
    let firestore_db = firebase.firestore();

    return new Promise((res, rej) => {
      firestore_db.collection('user').doc(email).update(data, { merge: true }).then(result => {
        console.log(result)
        res(result);
      }, err => {
        rej(err);
      });
    });
  }
}
