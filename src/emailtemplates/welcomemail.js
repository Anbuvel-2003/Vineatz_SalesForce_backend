function Welcomemail(email, password) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>👋 Welcome to Vineatz Salesforce!</h2>
      <p>We're excited to have you on board. Below are your login credentials:</p>
      <table style="border-collapse: collapse; margin: 15px 0;">
        <tr>
          <td><strong>Email:</strong></td>
          <td>${email}</td>
        </tr>
        <tr>
          <td><strong>Password:</strong></td>
          <td>${password}</td>
        </tr>
      </table>
      <p>Please keep this information secure and do not share it with anyone.</p>
      <p>If you have any questions or need assistance, just reply to this email – we're here to help.</p>
      <br/>
      <p>Best regards,<br/>The Vineatz Salesforce Team</p>
    </div>
  `;
}

export default Welcomemail;
