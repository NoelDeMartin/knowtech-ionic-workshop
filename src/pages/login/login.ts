import { Component }    from '@angular/core';

import {
    FormGroup,
    FormControl,
    Validators,
} from '@angular/forms';

import { NavController }    from 'ionic-angular';

import { Auth } from '@app/providers/Auth';
import UI       from '@app/utils/UI';

import { HomePage }     from '@app/pages/home/home';

import { RegisterPage } from '@app/pages/register/register';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    form: FormGroup;

    constructor(
        private auth: Auth,
        private navCtrl: NavController
    ) {
        this.form = new FormGroup({
            email: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
        });
    }

    public submit(): void {

        if (!this.form.valid) {
            UI.showError('Invalid credentials');
            return;
        }

        UI.asyncOperation(
            this.auth
                .login(
                    this.form.controls['email'].value,
                    this.form.controls['password'].value
                )
                .then(() => {
                    this.navCtrl.setRoot(HomePage);
                })
        );

    }

    public register(): void {
        this.navCtrl.push(RegisterPage);
    }

}