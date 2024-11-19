import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PermissionSchema = HydratedDocument<Permission>;

@Schema()
export class Permission {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  description: number;

  @Prop({
    required: true,
  })
  accion: string;

  @Prop({
    required: true,
  })
  resource: Types.ObjectId;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);