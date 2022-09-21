// SPDX-License-Identifier: MIT
// API: https://api.nasa.gov/neo/rest/v1/feed?start_date=START_DATE&end_date=END_DATE&api_key=API_KEY 
pragma solidity >=0.4.22 <0.9.0;

contract Oracle {

    address owner;
    uint public asteroids;

    //Event that receives data from the oracle
    event consumeAPI();

    constructor() {
        owner = msg.sender;
    }

    //get API data
    function update() public Owner {
        emit consumeAPI();
    }

    //set API data
    function setAsteroids(uint _num) public Owner {
        asteroids = _num;
    }

    modifier Owner(){
        require(msg.sender == owner, "You do not have permissions to execute this function");
        _;
    }
    
}