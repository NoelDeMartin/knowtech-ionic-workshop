import {
    Component,
    ViewChild,
}    from '@angular/core';

import {
    Nav,
    Platform,
} from 'ionic-angular';
import { StatusBar }    from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

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
        statusBar: StatusBar,
        splashScreen: SplashScreen
    ) {

        AsyncProvider.sync(backend, auth, chat)
            .then(() => {
                if (!this.nav || !this.nav.getActive()) {
                    this.rootPage = auth.isLoggedIn() ? 'home' : LoginPage;
                }
            });

        platform.ready().then(() => {
            splashScreen.hide();
        });

    }

}