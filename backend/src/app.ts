import * as express from 'express';

import {
    Request,
    Response
} from 'express';

import * as bodyParser from 'body-parser';

import * as cors from 'cors';

import User from './models/User';

import {
    isValidEmail,
    isValidName,
    isValidPassword
} from './validations';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const users = [
    new User('Jhon Doe', 'test@example.com', 'secret')
];

app.post('/register', (req: Request, res: Response) => {

    let name: string = req.body.name;
    let email: string = req.body.email;
    let password: string = req.body.password;

    if (!isValidName(name) || !isValidEmail(email) || !isValidPassword(password)) {
        res.send({
            error: 'validation',
            message: 'Validation failed'
        });
        return;
    }

    for (let user of users) {
        if (user.sameEmail(email)) {
            res.send({
                error: 'validation',
                message: 'Email already exists'
            });
            return;
        }
    }

    let user = new User(name, email, password);

    users.push(user);

    res.send(user.toJson());
});

app.get('/login', (req: Request, res: Response) => {

    let email: string = req.query.email;
    let password: string = req.query.password;

    for (let user of users) {
        if (user.match(email, password)) {
            res.send(user.toJson());
            return;
        }
    }

    res.send({
        error: 'not-found',
        message: 'Credentials don\'t match our records'
    });
});

const port = 3000;
app.listen(port, () => console.log('App listening on port ' + port + '!'));