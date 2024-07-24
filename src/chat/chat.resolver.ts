import { Resolver, Query, Args } from '@nestjs/graphql';
import { ChatService } from './chat.service';

@Resolver('Chat')
export class ChatResolver {

  constructor(
    private chatService: ChatService,
  ) { }

  @Query('getMessage')
  getMessage(@Args('id') id: string) {
    return this.chatService.getMessage(id);
  }
}
