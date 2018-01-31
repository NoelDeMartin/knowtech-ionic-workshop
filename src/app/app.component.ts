import {
    Component,
    ViewChild,
}    from '@angular/core';

import {
    Nav,
    Platform,
} from 'ionic-angular';

import { SplashPage }   from '@app/pages/splash/splash';
import { LoginPage }    from '@app/pages/login/login';

import { Auth }     from '@app/providers/Auth';
import { Chat }     from '@app/providers/Chat';
import { Backend }  from '@app/providers/Backend';
import AsyncProvider from '@app/providers/AsyncProvider';
import {  } from '@angular/core/src/metadata/di';
import {  } from 'ionic-angular/navigation/nav-interfaces';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {

    @ViewChild('nav') nav: Nav;

    rootPage: SplashPage;

    constructor(
        auth: Auth,
        chat: Chat,
        backend: Backend,
        platform: Platform,
    ) {

        AsyncProvider.sync(backend, auth, chat)
            .then(() => {
                if (!this.nav || !this.nav.getActive()) {
                    this.rootPage = auth.isLoggedIn() ? 'home' : LoginPage;
                }
            });

    }

}