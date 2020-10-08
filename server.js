const express = require('express');
var app = express();
var fs = require('fs');
var https = require('https')

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const swaggerJsdoc2 = require('swagger-jsdoc');
const swaggerUI2 = require('swagger-ui-express');
const cors = require('cors');

const options = {
    swaggerDefinition :{
        info:{
            title: 'Assignment 8 sample DB API',
            version: '1.0.0',
            description: 'Company, customer, agent details Database'
        },
        host:'206.189.199.15:3001',
        basePath: '/',
    },
    apis: ['./server.js'],
};

const mariadb = require('mariadb');
const pool = mariadb.createPool({

	host:'localhost',
	user:'root',
	password:'root',
	database:'sample',
	port:3306,
	connectionLimit:5
});

/**
 * @swagger
 * definitions:
 *   Company:
 *     properties:
 *       ID:
 *         type: string
 *       NAME:
 *         type: string
 *       CITY:
 *         type: string
 */

/**
 * @swagger
 * /api/v1/customer:
 *       get:
 *         description: Return all customer details
 *         produces:
 *             - application/json
 *         responses:
 *             200:
 *                 description: Return all customer details
 *          
 */
app.get('/api/v1/customer', (req, res) => {
	res.setHeader('Content-Type','application/json');
	console.log("inside the customer GET Route");
	pool.getConnection()
		.then(conn =>{
		return conn.query("SELECT * FROM customer;")
			.then(row => {
		  	conn.end();
		  	res.json(row);

			console.log("connected to sample DB. inside customer GET");
			})
			.finally(() => {
			conn.end();
			});
		})
		.catch(err=>{
		throw err;
		});
	});

app.get('/api/v1/customer/:custID', (req, res) => {
        res.setHeader('Content-Type','application/json');
        console.log("inside the customer ID GET Route");
        pool.getConnection()
                .then(conn =>{
                return conn.query("SELECT CUST_CODE as Id,CUST_NAME as Name,CUST_CITY as City FROM customer where CUST_CODE= ?", [req.params.custID])
                        .then(row => {
                        conn.end();
                        res.json(row);
                        console.log("connected to sample DB. inside customer ID  GET");
                        })
                        .finally(() => {
                        conn.end();
                        });
                })
                .catch(err=>{
                throw err;
                });
        });


/**
 * @swagger
 * /api/v1/agents:
 *     get:
 *       description: Return all agents details
 *       produces:
 *           - application/json
 *       responses:
 *           200:
 *               description: Return all agents details
 *          
 */
app.get('/api/v1/agents', (req, res) => {         
	res.setHeader('Content-Type','application/json');         
	console.log("inside the agents GET Route");
	pool.getConnection() 
	        .then(conn =>{ 
                return conn.query("SELECT * FROM agents;")                         
			.then(row => {
			conn.end();  
                        res.json(row);    
	                console.log("connected to sample DB. inside agents GET"); 
                        }) 
                        .finally(() => {
			conn.end();
                         });
                 })
               
		 .catch(err=>{
		 throw err;
                 });         
	});

app.get('/api/v1/agents/:agentCode', (req, res) => {
        res.setHeader('Content-Type','application/json');
        console.log("inside the agents ID GET Route");
        pool.getConnection()
                .then(conn =>{
                return conn.query("SELECT AGENT_CODE as AgentCode,AGENT_NAME as Name,WORKING_AREA as City,PHONE_NO as Phone FROM agents where TRIM(AGENT_CODE)= ?", [req.params.agentCode])
                        .then(row => {
                        conn.end();
                        res.json(row);
                        console.log("connected to sample DB. inside agents ID  GET");
                        })
                        .finally(() => {
                        conn.end();
                        });
                })
                .catch(err=>{
                throw err;
                });
        });

/**
 * @swagger
 * /api/v1/company:
 *   get:
 *     tags:
 *       - Company
 *     description: Returns all companies
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An list of companies
 *         schema:
 *           $ref: '#/definitions/Company'
 */
app.get('/api/v1/company', (req, res) => {
        res.setHeader('Content-Type','application/json');
        console.log("inside the company GET Route");
	console.log(req.body.data);
        pool.getConnection()
                .then(conn =>{
                return conn.query("SELECT * FROM company;")
                        .then(row => {
                        conn.end();
                        res.json(row);    
                        console.log("connected to sample DB. inside company GET");
                        })
                        .finally(() => {
                        conn.end();
                        });
                })
                .catch(err=>{
                throw err;
                });
        });

/**
 * @swagger
 * /api/v1/company/{id}:
 *   get:
 *     tags:
 *       - Company
 *     description: Returns a single company
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: COMPANY ID example- 18
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single Company object
 *         schema:
 *           $ref: '#/definitions/Company'
 */
