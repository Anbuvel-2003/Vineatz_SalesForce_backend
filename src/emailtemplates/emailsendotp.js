function EmailSendOtp(email, otp) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 20px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Email Verification</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 30px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <h2 style="text-align: center; color: #2b6cb0; font-size: 20px; margin-bottom: 20px;">🔐 Your One-Time Password</h2>
                      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 10px;">Hello,</p>
                      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                        You requested a one-time password (OTP) to verify your email: 
                        <strong style="color: #2b6cb0;">${email}</strong>
                      </p>
                    </td>
                  </tr>

                  <!-- OTP Display -->
                  <tr>
                    <td align="center" style="padding: 20px;">
                      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px 30px; font-size: 28px; font-weight: bold; color: #ffffff; letter-spacing: 6px; border-radius: 10px; display: inline-block;">
                        ${otp}
                      </div>
                      <div style="margin-top: 10px;">
                        <small style="color: #e53e3e; font-weight: bold;">Expires in 5 minutes</small>
                      </div>
                    </td>
                  </tr>

                  <!-- Security Notice -->
                  <tr>
                    <td style="background-color: #fff8dc; border-left: 4px solid #f6ad55; padding: 15px 20px; border-radius: 8px; margin-top: 20px;">
                      <p style="margin: 0; font-size: 14px; color: #744210;"><strong>Security Notice:</strong> Never share this OTP with anyone. Our team will never ask for your verification code.</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="text-align: center; padding-top: 30px; font-size: 14px; color: #666;">
                      If you didn't request this code, you can ignore this email or contact support.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f7fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="font-size: 14px; color: #4a5568; margin: 5px 0;">
                  Best regards,<br/>
                  <strong style="color: #2b6cb0;">The Vineatz Salesforce Team</strong>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

export default EmailSendOtp;
