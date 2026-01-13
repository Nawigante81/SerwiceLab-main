import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RepairConfirmationRequest {
  to: string;
  userName: string;
  deviceType: string;
  deviceBrand?: string;
  deviceModel?: string;
  problemDescription: string;
  paczkomatId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-repair-confirmation function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      to, 
      userName, 
      deviceType, 
      deviceBrand, 
      deviceModel, 
      problemDescription,
      paczkomatId 
    }: RepairConfirmationRequest = await req.json();

    console.log("Sending confirmation email to:", to);

    const deviceLabel = deviceType === 'laptop' ? 'Laptop' : deviceType === 'pc' ? 'Komputer PC' : 'Inne urządzenie';
    const deviceInfo = [deviceBrand, deviceModel].filter(Boolean).join(' ') || deviceLabel;

    const emailResponse = await resend.emails.send({
      from: "Acid Serwis <onboarding@resend.dev>",
      to: [to],
      subject: "Potwierdzenie zgłoszenia naprawy - Acid",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #141414; border-radius: 16px; border: 1px solid #262626;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center;">
                      <h1 style="margin: 0; color: #a3e635; font-size: 28px; font-weight: bold;">🔧 Acid</h1>
                      <p style="margin: 10px 0 0 0; color: #a1a1aa; font-size: 14px;">Serwis komputerowy</p>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 20px 40px;">
                      <h2 style="margin: 0 0 20px 0; color: #fafafa; font-size: 22px;">Cześć ${userName}!</h2>
                      <p style="margin: 0 0 20px 0; color: #a1a1aa; font-size: 16px; line-height: 1.6;">
                        Twoje zgłoszenie naprawy zostało przyjęte. Dziękujemy za zaufanie!
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Device Info -->
                  <tr>
                    <td style="padding: 0 40px 20px 40px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1c1c1c; border-radius: 12px; border: 1px solid #262626;">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="margin: 0 0 8px 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Urządzenie</p>
                            <p style="margin: 0; color: #fafafa; font-size: 16px; font-weight: 600;">${deviceInfo}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Problem Description -->
                  <tr>
                    <td style="padding: 0 40px 20px 40px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1c1c1c; border-radius: 12px; border: 1px solid #262626;">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="margin: 0 0 8px 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Opis problemu</p>
                            <p style="margin: 0; color: #a1a1aa; font-size: 14px; line-height: 1.6;">${problemDescription.length > 200 ? problemDescription.slice(0, 200) + '...' : problemDescription}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  ${paczkomatId ? `
                  <!-- Paczkomat Info -->
                  <tr>
                    <td style="padding: 0 40px 20px 40px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1c1c1c; border-radius: 12px; border: 1px solid #262626;">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="margin: 0 0 8px 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Paczkomat nadania</p>
                            <p style="margin: 0; color: #fafafa; font-size: 16px; font-weight: 600;">${paczkomatId}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  ` : ''}
                  
                  <!-- Next Steps -->
                  <tr>
                    <td style="padding: 0 40px 30px 40px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: rgba(163, 230, 53, 0.1); border-radius: 12px; border: 1px solid rgba(163, 230, 53, 0.2);">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="margin: 0 0 12px 0; color: #a3e635; font-size: 14px; font-weight: 600;">📦 Co dalej?</p>
                            <ol style="margin: 0; padding-left: 20px; color: #a1a1aa; font-size: 14px; line-height: 1.8;">
                              <li>Nadaj paczkę w wybranym paczkomacie</li>
                              <li>Otrzymasz powiadomienie po dotarciu sprzętu</li>
                              <li>Przygotujemy wycenę naprawy</li>
                              <li>Po akceptacji rozpoczniemy naprawę</li>
                            </ol>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 40px 40px 40px; border-top: 1px solid #262626;">
                      <p style="margin: 0; color: #71717a; font-size: 12px; text-align: center;">
                        Masz pytania? Odpowiedz na tego maila lub sprawdź status w panelu klienta.
                      </p>
                      <p style="margin: 10px 0 0 0; color: #52525b; font-size: 11px; text-align: center;">
                        © ${new Date().getFullYear()} Acid Serwis. Wszystkie prawa zastrzeżone.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-repair-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
