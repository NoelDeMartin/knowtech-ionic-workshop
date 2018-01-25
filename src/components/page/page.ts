import {
    Input,
    Component
} from '@angular/core';

import {
    Popover,
    NavParams,
    ViewController,
    PopoverController,
} from 'ionic-angular';

import Translator from '@app/utils/Translator';

type Callable = Function | ((...args: any[]) => any);

export type PageOption = {
    text: string,
    callback: Callable,
};

export type PageAction = {
    icon: string,
    callback: Callable,
};

@Component({
    selector: 'page',
    templateUrl: './page.html',
})
export class Page {

    @Input() title: string = Translator.trans('title');
    @Input() subtitle: string = '';

    @Input() actions: PageAction[] = [];
    @Input() options: PageOption[] = [];

    private optionsMenu: Popover;

    constructor(private popoverCtrl: PopoverController) { }

    get hasSubtitle(): boolean {
        return !!this.subtitle;
    }

    public openOptionsMenu(event: Event): void {

        if (!this.optionsMenu) {
            this.optionsMenu = this.popoverCtrl.create(OptionsMenu, {
                options: this.options
            });
        }

        this.optionsMenu.present({
            ev: event
        });

    }

}

@Component({
    template: `
        <ion-list>
            <button
                *ngFor="let option of options"
                ion-item
                (click)="trigger(option)"
            >
                {{ option.text }}
            </button>
        </ion-list>
    `
})
export class OptionsMenu {

    options: PageOption[] = [];

    constructor(
        private viewCtrl: ViewController,
        navParams: NavParams
    ) {
        this.options = navParams.get('options');
    }

    public trigger(option: PageOption): void {
        this.viewCtrl.dismiss();
        option.callback.call(this);
    }

}