import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { TranslatePipe } from './Translate';

@NgModule({
    declarations: [
        TranslatePipe,
    ],
    imports: [
        IonicModule
    ],
    exports: [
        TranslatePipe,
    ]
})
export class PipesModule { }