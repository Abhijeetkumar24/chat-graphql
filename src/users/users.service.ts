import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(username: string) {
    return this.userModel.findOne({ username }).exec();
  }

  async create(user: Partial<User>) {
    return new this.userModel(user).save();
  }
}
