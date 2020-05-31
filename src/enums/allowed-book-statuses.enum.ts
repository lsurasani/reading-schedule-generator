import { registerEnumType } from '@nestjs/graphql';

export enum AllowedBookStatuses {
  TO_READ = 'To read',
  IN_PROGRESS = 'In progress',
  DONE = 'Done',
}

registerEnumType(AllowedBookStatuses, {
  name: 'AllowedBookStatuses',
});
