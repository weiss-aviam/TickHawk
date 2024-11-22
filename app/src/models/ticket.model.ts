export interface Ticket {
    _id: string,
    subject: string,
    content: string,
    status: string,
    priority: string,
    createdAt: Date,
    //TODO: Add the rest of the fields
}