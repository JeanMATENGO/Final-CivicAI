import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'civicai-secret-key-super-secure';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required' });
      return;
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone,
        role: email === 'jeanmatengo5@gmail.com' ? 'ADMIN' : 'USER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || (!user.passwordHash && !user.id)) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    
    // Check password
    if (user.passwordHash) {
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
    }

    // Generate token JWT
    const payload = {
      userId: user.id,
      role: user.role,
      email: user.email,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profilePhotoUrl: user.profilePhotoUrl
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, name, googleId, photoUrl } = req.body;
  
      if (!email || !name) {
        res.status(400).json({ error: 'Email and name are required' });
        return;
      }
  
      // Find or create user
      let user = await prisma.user.findUnique({ where: { email } });
  
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name,
            profilePhotoUrl: photoUrl,
            role: email === 'jeanmatengo5@gmail.com' ? 'ADMIN' : 'USER',
          }
        });
      }
  
      // Generate token JWT
      const payload = {
        userId: user.id,
        role: user.role,
        email: user.email,
      };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  
      res.status(200).json({
        message: 'Google login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          profilePhotoUrl: user.profilePhotoUrl
        }
      });
    } catch (error: any) {
      console.error('Google login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};
