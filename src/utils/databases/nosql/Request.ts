import {User} from 'discord.js';
import {Types} from 'mongoose';
import {User as Mong_User, UserType} from '.';

export const createUserDB = async (newUser: any, user: User) => {
  // @ts-ignore
  const data = await Mong_User.findOne({userID: user.id});
  if (data) return;
  const merged = Object.assign({_id: new Types.ObjectId()}, newUser);
  const createdUser = new Mong_User(merged);
  createdUser.save().then((u: any) => console.log(`New user -> ${u.userID} | ${user.username}`));
};

export const getUserDB = async (user: User): Promise<UserType> => {
  // @ts-ignore
  const data = await Mong_User.findOne({userID: user.id});
  if (!data) {
    const newUser = {
      userID: user.id,
    };
    await createUserDB(newUser, user);
    return getUserDB(user);
  }
  return data;
};
