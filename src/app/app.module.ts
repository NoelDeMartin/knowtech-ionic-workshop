import { BrowserModule }    from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {
    APP_INITIALIZER,
    ErrorHandler,
    Injector,
    NgModule
} from '@angular/core';

import {
    IonicApp,
    IonicErrorHandler,
    IonicModule
} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar }    from '@ionic-native/status-bar';

import { MyApp }    from './app.component';

import { Page }     from '../components/page/page';
import { Modal }    from '../components/modal/modal';

import { HomePage }     from '../pages/home/home';
import { LoginPage }    from '../pages/login/login';
import { SplashPage }   from '../pages/splash/splash';
import { RegisterPage } from '../pages/register/register';

import { CreateRoomModal }  from '../modals/create-room/create-room';

import { Backend }          from '../providers/Backend';
import { Auth }             from '../providers/Auth';
import { ExpressBackend }   from '../providers/ExpressBackend';
import { Storage }          from '../providers/Storage';
import { Chat }             from '../providers/Chat';

import { registerInjector } from '../utils/injector';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        LoginPage,
        SplashPage,
        RegisterPage,
        CreateRoomModal,
        Page,
        Modal
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        LoginPage,
        SplashPage,
        RegisterPage,
        CreateRoomModal
    ],
    providers: [
        Auth,
        Chat,
        Storage,
        StatusBar,
        SplashScreen,
        { provide: Backend, useClass: ExpressBackend },
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        { provide: APP_INITIALIZER, useFactory: registerInjector, deps: [Injector], multi: true },
    ]
})
export class AppModule {}
