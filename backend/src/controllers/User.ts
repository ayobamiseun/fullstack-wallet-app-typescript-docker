import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from '../services/User';
import JwtService from '../services/jwtService';
import EmailService from '../services/emailService'; // New service for sending emails

export default class UserController {
  constructor(private userService: UserService) {}

  login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await this.userService.login(username, password);
    const token = JwtService.createToken(user);
    res.status(StatusCodes.OK).json({ user, token });
  };
  
  createUser = async (req: Request, res: Response) => {
    const user = await this.userService.createUserAccount(req.body);
    if (!user) throw Error('ConflictError'); 
    res.status(StatusCodes.CREATED).json(user);
  };

  initiatePasswordReset = async (req: Request, res: Response) => {
    const { username } = req.body;
    const resetToken = await this.userService.createPasswordResetToken(username);
    
    // In a real application, you would send an email with the reset link
    await EmailService.sendPasswordResetEmail(username, resetToken);
    
    res.status(StatusCodes.OK).json({
      message: 'If an account with that username exists, a password reset link has been sent'
    });
  };

  resetPassword = async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    await this.userService.resetPasswordWithToken(token, newPassword);
    
    res.status(StatusCodes.OK).json({
      message: 'Password has been reset successfully'
    });
  };

  verifyResetToken = async (req: Request, res: Response) => {
    const { token } = req.body;
    await this.userService.verifyPasswordResetToken(token);
    
    res.status(StatusCodes.OK).json({
      message: 'Token is valid'
    });
  };
}