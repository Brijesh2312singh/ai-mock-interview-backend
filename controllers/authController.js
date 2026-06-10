const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mysqlDb = require("../config/mysqlDb");
const User = require("../models/User");

const signup = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required"
    });
  }

  try {
    const mongoUser = await User.findOne({ email });

    if (mongoUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    mysqlDb.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
      async (checkErr, rows) => {
        if (checkErr) {
          return res.status(500).json({
            success: false,
            message: checkErr.message
          });
        }

        if (rows.length > 0) {
          return res.status(400).json({
            success: false,
            message: "User already exists in MySQL"
          });
        }

        mysqlDb.query(
          `INSERT INTO users (name, email, phone, password)
           VALUES (?, ?, ?, ?)`,
          [name, email, phone || "", hashedPassword],
          async (insertErr, result) => {
            if (insertErr) {
              return res.status(500).json({
                success: false,
                message: insertErr.message
              });
            }

            try {
              const user = await User.create({
                mysql_id: result.insertId,
                name,
                email,
                phone: phone || "",
                password: hashedPassword
              });

              return res.status(201).json({
                success: true,
                message: "Signup successful",
                user: {
                  id: user._id,
                  mysql_id: result.insertId,
                  name: user.name,
                  email: user.email,
                  phone: user.phone
                }
              });
            } catch (mongoErr) {
              console.log("MongoDB insert failed:", mongoErr.message);

              return res.status(201).json({
                success: true,
                message: "Signup successful in MySQL, MongoDB failed",
                user: {
                  mysql_id: result.insertId,
                  name,
                  email,
                  phone: phone || ""
                }
              });
            }
          }
        );
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid password"
        });
      }

      const token = jwt.sign(
        {
          id: user._id,
          mysql_id: user.mysql_id || null,
          email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          mysql_id: user.mysql_id || null,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      });
    }

    mysqlDb.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, rows) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message
          });
        }

        if (rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: "User not found"
          });
        }

        const mysqlUser = rows[0];
        const isMatch = await bcrypt.compare(password, mysqlUser.password);

        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: "Invalid password"
          });
        }

        try {
          user = await User.create({
            mysql_id: mysqlUser.id,
            name: mysqlUser.name,
            email: mysqlUser.email,
            phone: mysqlUser.phone || "",
            password: mysqlUser.password
          });
        } catch (mongoErr) {
          console.log("Mongo sync failed:", mongoErr.message);
        }

        const token = jwt.sign(
          {
            id: user ? user._id : mysqlUser.id,
            mysql_id: mysqlUser.id,
            email: mysqlUser.email
          },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        return res.status(200).json({
          success: true,
          message: "Login successful",
          token,
          user: {
            id: user ? user._id : mysqlUser.id,
            mysql_id: mysqlUser.id,
            name: mysqlUser.name,
            email: mysqlUser.email,
            phone: mysqlUser.phone
          }
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const profile = async (req, res) => {
  try {
    if (req.user.id && String(req.user.id).length === 24) {
      const user = await User.findById(req.user.id).select("-password");

      if (user) {
        return res.status(200).json({
          success: true,
          user
        });
      }
    }

    mysqlDb.query(
      "SELECT id, name, email, phone, created_at FROM users WHERE id = ?",
      [req.user.mysql_id || req.user.id],
      (err, rows) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message
          });
        }

        if (rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: "User not found"
          });
        }

        return res.status(200).json({
          success: true,
          user: rows[0]
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  signup,
  login,
  profile
};