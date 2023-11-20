import mysql from 'mysql';

const handler = async (event, context) => {
  // Send post authentication data to Amazon CloudWatch logs
  console.log("Authentication successful");
  const userAttributes = event['request']['userAttributes'];
  const uuid = userAttributes['sub'];
  const email = userAttributes['email'];
  const username = userAttributes['preferred_username'];
  const f_name = userAttributes['given_name'];
  const l_name = userAttributes['family_name'];
  const currentDate = new Date();
  const create_date = currentDate.toISOString().slice(0, 10);
  const status = 'A';
  
  // console.log("uuid", uuid);
  // console.log("email", email);
  // console.log("username", username);
  // console.log("f_name", f_name);
  // console.log("l_name", l_name);
  // console.log("date", create_date);
  
  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };
  
  let connection;
  
  try {
    connection = mysql.createConnection(dbConfig);
    
    
    await new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          reject(err);
        }
        else {
          resolve();
        }
      });
    });
    
    
    
    console.log('Database connection successful');
    
    const checkUserSql = `SELECT * FROM USER WHERE c_uid = '${uuid}'`;
    
    
    connection.query(checkUserSql,(error, results) => {
      if (error) {
        console.error('Error inserting data:', error);
      } 
      else {
        
        if (results.length === 0) {
          const sql = `INSERT INTO USER (c_uid, username, user_fname, user_lname, user_email, create_date, user_status) VALUES ('${uuid}','${username}','${f_name}','${l_name}','${email}','${create_date}','${status}')`;
          
              connection.query(sql,(error, results) => {
      if (error) {
        console.error('Error inserting data:', error);
      } 
      else {
        console.log('Data inserted successfully.');
      }
    });
    
        }
        
        else {
          console.log('User already exists, no need to insert.');
        }
        
      }
    });
    
    
    
  }
  
  catch(error) {
    console.error('Error connecting to the database:', error.message);
  }
  finally{
    if (connection) {
      connection.end();
    }
    console.log('End');
  }

  return event;
};

export { handler }