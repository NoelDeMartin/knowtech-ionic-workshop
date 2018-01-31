import {
    Component,
    ViewChild,
    ElementRef,
} from '@angular/core';

import {
    NavParams,
    IonicPage,
    NavController,
    ViewController,
    AlertController,
    PopoverController,
} from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Contact, ContactsManager } from '@app/plugins/knowtech-chat-contacts-manager/ionic-native';

import { PageAction } from '@app/components/page/page';

import { AttachContactModal } from '@app/modals/attach-contact/attach-contact';

import { Chat } from '@app/providers/Chat';
import { Auth } from '@app/providers/Auth';
import AsyncProvider from '@app/providers/AsyncProvider';

import { LoginPage } from '@app/pages/login/login';

import { Room }     from '@app/models/Room';
import { Message }  from '@app/models/Message';
import { User }     from '@app/models/User';

import UI           from '@app/utils/UI';
import Translator   from '@app/utils/Translator';

@IonicPage({
    name: 'room',
    segment: 'room/:id',
    defaultHistory: [ 'home' ]
})
@Component({
    selector: 'page-room',
    templateUrl: 'room.html'
})
export class RoomPage {

    @ViewChild('messages') messages: ElementRef;

    room: Room = null;
    roomMessages: Observable<Message[]> = null;

    message: string = '';

    actions: PageAction[] = [];

    private ready: Promise<void>;
    private subscription: Subscription;

    constructor(
        private auth: Auth,
        private chat: Chat,
        private alertCtrl: AlertController,
        private popoverCtrl: PopoverController,
        private contactsManager: ContactsManager,
        navCtrl: NavController,
        params: NavParams
    ) {
        this.actions.push({
            icon: 'person-add',
            callback: this.addMember.bind(this)
        });

        this.ready = AsyncProvider.sync(auth, chat).then(() => {
            if (!auth.isLoggedIn()) {
                navCtrl.setRoot(LoginPage);
            } else {
                return new Promise<void>((resolve, reject) => {
                    let roomId = params.get('id');
                    let subscription = this.chat.rooms.subscribe((rooms: Room[]) => {
                        if (this.room) {
                            subscription.unsubscribe();
                        }
                        for (let room of rooms) {
                            if (room.id == roomId) {
                                this.room = room;
                                this.roomMessages = this.chat.listenRoomMessages(this.room.id);
                                resolve();
                                return;
                            }
                        }
                    });
                });
            }
        });
    }

    get user(): User {
        return this.auth.getUser();
    }

    get title(): string {
        return this.room? this.room.topic : '';
    }

    get membersCount(): number {
        return this.room ? this.room.memberIds.length : 0;
    }

    ionViewWillEnter() {
        this.ready.then(() => {
            if (this.auth.isLoggedIn()) {
                let messagesCount = 0;
                this.subscription = this.roomMessages.subscribe((messages: Message[]) => {
                    if (messagesCount < messages.length) {
                        messagesCount = messages.length;
                        UI.nextTick(this.scrollToBottom.bind(this));
                    }
                });
            }
        });
    }

    ionViewWillLeave() {
        this.ready.then(() => {
            if (this.subscription) {
                this.subscription.unsubscribe();
                this.subscription = null;
            }
        });
    }

    public sendMessage(): void {
        UI.asyncOperation(this.chat.sendMessage(this.room.id, this.message));
        this.message = '';
    }

    public addMember(): void {
        this.alertCtrl.create({
            title: 'Add member',
            inputs: [
                {
                    name: 'username',
                    placeholder: Translator.trans('add-member.username')
                }
            ],
            buttons: [
                {
                    text: Translator.trans('add-member.cancel'),
                    role: 'cancel'
                },
                {
                    text: Translator.trans('add-member.submit'),
                    handler: ({ username }) => {
                        UI.asyncOperation(
                            this.chat
                                .addRoomMember(this.room.id, username)
                                .then((userId: string) => {
                                    this.room.memberIds.push(userId);
                                })
                        );
                    }
                }
            ]
        }).present();
    }

    public addContact(contact: Contact): void {
        this.contactsManager.addContact(contact);
    }

    public attach(event: Event): void {
        this.popoverCtrl
            .create(
                AttachMenu,
                { callback: this.sendContacts.bind(this) }
            )
            .present({
                ev: event
            });
    }

    private sendContacts(contacts?: Contact[]): void {
        if (contacts) {
            UI.asyncOperation(this.chat.sendContacts(this.room.id, contacts));
        }
    }

    private scrollToBottom(): void {

        let element = this.messages.nativeElement;

        if (isDivElement(element)) {
            let scroll: HTMLElement = element.parentElement;
            UI.animate(scroll, 'scrollTop', scroll.scrollHeight - scroll.clientHeight, 300);
        }

    }

}

function isDivElement(object: any): object is HTMLDivElement {
    return object instanceof HTMLDivElement;
}

@Component({
    template: `
        <ion-list>
            <button ion-item (click)="attachContact()">
                {{ 'room.attach_contact' | translate }}
            </button>
        </ion-list>
    `
})
export class AttachMenu {

    private callback: (result: any) => void;

    constructor(
        private viewCtrl: ViewController,
        navParams: NavParams
    ) {
        this.callback = navParams.get('callback');
    }

    public attachContact(): void {
        UI.showModal(AttachContactModal).then(this.callback);
        this.viewCtrl.dismiss();
    }

}