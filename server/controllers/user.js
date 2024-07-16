

const User = require("../model/user")
const {getUser, setUser, } = require("../service/auth")
const {v4: uuidv4} = require("uuid");
const {restrictToLoggedInUserOnly} = require("../middlewares/auth")


//user signup no hashing here
async function handleUserSignUP(req, res){

   const { name, email, password} = req.body;

   await User.create({
    name,
    email,
    password,

   });
   return res.render("home")
}



//user login

async function handleUserlogin(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.render("login", {
                error: "Invalid username or password", // Corrected key to lowercase 'error'
            });
        }

       
        const token = setUser(user);
        res.cookie("uid", token,{ httpOnly: true });  // Cookie with name "uid" points to the sessionId

        return res.redirect("/home");
    } catch (error) {
        console.error("Error during user login:", error); // Added error logging
        return res.status(500).json({ message: "Internal server error" });
    }
}


async function handleLogout(req, res) {
    res.clearCookie("uid");
    req.logout((err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.redirect("/open");
    });
  }



// Forgot password
async function handleForgotPassword(req, res) {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render("forgotPassword", {
                message: "No account with that email address exists.",
            });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetURL = `http://${req.headers.host}/user/reset-password/${resetToken}`;

        // Send email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'dawkarad2002@gmail.com',
                pass: '09112002Aaditya',
            },
        });

        const mailOptions = {
            to: user.email,
            from: 'dawkarad2002@gmail.com',
            subject: 'Node.js Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                `${resetURL}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error("Error sending email:", err);
                return res.status(500).json({ message: "Internal server error" });
            }
            res.render("forgotPassword", {
                message: "An e-mail has been sent to " + user.email + " with further instructions.",
            });
        });
    } catch (error) {
        console.error("Error during password reset:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Reset password
async function handleResetPassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.render("resetPassword", {
                token,
                message: "Password reset token is invalid or has expired.",
            });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.render("login", {
            message: "Success! Your password has been changed.",
        });
    } catch (error) {
        console.error("Error during password reset:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}



module.exports={
    handleUserSignUP,
    handleUserlogin,
    handleLogout,
    handleForgotPassword,
    handleForgotPassword,
}