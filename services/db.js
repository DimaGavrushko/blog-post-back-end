const mongoose = require("mongoose");

class DBService {

  constructor(user, password, name) {
    this.user = user;
    this.password = password;
    this.name = name;
  }

  async connect() {
    const uri = `mongodb+srv://${this.user}:${this.password}@cluster0-jnotm.mongodb.net/${this.name}?retryWrites=true&w=majority`;

    try {
      await mongoose.connect(uri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      return "Successfully connected to database";
    } catch (err) {
      return err.message;
    }

  }
}

module.exports = DBService;
