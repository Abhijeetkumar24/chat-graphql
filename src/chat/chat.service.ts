import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Room } from './schemas/room.schema';
import { Model } from 'mongoose';

@Injectable()
export class ChatService {

    constructor(
        @InjectModel(Message.name) private messageModel: Model<Message>,
        @InjectModel(Room.name) private roomModel: Model<Room>,
    ) { }

    async findRoomsForUser(userId: string): Promise<Room[]> {
        return this.roomModel.find({ participants: userId }).exec();
    }

    async findOne(roomId: string) {
        return this.roomModel.findById(roomId).populate('participants').exec();
    }

    async create(name: string, creatorId: string): Promise<Room> {
        const newRoom = new this.roomModel({
            name,
            participants: [creatorId],
        });
        return newRoom.save();
    }

    async addParticipant(roomId: string, userId: string): Promise<Room> {
        return this.roomModel.findByIdAndUpdate(
            roomId,
            { $addToSet: { participants: userId } },
            { new: true }
        ).exec();
    }

    async findLastTenMessages(roomId: string): Promise<Message[]> {
        return this.messageModel
            .find({ room: roomId })
            .populate('sender')
            .sort({ timestamp: -1 })
            .limit(10)
            .exec();
    }

    async addMessage(roomId: string, content: string, senderId: string): Promise<Message> {
        const newMessage = new this.messageModel({
            content,
            sender: senderId,
            room: roomId,
            timestamp: new Date(),
        });
        const message = await newMessage.save();

        await this.roomModel.findByIdAndUpdate(roomId, { lastMessage: message._id });

        return message.populate('sender');
    }
}
