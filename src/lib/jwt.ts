import { AdecashUser, CoreTokenPayload } from '../types';

const ADECASH_SECRET = import.meta.env.VITE_ADECASH_JWT_SECRET || 'default-adecash-secret';
const CORE_SECRET = import.meta.env.VITE_CORE_JWT_SECRET || 'default-core-secret';

export class JWTManager {
  static decodeAdecashToken(token: string): AdecashUser | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Validate required fields
      const requiredFields = [
        'first_name', 'last_name', 'curp', 'contractor', 
        'email', 'company', 'max_credit_line', 'remaining_credit_line',
        'ademozo_tenant_name', 'ademozo_tenant'
      ];
      
      for (const field of requiredFields) {
        if (!(field in payload)) {
          console.error(`Missing required field: ${field}`);
          return null;
        }
      }
      
      return {
        first_name: payload.first_name,
        last_name: payload.last_name,
        curp: payload.curp,
        contractor: payload.contractor,
        email: payload.email,
        company: payload.company,
        max_credit_line: payload.max_credit_line,
        remaining_credit_line: payload.remaining_credit_line,
        ademozo_tenant_name: payload.ademozo_tenant_name,
        ademozo_tenant: payload.ademozo_tenant
      };
    } catch (error) {
      console.error('Error decoding Adecash token:', error);
      return null;
    }
  }

  static generateCoreToken(user: AdecashUser): string {
    const payload: CoreTokenPayload = {
      first_name: user.first_name,
      last_name: user.last_name,
      curp: user.curp,
      tenant: user.ademozo_tenant
    };

    // Simple JWT generation (in production, use a proper JWT library)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadEncoded = btoa(JSON.stringify(payload));
    const signature = btoa(`${header}.${payloadEncoded}.${CORE_SECRET}`);
    
    return `${header}.${payloadEncoded}.${signature}`;
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp && payload.exp < now;
    } catch (error) {
      return true;
    }
  }
}