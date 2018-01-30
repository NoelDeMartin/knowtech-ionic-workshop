import { Injectable } from '@angular/core';
import {
    Cordova,
    Plugin,
    IonicNativePlugin
} from '@ionic-native/core';

export interface Contact {
    name: string
};

@Plugin({
    pluginName: 'ContactsManager',
    plugin: 'knowtech-chat-contacts-manager',
    pluginRef: 'ContactsManager',
    platforms: ['Android']
})
@Injectable()
export class ContactsManager extends IonicNativePlugin {

    @Cordova()
    echo(phrase: string): void { return; }

    @Cordova()
    getDate(): Promise<string> { return; }

    public getContacts(): Promise<Contact[]> {
        return Promise.resolve([
            { name: 'Jhon Doe' },
            { name: 'Jane Doe' },
        ]);
    }

}