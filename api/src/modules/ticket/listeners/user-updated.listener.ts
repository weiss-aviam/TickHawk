import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserUpdatedEvent } from '../../user/events/user-updated.event';
import { Ticket } from '../schemas/ticket.schema';

@Injectable()
export class UserUpdatedListener {
  private readonly logger = new Logger(UserUpdatedListener.name);

  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<Ticket>,
  ) {}

  @OnEvent('user.updated')
  async handleUserUpdatedEvent(event: UserUpdatedEvent): Promise<void> {
    try {
      this.logger.debug(`Received user.updated event for user: ${event.userId}`);
      
      const userId = new Types.ObjectId(event.userId);
      const updateFields = {};
      let hasUpdates = false;

      // Build the update object based on the changes in the event
      if (event.updates.name) {
        this.logger.debug(`Updating name for user ${event.userId} to: ${event.updates.name}`);
        updateFields['customer.name'] = event.updates.name;
        updateFields['agent.name'] = event.updates.name;
        updateFields['content_user.name'] = event.updates.name;
        updateFields['comments.$[userComment].user.name'] = event.updates.name;
        updateFields['events.$[userEvent].user.name'] = event.updates.name;
        hasUpdates = true;
      }

      if (event.updates.email) {
        this.logger.debug(`Updating email for user ${event.userId} to: ${event.updates.email}`);
        updateFields['customer.email'] = event.updates.email;
        updateFields['agent.email'] = event.updates.email;
        updateFields['content_user.email'] = event.updates.email;
        updateFields['comments.$[userComment].user.email'] = event.updates.email;
        updateFields['events.$[userEvent].user.email'] = event.updates.email;
        hasUpdates = true;
      }

      if (!hasUpdates) {
        this.logger.debug('No user fields to update in tickets');
        return;
      }

      // Define array filters to match comments and events by this user
      const arrayFilters = [
        { 'userComment.user._id': userId },
        { 'userEvent.user._id': userId }
      ];

      // Update tickets where this user appears as customer, agent, or content creator
      const result = await this.ticketModel.updateMany(
        {
          $or: [
            { 'customer._id': userId },
            { 'agent._id': userId },
            { 'content_user._id': userId },
            { 'comments.user._id': userId },
            { 'events.user._id': userId }
          ]
        },
        { $set: updateFields },
        { arrayFilters: arrayFilters }
      );

      this.logger.debug(`Updated ${result.modifiedCount} tickets for user ${event.userId}`);
    } catch (error) {
      this.logger.error(`Error updating tickets for user ${event.userId}: ${error.message}`, error.stack);
      // We don't rethrow the error as it might cause the publishing service to fail
    }
  }
}