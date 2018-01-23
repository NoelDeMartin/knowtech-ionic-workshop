import { Component }    from '@angular/core';

import { Platform }     from 'ionic-angular';
import { StatusBar }    from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SplashPage }   from '../pages/splash/splash';
import { LoginPage }    from '../pages/login/login';
import { HomePage }     from '../pages/home/home';

import { Auth }     from '../providers/Auth';
import { Backend }  from '../providers/Backend';

interface Service {
    init(): Promise<any>;
}

@Component({
    templateUrl: 'app.html'
})
export class MyApp {

    rootPage: any = SplashPage;

    constructor(
        auth: Auth,
        backend: Backend,
        platform: Platform,
        statusBar: StatusBar,
        splashScreen: SplashScreen
    ) {

        this.initServices(backend, auth)
            .then(() => {
                this.rootPage = auth.isLoggedIn()? HomePage : LoginPage;
            });

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });

    }

    private initServices(...services: Service[]): Promise<void> {

        let promise = Promise.resolve();

        for (let service of services) {
            promise = promise.then(() => service.init());
        }

        return promise;
    }

}