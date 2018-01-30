import { Moment }   from 'moment';
import moment       from 'moment';

import { Contact }  from '@app/plugins/knowtech-chat-contacts-manager/ionic-native';

export interface MessageJson {
    id: string;
    text: string | Contact;
    author_id: string;
    author_username: string;
    date: number;
}

export class Message {

    public readonly id: string;
    public readonly text: string | Contact;
    public readonly authorId: string;
    public readonly authorUsername: string;
    public readonly date: Moment;

    constructor(json: MessageJson) {
        this.id = json.id;
        this.text = json.text;
        this.authorId = json.author_id;
        this.authorUsername = json.author_username;
        this.date = moment(new Date(json.date));
    }

    get isContact(): boolean {
        return typeof this.text !== 'string';
    }

}