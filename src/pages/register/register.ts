import { Component } from '@angular/core';

import { FormControl }  from '@angular/forms';

import { NavController }    from 'ionic-angular';

import { FormGroup }    from '../../forms/FormGroup';
import { Validators }   from '../../forms/Validators';

import { Auth } from '../../providers/Auth';

import UI       from '../../utils/UI';

import { HomePage } from '../home/home';

@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})
export class RegisterPage {

    form: FormGroup;

    constructor(
        private auth: Auth,
        private navCtrl: NavController
    ) {
        this.form = new FormGroup({
            username: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', Validators.required),
            password_confirmation:
                new FormControl('', [
                    Validators.required,
                    Validators.equals('password')
                ])
        });
    }

    public submit(): void {

        if (this.form.submit()) {

            UI.asyncOperation(
                this.auth
                    .register(
                        this.form.controls['username'].value,
                        this.form.controls['email'].value,
                        this.form.controls['password'].value,
                    )
                    .then(() => {
                        this.navCtrl.setRoot(HomePage);
                    })
            );

        } else {
            UI.showError(this.form.getErrorMessage());
        }

    }

}