import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export const validateEntity = async (entity: any): Promise<string[]> => {
  const errors = await validate(entity);
  return errors.map(error => 
    Object.values(error.constraints || {}).join(', ')
  );
};

export const validationMiddleware = (entityClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const entity = Object.assign(new entityClass(), req.body);
      const errors = await validateEntity(entity);
      
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors,
        });
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};