import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from '@app/components/components.module';
import { PipesModule } from '@app/pipes/pipes.module';

import { RoomPage } from './room';

@NgModule({
    declarations: [
        RoomPage
    ],
    imports: [
        ComponentsModule,
        PipesModule,
        IonicPageModule.forChild(RoomPage)
    ],
    bootstrap: [RoomPage],
    entryComponents: [
        RoomPage
    ]
})
export class RoomModule { }