import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../config/db';

export const askAI = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: 'Message is required' });

    // Real AI integration placeholder (e.g. Gemini or OpenAI)
    const API_KEY = process.env.AI_API_KEY;
    
    let reply = "";
    
    if (API_KEY) {
        // Here we would call external AI, for now we still prototype
        reply = "Simulation avec API_KEY connectée : Je traite votre demande pour la RDC...";
    }

    // Prototype Logic Refined
    if (!reply) {
        reply = "En tant qu'agent CivicAI spécialisé dans la RDC, je surveille la zone. Actuellement, le trafic est fluide sur les axes principaux. Souhaitez-vous un rapport spécifique sur votre quartier ?";
        
        if (message.toLowerCase().includes('trafic') || message.toLowerCase().includes('embouteillage')) {
          reply = "Il y a des ralentissements signalés sur le Boulevard du 30 Juin vers la Gombe. Je vous conseille d'emprunter l'avenue de la Libération.";
        } else if (message.toLowerCase().includes('sécurité') || message.toLowerCase().includes('danger')) {
          reply = "La zone de Kisenso signale une vigilance accrue ce soir. Restez informé via les alertes communautaires.";
        }
    }

    // Log history
    if (userId) {
      await prisma.historyLog.create({
        data: {
          userId,
          actionType: 'IA_INTERACTION',
          metadata: { query: message, reply: reply.substring(0, 150) },
        },
      });
    }

    res.json({ reply });
  } catch (error) {
    console.error('AI error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
