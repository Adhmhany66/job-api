const nodemailer = require('nodemailer')

const sendMail = async (options) =>{
    //1) Create a Transport

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        tls:{
            rejectUnauthorized:false
         },
        auth:{
            user: process.env.EMAIL_USERNAME,
            password: process.env.EMAIL_PASSWORD
        },
        
    }
    )

    //2) Define The Email Options 
    const mailOptions = {
        from: 'adhmh < adhmhany@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    
    //3) Actually send the Email
    
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
      });


};
module.exports = sendMail