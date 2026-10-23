import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async (email, token) => {
  try {
    const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:3000";
    const data = await resend.emails.send({
      from: "InstaApp <onboarding@resend.dev>",
      to: email,
      subject: "Potwierdzenie rejestracji - InstaApp",
      html: `<body style="margin: 0; padding: 0; background-color: #f2f2f2; font-family: 'Montserrat', sans-serif;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
              <td style="padding: 20px 0 30px 0;">
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                      <tr>
                          <td align="center" bgcolor="#4CAF50" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; border-radius: 10px 10px 0 0;">
                              Zweryfikuj swój adres e-mail
                          </td>
                      </tr>
                      <tr>
                          <td align="center" style="padding: 40px 30px 40px 30px; color: #333333;">
                              <p style="font-size: 18px; margin: 0;">Dziękujemy za rejestrację w naszym serwisie!</p>
                              <p style="font-size: 18px; margin: 20px 0;">Kliknij w poniższy przycisk, aby zweryfikować swoje konto</p>
                              <a href="${apiBaseUrl}/api/user/confirm/${token}" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 18px; color: #ffffff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Zweryfikuj konto</a>
                          </td>
                      </tr>
                      <tr>
                          <td align="center" style="padding: 20px 30px 40px 30px; color: #333333;">
                              <p style="font-size: 14px; margin: 0;">Jeżeli nie zakładałeś konta w naszej aplikacji, zignoruj tę wiadomość</p>
                              <p style="font-size: 14px; margin: 20px 0 0 0;">z poważaniem,</p>
                              <p style="font-size: 14px; margin: 0;">InstaApp</p>
                          </td>
                      </tr>
                      <tr>
                          <td align="center" bgcolor="#f7f7f7" style="padding: 30px 30px 30px 30px; color: #999999; font-size: 12px; border-radius: 0 0 10px 10px;">
                              <p style="margin: 0;">&copy; 2026 InstaApp. Wszelkie prawa zastrzeżone.</p>
                              <p style="margin: 0;">Różana 16, Kraków</p>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>`,
    });

    console.log("E-mail wysłany pomyślnie:", data);
    return data;
  } catch (error) {
    console.error("Błąd wysyłania e-maila:", error.message);
    return null;
  }
};
