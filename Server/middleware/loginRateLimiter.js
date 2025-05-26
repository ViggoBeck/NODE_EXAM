import rateLimit from 'express-rate-limit';
//Begræns antal login-forsøg 
export const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,   
    max: 5,                    
    message: { message: "Too many login attempts, try again later. :P" },
    standardHeaders: true,
    legacyHeaders: false
});
// Denne middleware begrænser antallet af login-forsøg til 5 per minut.