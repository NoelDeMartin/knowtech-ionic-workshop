import { Component } from '@angular/core';
import {
    NavParams,
    ViewController,
} from 'ionic-angular';
import {
    Contact,
    ContactsManager,
} from '@app/plugins/knowtech-chat-contacts-manager/ionic-native';

import Modal from '../Modal';

interface ListContact extends Contact {
    selected: boolean
};

@Component({
    selector: 'attach-contact',
    templateUrl: './attach-contact.html',
})
export class AttachContactModal extends Modal {

    private search: string = '';
    private contacts: ListContact[] = [];

    constructor(
        private contactsManager: ContactsManager,
        viewCtrl: ViewController,
        navParams: NavParams
    ) {
        super(viewCtrl, navParams);
        this.contactsManager.getContacts().then((contacts: Contact[]) => {
            this.contacts = contacts.map((contact: Contact) => {
                return Object.assign({ selected: false }, contact);
            });
        });
    }

    get filteredContacts(): ListContact[] {
        return this.contacts.filter((contact: ListContact) => {
            return contact.selected || contact.name.toLowerCase().indexOf(this.search) !== -1;
        });
    }

    public filter(event: Event): void {
        this.search = (<HTMLInputElement> event.target).value.trim().toLowerCase() || '';
    }

    public submit(): void {
        this.complete(this.contacts.filter((contact: ListContact) => {
            return contact.selected;
        }));
    }

}