import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

// On utilise le constructeur par défaut qui devrait maintenant 
// trouver la config via prisma.config.ts ou l'env chargé par dotenv
const prisma = new PrismaClient();

export default prisma;
