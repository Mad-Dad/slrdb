import jwt from 'jsonwebtoken';

const generateJWT = (user: { id: number; username: string }): string => {
  const secret = process.env.JWT_SECRET; 

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined.');
  }

  const payload = { id: user.id, username: user.username }; 
  const options = { expiresIn: '1h' }; 

  return jwt.sign(payload, secret, options);
};

export default generateJWT;