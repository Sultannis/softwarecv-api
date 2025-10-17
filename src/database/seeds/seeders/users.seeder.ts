import { AppDataSource } from '../../data-source';
import { User } from '../../../common/entities/user.entity';

const USERS = [
  {
    email: 'sultan@gmail.com',
    password: '$2b$10$B6n1UJP9Q4G4oGa6KamIXOibx09O50aVdXEosqk4xYor1WiOf90bW',
    firstName: 'Test',
    lastName: 'Testovich',
  },
];

export const seedUsers = async () => {
  const repository = AppDataSource.getRepository(User);

  const users = repository.create(USERS);

  await repository.save(users);

  console.log('Seeded: Users');
};
