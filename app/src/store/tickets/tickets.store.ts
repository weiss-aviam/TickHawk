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
            department: {
                _id: "1",
                name: "Department 1",
            },
            priority: "low",
            createdAt: new Date(),
            updatedAt: new Date(),
            company: {
                _id: "1",
                name: "Company 1",
                email: " [email protected]",
            },
            customer: {
                _id: "1",
                name: "Customer 1",
                email: " [email protected]",
                role: "customer",
            },
            agent: {
                _id: "1",
                name: "Agent 1",
                email: " [email protected]",
                role: "agent",
            },
        },
    ],
}));
