var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');
var balanceController = require('../controllers/balance');
const { sequelize } = require('../models');
const User = require('../models').User;
const Balance = require('../models').Balance;
const Transaction = require('../models').Transaction;

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});
router.post('/adduser', userController.create);
router.post('/addbalance', balanceController.create);
router.get('/transaction', async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        console.log(transaction);
        User.findOne({ where: { username: 'smith' } }).then((user) => {
            if (user !== null) {
                Balance.update(
                    { balance: 40000 },
                    { where: { userId: 1 } }
                ).then(
                    (balance) => {
                        res.status(201).send(balance);
                    },
                    (err) => {
                        return res.status(500).send(err);
                    }
                );
            }
            Transaction.create({
                userId: 1,
                transaction_date: Date(),
                transaction_amount: 10000,
            }).then(
                (transaction) => {
                    res.status(200).send(transaction);
                },
                (error) => res.status(500).send(error)
            );
        });
        {
            transaction;
        }
        User.findOne({ where: { username: 'tom' } }).then((user) => {
            if (user !== null) {
                Balance.update(
                    { balance: 20000 },
                    { where: { userId: 2 } }
                ).then(
                    (balance) => {
                        res.status(201).send(balance);
                    },
                    (err) => {
                        return res.status(500).send(err);
                    }
                );
            }
            Transaction.create({
                userId: 2,
                transaction_date: Date(),
                transaction_amount: 10000,
            }).then(
                (transaction) => {
                    res.status(200).send(transaction);
                },
                (error) => res.status(500).send(error)
            );
            {
                transaction;
            }
        });
        await transaction.commit();
        res.json('Transaction Done');
    } catch (error) {
        console.log(error);
        if (transaction) {
            await transaction.rollback();
        }
        res.json(error);
    }
});
module.exports = router;
