import User from '../../models/user';
import bcrypt from 'bcrypt';

const createUsers = async () => {
  await User.create({
    userName: 'timbo',
    firstName: 'timbo',
    lastName: 'slice',
    email: 'bigBoy@gmail.com',
    password: bcrypt.hashSync('password123', 10) 
  });
  await User.create({
    userName: 'dummy',
    firstName: 'victor',
    lastName: 'dumdum',
    email: 'dummy@dummy.com',
    password: bcrypt.hashSync('password123', 10) 
  });
  await User.create({
    userName: 'dogShit',
    firstName: 'dogShit',
    lastName: 'tunic',
    email: 'stinkybum@garbage.com',
    password: bcrypt.hashSync('password123', 10)
  });
};

export default createUsers;
