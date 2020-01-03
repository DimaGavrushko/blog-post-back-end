const mongoose = require('mongoose');

async function connect(user, password, name) {
  const uri = `mongodb+srv://${user}:${password}@cluster0-jnotm.mongodb.net/${name}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(uri, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    return 'Successfully connected to database';
  } catch (err) {
    return err.message;
  }
}

module.exports = {
  connect
};
