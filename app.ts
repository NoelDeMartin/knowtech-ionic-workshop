import { sayHello } from './modules/greetings.js';
import '../node_modules/jquery/dist/jquery.js';

window.onload = function () {
    $('#action').click(function () {
        sayHello();
    });
};