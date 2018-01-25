import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from '@app/components/components.module';
import { PipesModule } from '@app/pipes/pipes.module';

import { HomePage } from './home';

@NgModule({
    declarations: [
        HomePage
    ],
    imports: [
        ComponentsModule,
        PipesModule,
        IonicPageModule.forChild(HomePage)
    ],
    bootstrap: [HomePage],
    entryComponents: [
        HomePage
    ]
})
export class HomeModule { }