import axios from 'axios';

async function testfunc() {
    try {
      const response = await axios.get('http://localhost:3000/auth/google/callback', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = response.data;
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }
  
  testfunc();
  