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
    public getContacts(): Promise<Contact[]> {
        return;
    }

}