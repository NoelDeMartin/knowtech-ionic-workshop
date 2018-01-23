import { i18n }  from 'i18next';
import * as I18Next from 'i18next';

import English from '../lang/en.json';

class Translator {

    private i18next: i18n;

    constructor() {
        this.i18next = I18Next.init({
            lng: 'en',
            resources: {
                en: { translation: English }
            }
        });
    }

    public has(key: string): boolean {
        return this.i18next.exists(key);
    }

    public trans(key: string, replacements: { [key: string]: string } = {}): string {

        let translation: string = this.i18next.t(key);

        for (let key in replacements) {
            translation = translation.replace(':' + key, replacements[key]);
        }

        return translation;
    }

}

export default new Translator();