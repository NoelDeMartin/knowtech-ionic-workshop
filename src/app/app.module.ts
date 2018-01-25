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

import {
    Page,
    OptionsMenu
} from '@app/components/page/page';
import { Modal }    from '@app/components/modal/modal';

import { TranslatePipe }    from '@app/pipes/Translate';

import { HomePage }     from '@app/pages/home/home';
import { RoomPage }     from '@app/pages/room/room';
import { LoginPage }    from '@app/pages/login/login';
import { SplashPage }   from '@app/pages/splash/splash';
import { RegisterPage } from '@app/pages/register/register';

import { CreateRoomModal }  from '@app/modals/create-room/create-room';

import { Backend }          from '@app/providers/Backend';
import { Auth }             from '@app/providers/Auth';
import { ExpressBackend }   from '@app/providers/ExpressBackend';
import { Storage }          from '@app/providers/Storage';
import { Chat }             from '@app/providers/Chat';

import { registerInjector } from '@app/utils/injector';

import { MyApp } from './app.component';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        RoomPage,
        LoginPage,
        SplashPage,
        RegisterPage,
        CreateRoomModal,
        Page,
        OptionsMenu,
        Modal,
        TranslatePipe
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        OptionsMenu,
        MyApp,
        HomePage,
        RoomPage,
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
