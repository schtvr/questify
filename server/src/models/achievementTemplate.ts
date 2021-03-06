import {
  Model,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  Association,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Optional,
} from 'sequelize';
import sequelize from './index';
import Achievement from './achievement';

export interface IAchievementTemplate {
  id: number
  name: string
  description: string
  img: string
  category: string 
  criteria: number
  completionExp: number
}
interface IAchievementTemplateCreationAttributes extends Optional<IAchievementTemplate, 'id'> {}

class AchievementTemplate extends Model<IAchievementTemplate, IAchievementTemplateCreationAttributes>
  implements IAchievementTemplate {
  public id!: number;
  public name!: string;
  public description!: string;
  public img!: string;
  public category!: string;
  public criteria!: number;
  public completionExp!: number

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getAchievements!: HasManyGetAssociationsMixin<Achievement>;
  public addAchievement!: HasManyAddAssociationMixin<Achievement, number>;
  public countAchievements!: HasManyCountAssociationsMixin;
  public createAchievement!: HasManyCreateAssociationMixin<Achievement>;

  public static associations: {
    achievements: Association<AchievementTemplate, Achievement>
  };
}

AchievementTemplate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    img: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    category: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    criteria: {
      type: new DataTypes.INTEGER,
      allowNull: false,
    },
    completionExp: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'achievementTemplates',
  },
);

AchievementTemplate.hasMany(Achievement, {
  sourceKey: 'id',
  foreignKey: 'templateId',
  as: 'achievements',
});

export default AchievementTemplate;
