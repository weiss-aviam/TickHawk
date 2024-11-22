import { Ticket } from "models/ticket.model";
import { create } from "zustand";

export type TicketState = {
    tickets: Ticket[];
};
export const useTicketsStore = create<TicketState>()((set) => ({
    tickets: [
        {
            _id: "1",
            subject: "Ticket 1 this is a long subject and it should be truncated",
            content: "Description of ticket with id 1 and status open and a long subject",
            status: "open",
            createdAt: new Date(),
        },
        {
            _id: "2",
            subject: "Ticket 2",
            content: "Description 2",
            status: "closed",
            createdAt: new Date(),
        },
        {
            _id: "3",
            subject: "Ticket 3",
            content: "Description 3",
            status: "in-review",
            createdAt: new Date(),
        },
        {
            _id: "4",
            subject: "Ticket 4 this is a long subject and it should be truncated",
            content: "Content of ticket with id 4 and status in-progress and a long subject",
            status: "in-progress",
            createdAt: new Date(),
        },
    ],
}));
