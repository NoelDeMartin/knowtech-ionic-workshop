export function isValidName(name?: string) {
    return !!name && name.length > 3;
}

export function isValidEmail(email?: string) {
    if (!!email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }
}

export function isValidPassword(password?: string) {
    return !!password && password.length > 4;
}