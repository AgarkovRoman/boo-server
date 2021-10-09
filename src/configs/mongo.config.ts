import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

// export const getMongoConfig = async (configService: ConfigService): Promise<TypegooseModuleOptions> => {
//   const client = new MongoClient(getMongoUri(configService));
//
//   return {
//     uri: client.get(),
//     ...getMongoOptions();
//   };
// };

export const getMongoConfig = (configService: ConfigService) => {
  return new MongoClient(getMongoUri(configService));
};

export const getMongoUri = (configService: ConfigService) =>
  'mongodb+srv://boo-boo:' +
  configService.get('MONGO_PASSWORD') +
  '@cluster0.dqwhz.mongodb.net/' +
  configService.get('MONGO_DB_NAME') +
  '?retryWrites=true&w=majority';

const getMongoOptions = () => ({
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
