import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Example } from './components/Example';

@NgModule({
    imports: [
        BrowserModule
    ],
    declarations: [
        Example
    ],
    bootstrap: [Example]
})
export class AppModule { }
