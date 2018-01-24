import { Moment }   from 'moment';
import moment       from 'moment';

export interface MessageJson {
    id: string;
    text: string;
    author_id: string;
    author_username: string;
    date: number;
}

export class Message {

    public readonly id: string;
    public readonly text: string;
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

}