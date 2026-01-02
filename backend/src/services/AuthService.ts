import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { UserData, LoginData, JwtPayload } from '../types';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(userData: UserData): Promise<{ user: User; token: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    // Create verification token
    const verificationToken = uuidv4();

    // Create user
    const user = this.userRepository.create({
      email: userData.email,
      name: userData.name,
      passwordHash,
      verificationToken,
      isVerified: process.env.NODE_ENV === 'development', // Auto-verify in development
    });

    await this.userRepository.save(user);

    // Generate JWT token
    const token = this.generateToken(user);

    // TODO: Send verification email
    console.log(`Verification token for ${user.email}: ${verificationToken}`);

    return { user, token };
  }

  async login(loginData: LoginData): Promise<{ user: User; token: string }> {
    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email: loginData.email }
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(loginData.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // In development, skip email verification check
    if (process.env.NODE_ENV !== 'development' && !user.isVerified) {
      throw new Error('Please verify your email before logging in');
    }

    // Generate JWT token
    const token = this.generateToken(user);

    return { user, token };
  }

  async verifyEmail(token: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { verificationToken: token }
    });

    if (!user) {
      throw new Error('Invalid verification token');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await this.userRepository.save(user);

    return user;
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      // Don't reveal if email exists or not
      return;
    }

    const resetToken = uuidv4();
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await this.userRepository.save(user);

    // TODO: Send password reset email
    console.log(`Password reset token for ${user.email}: ${resetToken}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { resetToken: token }
    });

    if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
      throw new Error('Invalid or expired reset token');
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    user.passwordHash = passwordHash;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await this.userRepository.save(user);

    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id }
    });
  }

  private generateToken(user: User): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }
    
    return jwt.sign(payload, secret, { expiresIn: '7d' });
  }

  verifyToken(token: string): JwtPayload {
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET is not configured');
      }
      return jwt.verify(token, secret) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}