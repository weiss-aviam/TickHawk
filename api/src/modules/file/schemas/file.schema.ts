import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now, Document } from 'mongoose';

export type FileSchema = HydratedDocument<File>;

@Schema()
export class File extends Document {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  file: string;

  @Prop({
    required: true,
  })
  type: string;

  @Prop({
    required: true,
  })
  mimetype: string;

  @Prop({
    required: true,
  })
  size: number;

  @Prop({ default: now() })
  createdAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);
