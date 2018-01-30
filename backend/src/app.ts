import * as express from 'express';

import {
    Request,
    Response
} from 'express';

import * as bodyParser from 'body-parser';

import * as cors from 'cors';

import User from './models/User';
import Room from './models/Room';
import Message from './models/Message';

import {
    isValidEmail,
    isValidUsername,
    isValidPassword
} from './validations';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const users = [
    new User('Jhon Doe', 'jhon@example.com', 'secret'),
    new User('Jane Doe', 'jane@example.com', 'secret'),
];

const rooms = [
    new Room('Echo Chamber', users[0].getId(), [users[0].getId()]),
    new Room('Chat with Jane', users[0].getId(), [users[0].getId(), users[1].getId()]),
];

rooms[1].addMessage("Lorem ipsum dolor sit amet", users[0].getId());
rooms[1].addMessage("consectetur adipiscing elit", users[0].getId());
rooms[1].addMessage("Cras porta sit amet urna a consectetur", users[1].getId());
rooms[1].addMessage("Pellentesque vulputate ex ut ligula iaculis porttitor", users[0].getId());
rooms[1].addMessage("Suspendisse potenti", users[1].getId());
rooms[1].addMessage("Aenean porta interdum cursus", users[1].getId());

app.post('/register', (req: Request, res: Response) => {

    let username: string = req.body.username;
    let email: string = req.body.email;
    let password: string = req.body.password;

    if (!isValidUsername(username) || !isValidEmail(email) || !isValidPassword(password)) {
        res.status(400).send({
            error: 'validation',
            message: 'Validation failed'
        });
        return;
    }

    for (let user of users) {
        if (user.sameEmail(email)) {
            res.status(400).send({
                error: 'validation',
                message: 'Email already exists'
            });
            return;
        }
    }

    let user = new User(username, email, password);

    users.push(user);

    res.send(user.toJson());
});

app.post('/login', (req: Request, res: Response) => {

    let email: string = req.body.email;
    let password: string = req.body.password;

    for (let user of users) {
        if (user.match(email, password)) {
            res.send(user.toJson());
            return;
        }
    }

    res.status(400).send({
        error: 'not-found',
        message: 'Credentials don\'t match our records'
    });
});

app.post('/facebook-login', (req: Request, res: Response) => {

    let id: string = req.body.id;
    let username: string = req.body.username;

    for (let user of users) {
        if (user.matchFacebook(id)) {
            res.send(user.toJson());
            return;
        }
    }

    let user = User.facebook(id, username);

    users.push(user);

    res.send(user.toJson());
});

app.post('/find-users', (req: Request, res: Response) => {

    let usernames: string[] = req.body.usernames;
    let userJsons: Object[] = [];

    for (let username of usernames) {
        for (let user of users) {
            if (user.getUsername().toLowerCase() == username.toLowerCase()) {
                userJsons.push(user.toJson());
            }
        }
    }

    res.send(userJsons);
});

app.post('/add-member', (req: Request, res: Response) => {

    let roomId: string = req.body.room_id;
    let username: string = req.body.username;

    let newMember: User = null;

    for (let user of users) {
        if (user.getUsername() == username) {
            newMember = user;
            break;
        }
    }

    if (newMember == null) {
        res.status(404).send({
            error: 'not-found',
            message: 'User does not exist'
        });
    }

    for (let room of rooms) {
        if (room.getId() == roomId) {
            room.addMember(newMember);
            res.send(newMember.getId());
            return;
        }
    }

    res.status(404).send({
        error: 'not-found',
        message: 'Room does not exist'
    });
});

app.post('/rooms', (req: Request, res: Response) => {

    let userId: string = req.body.user_id;
    let userRooms: Room[] = [];

    for (let room of rooms) {
        if (room.hasMember(userId)) {
            userRooms.push(room);
        }
    }

    res.send(userRooms.map((room: Room) => room.toJson()))
});

app.post('/messages', (req: Request, res: Response) => {

    let roomId: string = req.body.room_id;
    let messages: Message[] = [];

    for (let room of rooms) {
        if (room.getId() == roomId) {
            res.send(room.getMessages().map((message: Message) => message.toJson(users)));
            return;
        }
    }

    res.status(404).send({
        error: 'not-found',
        message: 'Room does not exist'
    });
});

app.post('/room', (req: Request, res: Response) => {

    let topic: string = req.body.topic;
    let creatorId: string = req.body.creator_id;
    let memberIds: string[] = req.body.member_ids;

    let room = new Room(topic, creatorId, memberIds);

    rooms.push(room);

    res.send(room.toJson());
});

app.post('/message', (req: Request, res: Response) => {

    let roomId: string = req.body.room_id;
    let authorId: string = req.body.author_id;
    let text: string = req.body.text;

    for (let room of rooms) {
        if (room.getId() == roomId) {
            res.send(room.addMessage(text, authorId).toJson(users));
            return;
        }
    }

    res.status(404).send({
        error: 'not-found',
        message: 'Room does not exist'
    });
});

app.post('/contacts', (req: Request, res: Response) => {

    let roomId: string = req.body.room_id;
    let authorId: string = req.body.author_id;
    let contacts: Object[] = req.body.contacts;

    for (let room of rooms) {
        if (room.getId() == roomId) {
            let newMessages: Object[] = [];
            for (let contact of contacts) {
                newMessages.push(room.addContact(contact, authorId).toJson(users));
            }
            res.send(newMessages);
            return;
        }
    }

    res.status(404).send({
        error: 'not-found',
        message: 'Room does not exist'
    });
});

const port = 3000;
app.listen(port, () => console.log('App listening on port ' + port + '!'));