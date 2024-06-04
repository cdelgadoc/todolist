export class Usuario {
    private _id: number;
    private _username: string;
    private _password: string;
    private _avatar: string;

    constructor(id: number = 0, username: string = '', password: string = '', avatar: string = '') {
        this._id = id;
        this._username = username;
        this._password = password;
        this._avatar = avatar;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get avatar(): string {
        return this._avatar;
    }

    set avatar(value: string) {
        this._avatar = value;
    }
}
