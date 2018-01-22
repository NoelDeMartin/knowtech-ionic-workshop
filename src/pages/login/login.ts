import { Component }    from '@angular/core';

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

import { HomePage }     from '../home/home';
import { RegisterPage } from '../register/register';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    form: FormGroup;

    constructor(
        private auth: Auth,
        private navCtrl: NavController,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController
    ) {
        this.form = new FormGroup({
            email: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
        });
    }

    public submit(): void {

        if (this.form.valid) {

            let loader = this.loadingCtrl.create();
            loader.present();

            this.auth
                .login(
                    this.form.controls['email'].value,
                    this.form.controls['password'].value
                )
                .then(() => {
                    loader.dismiss();
                    this.navCtrl.setRoot(HomePage);
                })
                .catch((error: Error) => {
                    loader.dismiss();
                    this.showError(error.message);
                });

        } else {
            this.showError('Invalid form inputs');
        }

    }

    public register(): void {
        this.navCtrl.push(RegisterPage);
    }

    private showError(message: string) {
        this.alertCtrl.create({
            title: 'Error',
            message: message,
            buttons: ['OK']
        }).present();
    }

}