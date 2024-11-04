import type { RmqContext } from '@nestjs/microservices';

export function ack(context: RmqContext) {
  const channel = context.getChannelRef();
  const originalMessage = context.getMessage();
  channel.ack(originalMessage);
}