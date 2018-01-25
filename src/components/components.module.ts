import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { Page, OptionsMenu }    from './page/page';
import { Modal }                from './modal/modal';
import { LineChart }            from './line-chart/line-chart';

@NgModule({
    declarations: [
        OptionsMenu,
        Page,
        Modal,
        LineChart
    ],
    imports: [
        IonicModule
    ],
    entryComponents: [
        OptionsMenu,
        Page,
        Modal,
        LineChart
    ],
    exports: [
        OptionsMenu,
        Page,
        Modal,
        LineChart
    ]
})
export class ComponentsModule { }