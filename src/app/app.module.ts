import { BrowserModule }    from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {
    APP_INITIALIZER,
    ErrorHandler,
    Injector,
    NgModule
} from '@angular/core';

import { PipesModule } from '@app/pipes/pipes.module';
import { ComponentsModule } from '@app/components/components.module';

import {
    IonicApp,
    IonicErrorHandler,
    IonicModule
} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar }    from '@ionic-native/status-bar';
import { Facebook }     from '@ionic-native/facebook';
import { ContactsManager }  from '@app/plugins/knowtech-chat-contacts-manager/ionic-native';

import { LoginPage }    from '@app/pages/login/login';
import { SplashPage }   from '@app/pages/splash/splash';
import { RegisterPage } from '@app/pages/register/register';

import { CreateRoomModal }      from '@app/modals/create-room/create-room';
import { StatsModal }           from '@app/modals/stats/stats';
import { AttachContactModal }   from '@app/modals/attach-contact/attach-contact';

import { Backend }          from '@app/providers/Backend';
import { Auth }             from '@app/providers/Auth';
import { ExpressBackend }   from '@app/providers/ExpressBackend';
import { FirebaseBackend }  from '@app/providers/FirebaseBackend';
import { Storage }          from '@app/providers/Storage';
import { Chat }             from '@app/providers/Chat';

import { registerInjector } from '@app/utils/injector';

import Config from '@app/config.json';

import { MyApp } from './app.component';

function getBackendClass(): any {
    switch (Config.backend) {
        case 'express':
            return ExpressBackend;
        default:
        case 'firebase':
            return FirebaseBackend;
    }
}

@NgModule({
    declarations: [
        MyApp,
        LoginPage,
        SplashPage,
        RegisterPage,
        CreateRoomModal,
        StatsModal,
        AttachContactModal,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        PipesModule,
        ComponentsModule,
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        LoginPage,
        SplashPage,
        RegisterPage,
        CreateRoomModal,
        StatsModal,
        AttachContactModal,
    ],
    providers: [
        Auth,
        Chat,
        Storage,
        Facebook,
        StatusBar,
        SplashScreen,
        ContactsManager,
        { provide: Backend, useClass: getBackendClass() },
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        { provide: APP_INITIALIZER, useFactory: registerInjector, deps: [Injector], multi: true },
    ]
})
export class AppModule {}
