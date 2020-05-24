import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind } from 'graphql';

@Scalar('Date', type => Date)
export class DateScalar implements CustomScalar<number, Date> {
  description = 'Date custom scalar type';

  parseValue(value: number): Date {
    return new Date(value); // value from the client
  }

  serialize(value: Date): number {
    return value.getTime(); // value sent to the client
  }

  parseLiteral(ast: any): Date {
    if (ast.kind === Kind.INT || ast.kind == Kind.STRING) {
      if (this.isValidDate(new Date(ast.value))) {
        return new Date(ast.value);
      }
    }
    return null;
  }

  isValidDate(value): boolean {
    return value instanceof Date && !isNaN(value.getTime());
  }
}
