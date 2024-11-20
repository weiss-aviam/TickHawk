import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService],
  imports: [
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
  ],
})
export class CustomerModule {}
