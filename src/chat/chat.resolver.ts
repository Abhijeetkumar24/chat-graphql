import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from '../auth/auth.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UsersService } from '../users/users.service';
import { LoginResponse } from './dto/login-response.dto';
import { Room } from './schemas/room.schema';
import { Message } from './schemas/message.schema';
import { Types } from 'mongoose';
import { User } from 'src/users/user.schema';
import { ChatService } from './chat.service';

@Resolver()
export class ChatResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly chatService: ChatService,
  ) {}

  @Mutation('login')
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    return this.authService.login(username, password);
  }

  @Mutation('register')
  async register(
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<User> {
    return this.authService.register(username, password);
  }

  @Query('myProfile')
  @UseGuards(GqlAuthGuard)
  async me(@Context() context): Promise<User> {
    return this.usersService.findOne(context.req.user.username);
  }

  @Query('rooms')
  @UseGuards(GqlAuthGuard)
  async rooms(@Context() context): Promise<Room[]> {
    return this.chatService.findRoomsForUser(context.req.user.userId);
  }


  @Mutation('createRoom')
  @UseGuards(GqlAuthGuard)
  async createRoom(
    @Args('name') name: string,
    @Context() context,
  ): Promise<Room> {
    const userId = context.req.user.userId;
    return this.chatService.create(name, userId);
  }

  @Mutation('addParticipant')
  @UseGuards(GqlAuthGuard)
  async addParticipant(
    @Args('roomId') roomId: string,
    @Args('userId') userId: string,
    @Context() context,
  ): Promise<Room> {
    const room = await this.chatService.findOne(roomId);
    if (!room.participants.includes(context.req.user.userId)) {
      throw new Error('User not authorized to add participants');
    }
    return this.chatService.addParticipant(roomId, userId);
  }

  @Mutation('addMessage')
  @UseGuards(GqlAuthGuard)
  async addMessage(
    @Args('roomId') roomId: string,
    @Args('content') content: string,
    @Context() context,
  ): Promise<Message> {
    const userId = context.req.user.userId;
    const room = await this.chatService.findOne(roomId);
    if (!room.participants.includes(userId)) {
      throw new Error('User not part of the room');
    }
    return this.chatService.addMessage(roomId, content, userId);
  }

  @Query('messages')
  @UseGuards(GqlAuthGuard)
  async messages(
    @Args('roomId') roomId: string,
    @Context() context,
  ): Promise<Message[]> {
    const userId = context.req.user.userId;
    const room = await this.chatService.findOne(roomId);
    if (!room.participants.includes(userId)) {
      throw new Error('User not part of the room');
    }
    return await this.chatService.findLastTenMessages(roomId);
  }
}
