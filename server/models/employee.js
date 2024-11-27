const mongoose=require('mongoose')

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  perDayRate: { type: Number, required: true },
  paymentDivision: {
    account: { type: Number, required: true },
    cash: { type: Number, required: true }
  }
});


module.exports = mongoose.model('Employee', employeeSchema);
