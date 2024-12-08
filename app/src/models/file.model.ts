export interface FileModel {
    _id: string;
    name: string;
    file: string;
    path: string;
    mimetype: string;
    size: number;
    status: string;
    createdAt: Date;
}