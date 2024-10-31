const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Set AWS credentials
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Create DynamoDB client
const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

// Define table name
const tableName = 'Appointments';

// Create table if it doesn't exist
dynamodb.createTable({
    TableName: tableName,
    AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
    ],
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
    },
}, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
});

// Get appointments
app.get('/appointments', async (req, res) => {
    const params = {
        TableName: tableName,
    };

    docClient.scan(params, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.json(data.Items);
        }
    });
});

// Create appointment
app.post('/appointments', async (req, res) => {
    const id = Date.now().toString();
    const { patientName, doctorName, date } = req.body;

    const params = {
        TableName: tableName,
        Item: {
            id,
            patientName,
            doctorName,
            date,
        },
    };

    docClient.put(params, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.json({ id, patientName, doctorName, date });
        }
    });
});

// Delete appointment
app.delete('/appointments/:id', async (req, res) => {
    const id = req.params.id;

    const params = {
        TableName: tableName,
        Key: {
            id,
        },
    };

    docClient.delete(params, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.json({ message: `Appointment ${id} deleted successfully` });
        }
    });
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});