import {model, Schema} from 'mongoose';
import {Case} from '../../types';

export const UserSchema = new Schema({
  _id: Schema.Types.ObjectId,
  userID: String,
  guilds: [
    {
      guildID: String,
      case: [],
    },
  ],
});

export const User = model('User', UserSchema);

export interface UserType {
  _id: Schema.Types.ObjectId;
  userID: string;
  guilds: [
    {
      guildID: string;
      case: Case[];
    }
  ];
}
