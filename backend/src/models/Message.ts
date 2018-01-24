import User from "./User";

let messageId = 0;
function generateId(): string {
    return (++messageId).toString();
}

export default class Message {

    private id: string;
    private text: string;
    private authorId: string;
    private date: number;

    constructor(text: string, authorId: string, date: number) {
        this.id = generateId();
        this.text = text;
        this.authorId = authorId;
        this.date = date;
    }

    public toJson(users: User[]): Object {
        return {
            id: this.id,
            text: this.text,
            author_id: this.authorId,
            author_username: users.find((user: User) => user.getId() == this.authorId).getUsername(),
            date: this.date
        };
    }

}