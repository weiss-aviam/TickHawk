import { SetMetadata } from '@nestjs/common';

export const TO_PUBLIC = 'toPublic';
export const Public = () => SetMetadata(TO_PUBLIC, true);