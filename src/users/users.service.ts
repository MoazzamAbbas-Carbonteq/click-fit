import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async createUserWithTypeORM(userData: {
    email: string;
    password: string;
    type: string;
  }): Promise<User> {
    const user = this.usersRepository.create(userData);
    return await this.usersRepository.save(user);
  }

  async createUserWithStoredProcedure(userData: {
    email: string;
    password: string;
    type: string;
  }): Promise<{id: number}> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      const result = await queryRunner.query(
        'CALL addUser(?, ?, ?)',
        [userData.email, userData.password, userData.type]
      );
      return {id: result[0][0].new_user_id};
    } finally {
      await queryRunner.release();
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }
}