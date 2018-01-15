const config = require('./config');
let axios = require('axios');

simulatePublish();
simulateConsume();
seeBlockchain();

function simulatePublish() {
    console.log('---------------------------------------------------');
    console.log('simulate publish');
    console.log('---------------------------------------------------');

//  We're going to simulate a publish event to the queue
    for (let i = 0; i < config.publish_count; i++) {
        let url = 'http://localhost:8080/write';
        axios.post(url, {
            "id": config._id_,
            "host": config.__host__
        }).then(response => {
            console.log(response.data);
        })
    }
}

function simulateConsume() {
    console.log('---------------------------------------------------');
    console.log('simulate consume');
    console.log('---------------------------------------------------');

//  We're now going to simulate a consume event on the queue
    for (let i = 0; i < config.consume_count; i++) {
        let url = 'http://localhost:8080/poll';
        axios.get(url).then(response => {
            console.log(response.data);
        })
    }

}

function seeBlockchain(){
    console.log('---------------------------------------------------');
    console.log('see the state of everything');
    console.log('---------------------------------------------------');

//  We can see the state of each message in the queue by hitting the blocks endpoint
    let url = 'http://localhost:8080/blocks';
    axios.get(url).then(response => {
        console.log(response.data);
    })
}