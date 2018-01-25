import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { Page, OptionsMenu } from './page/page';
import { Modal } from './modal/modal';

@NgModule({
    declarations: [
        OptionsMenu,
        Page,
        Modal
    ],
    imports: [
        IonicModule
    ],
    entryComponents: [
        OptionsMenu,
        Page,
        Modal
    ],
    exports: [
        OptionsMenu,
        Page,
        Modal
    ]
})
export class ComponentsModule { }