app.get('/api/v1/company/:CID', (req, res) => {
        res.setHeader('Content-Type','application/json');
        console.log("inside the company ID GET Route");
        pool.getConnection()
                .then(conn =>{
                return conn.query("SELECT COMPANY_ID as CompanyID,COMPANY_NAME as Name,COMPANY_CITY as City FROM company where COMPANY_ID= ?", [req.params.CID])
                        .then(row => {
                        conn.end();
                        res.json(row);
                        console.log("connected to sample DB. inside company ID  GET");
                        })
                        .finally(() => {
                        conn.end();
                        });
                })
                .catch(err=>{
                throw err;
                });
        });

/**
 * @swagger
 * /api/v1/company:
 *   patch:
 *     tags:
 *       - Company
 *     description: updates a existing Company
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: companyName
 *         description: Company object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Company'
 *     responses:
 *       200:
 *         description: Company record Successfully updated
 */
app.patch('/api/v1/company', (req, res) => {

        console.log("inside the company PATCH Route");
        console.log(req.body);
        res.setHeader('Content-Type','application/text');
        pool.getConnection()
                .then(conn =>{
                return conn.query("UPDATE company SET COMPANY_NAME=? , COMPANY_CITY=? WHERE COMPANY_ID = ?", [req.body.NAME,req.body.CITY,req.body.ID])
                        .then(row => {
                        conn.end();
                        res.end("Company Record Updated sucessfully");
                        console.log("connected to sample DB. inside company ID  PATCH");
                        })
                        .finally(() => {
                        conn.end();
                        });
                })
                .catch(err=>{
                res.end(err);
                });

})


/**
 * @swagger
 * /api/v1/company:
 *   post:
 *     tags:
 *       - Company
 *     description: Creates a new Company
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: companyName
 *         description: Company object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Company'
 *     responses:
 *       200:
 *         description: Company record Successfully created
 */
app.post('/api/v1/company', (req, res) => {
        
        console.log("inside the company POST Route");
	console.log(req.body);
   	res.setHeader('Content-Type','application/text');
	pool.getConnection()
                .then(conn =>{
                return conn.query("INSERT INTO company (COMPANY_ID,COMPANY_NAME,COMPANY_CITY) VALUES (?,?,?)", [req.body.ID,req.body.NAME,req.body.CITY])
                        .then(row => {
                        conn.end();
                        console.log(row);
			res.end("Company Record inserted sucessfully");
			console.log("connected to sample DB. inside company ID  POST");
                        })
                        .finally(() => {
                        conn.end();
                        });
                })
                .catch(err=>{
                throw(err);
                });

})

/**
 * @swagger
 * /api/v1/company:
 *   put:
 *     tags:
 *       - Company
 *     description: Creates a new Company
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: companyName
 *         description: Company object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Company'
 *     responses:
 *       200:
 *         description: Company record Successfully created
 */
app.put('/api/v1/company', (req, res) => {

        console.log("inside the company POST Route");
        console.log(req.body);
        res.setHeader('Content-Type','application/text');
        pool.getConnection()
                .then(conn =>{
                return conn.query("SELECT COUNT(*) as xyz from company WHERE COMPANY_ID=?;",[req.body.ID])
                        .then(row => {
                        conn.end();
                        //console.log(row);
			console.log(row[0]);
			//console.log(row[1]);
			if(row[0].xyz == 1){
                        res.end("Company ID already exists");
                        console.log("Company ID already exists");
                        }
			else{
			console.log("INSERT CAN HAPPEN");
			res.end("INSERTED");
			}
			})
                        .finally(() => {
                        conn.end();
                        });
                })
                .catch(err=>{
                throw(err);
                });

})


/**
 * @swagger
 * /api/v1/company/{id}:
 *   delete:
 *     tags:
 *       - Company
 *     description: deletes a single company
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: COMPANY ID example- 18
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Company object deleted
 *         schema:
 *           $ref: '#/definitions/Company'
 */
app.delete('/api/v1/company/:CID', (req, res) => {
        //res.setHeader('Content-Type','application/json');
        console.log("inside the company ID DELETE Route");
        pool.getConnection()
                .then(conn =>{
                return conn.query("DELETE FROM company where COMPANY_ID= ?", [req.params.CID])
                        .then(row => {
                        conn.end();
                        //res.json(row);
                        console.log("connected to sample DB. inside company ID  DELETE");
                        //res.end(row);
			console.log(row);
			if(row.affectedRows == 0)
			{
				res.end("COMPANY ID NOT PRESENT IN THE TABLE");
			}
			else {
				res.end("COMPANY DELETED");
			}

			})
                        .finally(() => {
                        conn.end();
                        });
                })
                .catch(err=>{
                res.end(err);
                });
        });


const specs2 = swaggerJsdoc2(options);
app.use('/api/docs', swaggerUI2.serve, swaggerUI2.setup(specs2));
app.use(cors());

https.createServer({
  key: fs.readFileSync('ser1.key'),
  cert: fs.readFileSync('ser1.cert')
}, app)
.listen(3000, function () {
  console.log('Server https listening on port 3000! ');
});

app.listen(3001);

app.get('/', function (req, res) {      
	res.end("Hello there. Please try below methods.");
});

