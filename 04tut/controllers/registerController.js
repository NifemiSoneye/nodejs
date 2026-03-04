const User = require("../model/User");
const bcrypt = require("bcrypt");
const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ Message: "Username and password are required." });
  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.sendStatus(409);
  try {
    //encrypt password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    //create store new user
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });

    /*     const newUser = new User({
      username: user,
      password: hashedPwd,
    }
)
    const result = await newUser.save */

    console.log(result);
    res.status(201).json({ success: `New User ${user} created!` });
  } catch (err) {
    console.error("Error:", err); // Change this to show full error
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
