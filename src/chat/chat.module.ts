import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatResolver } from './chat.resolver';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { Room, RoomSchema } from './schemas/room.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { UsersService } from '../users/users.service';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from 'src/users/user.schema';
import { ChatService } from './chat.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Room.name, schema: RoomSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    AuthModule,
  ],
  providers: [
    ChatResolver,
    AuthService,
    JwtStrategy,
    ChatService,
    UsersService,
  ],
})
export class ChatModule {}
