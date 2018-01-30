import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { Page, OptionsMenu }    from './page/page';
import { Modal }                from './modal/modal';
import { LineChart }            from './line-chart/line-chart';
import { AttachMenu }           from '../pages/room/room';
import { PipesModule }          from '@app/pipes/pipes.module';

@NgModule({
    declarations: [
        OptionsMenu,
        AttachMenu,
        Page,
        Modal,
        LineChart
    ],
    imports: [
        IonicModule,
        PipesModule
    ],
    entryComponents: [
        OptionsMenu,
        AttachMenu,
        Page,
        Modal,
        LineChart
    ],
    exports: [
        OptionsMenu,
        AttachMenu,
        Page,
        Modal,
        LineChart
    ]
})
export class ComponentsModule { }