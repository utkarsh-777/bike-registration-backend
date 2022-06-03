/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async signup(
    fullName: string | null,
    email: string | null,
    password: string | null,
    role: string | null,
  ) {
    try {
      if (!fullName || !email || !password || !role) {
        return { message: 'Provide all fields!' };
      }

      const existingUser = await this.userRepository.findOneBy({
        email,
      });

      if (existingUser) {
        return { message: 'User already exists, kindly login!' };
      }

      const hashedPassword = await hash(password, 12);
      const newUser = this.userRepository.create({
        fullName,
        email,
        password: hashedPassword,
        role,
      });

      await this.userRepository.save(newUser);
      const token = await sign(
        { email: email, name: newUser.fullName, role: newUser.role },
        process.env.SECRET,
      );
      return {
        token,
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
        },
      };
    } catch (error) {
      console.log(error);
      return { message: 'Cannot save user!' };
    }
  }

  async login(email: string | null, password: string | null) {
    try {
      if (!email || !password) {
        return { message: 'Enter all the fields!' };
      }

      const user = await this.userRepository.findOne({
        where: { email },
        relations: ['reservations'],
      });
      if (!user) {
        return { message: 'User does not exist, kindly signup first!' };
      }

      const comparePassword = await compare(password, user.password);
      if (!comparePassword) {
        return { message: 'Email or Password does not match!' };
      }

      const token = await sign(
        { email: email, name: user.fullName, role: user.role },
        process.env.SECRET,
      );
      return {
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          reservations: user.reservations,
        },
      };
    } catch (error) {
      console.log(error);
      return { messsage: 'Error loging in!' };
    }
  }
}
