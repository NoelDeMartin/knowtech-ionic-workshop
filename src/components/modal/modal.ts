import {
    Input,
    Output,
    Component,
    EventEmitter,
} from '@angular/core';

import { ViewController } from 'ionic-angular';

@Component({
    selector: 'modal',
    templateUrl: 'modal.html'
})
export class Modal {

    @Input() title;
    @Output() closed: EventEmitter<void> = new EventEmitter<void>();

    constructor(private viewCtrl: ViewController) { }

    public close(): void {
        this.closed.emit();
        this.viewCtrl.dismiss();
    }

}