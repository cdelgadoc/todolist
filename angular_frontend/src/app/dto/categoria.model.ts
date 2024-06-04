export class Categoria {
    private _id: number;
    private _nombre: string;
    private _descripcion: string;
    private _usuario_id: number;
    
    constructor(id: number = 0, nombre: string = '', descripcion: string = '', usuario_id: number = 0) {
        this._id = id;
        this._nombre = nombre;
        this._descripcion = descripcion;
        this._usuario_id = usuario_id;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get nombre(): string {
        return this._nombre;
    }

    set nombre(value: string) {
        this._nombre = value;
    }

    get descripcion(): string {
        return this._descripcion;
    }

    set descripcion(value: string) {
        this._descripcion = value;
    }

    get usuario_id(): number {
        return this._usuario_id;
    }

    set usuario_id(value: number) {
        this._usuario_id = value;
    }
    
}
