const Transaction = require('../models').Transaction;

module.exports = {
    create(req, res) {
        return Transaction.create({
            userId: req.body.userId,
            transaction_date: Date(),
            transaction_amount: req.body.transaction_amount,
        })
            .then((transaction) => res.status(201).send(transaction))
            .catch((error) => res.status(400).send(error));
    },
};
