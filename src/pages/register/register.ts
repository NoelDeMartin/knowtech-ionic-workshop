import { Component } from '@angular/core';

import {
    FormGroup,
    FormControl,
    Validators,
} from '@angular/forms';

import {
    NavController,
    AlertController,
    LoadingController,
} from 'ionic-angular';

import { Auth } from '../../providers/Auth';

import { HomePage } from '../home/home';

@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})
export class RegisterPage {

    form: FormGroup;

    constructor(
        private auth: Auth,
        private navCtrl: NavController,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController
    ) {
        this.form = new FormGroup({
            username: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', Validators.required),
            password_confirmation: new FormControl('', Validators.required),
        });
    }

    public submit(): void {

        if (
            !this.form.valid ||
            this.form.controls['password'].value !== this.form.controls['password_confirmation'].value
        ) {
            this.showError('Invalid form inputs');
            return;
        }

        let loader = this.loadingCtrl.create();
        loader.present();

        this.auth
            .register(
                this.form.controls['username'].value,
                this.form.controls['email'].value,
                this.form.controls['password'].value,
            )
            .then(() => {
                loader.dismiss();
                this.navCtrl.setRoot(HomePage);
            })
            .catch((error: Error) => {
                loader.dismiss();
                this.showError(error.message);
            });

    }

    private showError(message: string) {
        this.alertCtrl.create({
            title: 'Error',
            message: message,
            buttons: ['OK']
        }).present();
    }

}