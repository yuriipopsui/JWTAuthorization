import nodemailer from "nodemailer";


//Will be realized later
class MailService {


  
  constructor() {
    this.transporter = nodemailer.createTransport({
      // host:
      // port:
      // secure: false,
      // auth: {

      // }
    })
  }

  async sendActivationMail(to, link) {

  }
}

export default new MailService();