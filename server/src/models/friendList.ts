import {
  Model,
  DataTypes,
  Optional,
} from 'sequelize';
import sequelize from './index';

interface IFriendList {
  id: number,
  friendId: number,
}

class FriendList extends Model<IFriendList>
  implements IFriendList {
  public id!: number;
  public friendId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FriendList.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    friendId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

  },
  {
    sequelize,
    tableName: 'friendLists',
  },
);

export default FriendList;