import { Request, Response } from 'express';

export const getEvent = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true });
};
