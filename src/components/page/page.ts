import {
    Input,
    Component
} from '@angular/core';

import Translator from '@app/utils/Translator';

@Component({
    selector: 'page',
    templateUrl: './page.html',
})
export class Page {

    @Input() title: string = Translator.trans('title');
    @Input() subtitle: string = '';

    get hasSubtitle(): boolean {
        return !!this.subtitle;
    }

}