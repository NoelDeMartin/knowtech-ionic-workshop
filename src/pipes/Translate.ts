import {
    Pipe,
    PipeTransform,
} from '@angular/core';

import Translator from '@app/utils/Translator';

@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {

    public transform(value: string, replacements: { [key: string]: string } = {}): string {
        return Translator.trans(value, replacements);
    }

}