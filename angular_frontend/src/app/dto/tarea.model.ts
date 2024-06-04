export class Tarea {
    private _id: number;
    private _tarea: string;
    private _fecha_creacion: string;
    private _fecha_finalizacion: string;
    private _estado: string;
    private _usuario_id: number;
    private _categoria_id: number;
    private _categoria: string;

    constructor(
        id: number = 0, 
        tarea: string = '', 
        fecha_creacion: string = '', 
        fecha_finalizacion: string = '',
        estado: string = '',
        usuario_id: number = 0,
        categoria_id: number = 0) {

        this._id = id;
        this._tarea = tarea;
        this._fecha_creacion = fecha_creacion;
        this._fecha_finalizacion = fecha_finalizacion;
        this._estado = estado;
        this._usuario_id = usuario_id;
        this._categoria_id = categoria_id;
        this._categoria = "";
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get tarea(): string {
        return this._tarea;
    }

    set tarea(value: string) {
        this._tarea = value;
    }

    get fecha_creacion(): string {
        return this._fecha_creacion;
    }

    set fecha_creacion(value: string) {
        this._fecha_creacion = value;
    }

    get fecha_finalizacion(): string {
        return this._fecha_finalizacion;
    }

    set fecha_finalizacion(value: string) {
        this._fecha_finalizacion = value;
    }

    get estado(): string {
        return this._estado;
    }

    set estado(value: string) {
        this._estado = value;
    }

    get usuario_id(): number {
        return this._usuario_id;
    }

    set usuario_id(value: number) {
        this._usuario_id = value;
    }

    get categoria_id(): number {
        return this._categoria_id;
    }

    set categoria_id(value: number) {
        this._categoria_id = value;
    }

    get categoria(): string {
        return this._categoria;
    }

    set categoria(value: string) {
        this._categoria = value;
    }
    
}
