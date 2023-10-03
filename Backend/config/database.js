import {Sequelize} from 'sequelize' ;
import config from './config.js' ;

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// const sequelize = new Sequelize(
//   dbConfig.database,
//   dbConfig.username,
//   dbConfig.password,
//   {
//     host: dbConfig.host,
//     dialect: dbConfig.dialect,
//     logging:console.log
//   }
// );

const sequelize = new Sequelize('postgres://nuvo_user:8AGfhBMvingdubkn7cnolu1A2PW163Vk@dpg-ckdtn85jhfbs7388e230-a/nuvo',
{
  dialect: 'postgres',
  logging:console.log,
});
export default sequelize;


