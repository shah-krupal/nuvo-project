import axios from 'axios';

function testfunc() {
    try {
      console.log('hi fore ')
      axios.get('http://localhost:3000/auth/google', {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        console.log(response);
      });
      
      console.log('hi after func');
    } catch (err) {
      console.error(err);
    }
  }
  
  testfunc();
  