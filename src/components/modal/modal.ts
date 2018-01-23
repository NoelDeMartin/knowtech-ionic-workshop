import {
    Input,
    Component,
} from '@angular/core';

import { ViewController } from 'ionic-angular';

@Component({
    selector: 'modal',
    templateUrl: 'modal.html'
})
export class Modal {

    @Input() title;

    constructor(private viewCtrl: ViewController) { }

    public close(): void {
        this.viewCtrl.dismiss();
    }

}