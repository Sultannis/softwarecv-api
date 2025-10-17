import { AppDataSource } from '../data-source';
import { seedUsers } from './seeders/users.seeder';

const main = async () => {
  try {
    await AppDataSource.initialize();
  } catch (error) {
    console.log('Fatal error: Failed to initialize database connection');
  }

  try {
    await seedUsers();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  process.exit();
};

main();
