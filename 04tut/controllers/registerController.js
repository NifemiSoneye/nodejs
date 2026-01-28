const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require("bcrypt");
const fsPromises = require("fs").promises;
const path = require("path");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ Message: "Username and password are required." });
  // check for duplicate usernames in the db
  const duplicate = usersDB.users.find((person) => person.username === user);
  if (duplicate) return res.sendStatus(409);
  try {
    //encrypt password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    //store new user
    const newUser = { username: user, password: hashedPwd };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users),
    );
    console.log(usersDB.users);
    res.status(201).json({ success: `New User ${user} created!` });
  } catch (err) {
    console.error("Error:", err); // Change this to show full error
    res.status(500).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
