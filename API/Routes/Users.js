const users = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


users.post('/remove', jsonParser, (req, res)=> {

    const fs = require('fs');
    const path = './userDB.JSON';
    const parkPath = './carPark.JSON';

    const userName = req.body.name;
    //console.log('userName: ' + userName);

    inCarPark();

    function inCarPark() {

            //console.log('Inside of inCarPark!!')
            fs.readFile(parkPath, (err, parkData) => {
                if (err) {
                    console.log(err)
                } else {
                    let obj = JSON.parse(parkData);
                    let pData = obj.carParks;

                    let count = 0;
                    const spaceData = pData.map(x => x._spaces);

                    for (let i = 0; i < spaceData.length; i++) {
                        //console.log('i: ' + i);
                        for (let j = 0; j < spaceData[i].length; j++) {
                            if (spaceData[i][j]._isBooked === userName) {
                                //console.log('i: ' + i);
                                //console.log('j: ' + j);
                                //console.log('found user in car park');
                                count++;

                                //console.log('count: ' + count);
                            }
                        }
                    }
                    //console.log('count ' + count)
                    if(count === 0){
                        fs.readFile(path, (err, data) => {

                            //console.log('in removeUsername!!!!')
                            if (err) {
                                console.log('error')
                            } else {
                                let obj = JSON.parse(data);
                                let arr = obj.details;
                                const nameData = arr.map(x => x.username);

                                // if it includes the park name we want to find
                                if ((nameData.includes(userName))) {

                                    // find the idx of the thing to be removed in namedata
                                    let userIndex = nameData.indexOf(userName);
                                    //console.log('index of thing to be removed: ' + carParkIndex);
                                    // remove from that corresponding idx
                                    arr.splice(userIndex, 1);


                                    fs.writeFileSync(path, JSON.stringify(obj), (err) => {
                                        if (err) {
                                            console.log("error")
                                            return;
                                        }

                                    })
                                    console.log(`${userName.username} removed from database`)
                                    res.send('ok');
                                } else {
                                    console.log('database does not contain username entered')
                                    res.send('noMatch')
                                }
                            }
                        })
                    } else {
                        res.send('found user')
                    }
                }
            });
    }
});

    /*
        if (fs.existsSync(path))
        {
            fs.readFile(path, (err, data)=>
            {

                if (err){console.log('error')}
                else{
                    let obj= JSON.parse(data);
                    let arr = obj.details;
                    const nameData= arr.map(x => x.username);

                    // if it includes the park name we want to find
                    if ((nameData.includes(userName))) {

                        // find the idx of the thing to be removed in namedata
                        let userIndex = nameData.indexOf(userName);
                        //console.log('index of thing to be removed: ' + carParkIndex);
                        // remove from that corresponding idx
                        arr.splice(userIndex,1);


                        fs.writeFileSync(path, JSON.stringify(obj), (err) => {
                            if (err) {
                                console.log("error")
                                return;
                            }

                        })
                        console.log(`${userName.username} removed from database`)
                        res.send('ok');
                    }
                    else {
                        console.log('database does not contain username entered')
                        res.send('noMatch')
                    }
                }
            })


            fs.readFile(parkPath, (err, parkData)=>
            {
                if (err){console.log(err)}
                else
                {
                    let obj= JSON.parse(parkData);
                    let pData = obj.carParks;


                    const spaceData= pData.map(x => x._spaces);

                    for(let i = 0; i < spaceData.length; i++){
                        //console.log('i: ' + i);
                        for(let j = 0; j < spaceData[i].length; j++){
                            if(spaceData[i][j]._isBooked === userName){
                                //console.log('i: ' + i);
                                //console.log('j: ' + j);
                                //console.log('false');
                                res.send
                                //console.log('count: ' + count);
                            }
                        }
                    }
                }
            })

        }
        else
        {
            console.log('No car park file exists')
        }

    })
    */


    users.post('/display', jsonParser, (req, res) => {
        //console.log('in display in server');
        const fs = require('fs');
        const path = './userDB.JSON';
        const carParkPath = './carPark.JSON';

        if (fs.existsSync(path)) {
            fs.readFile(path, (err, data) => {
                fs.readFile(carParkPath, (carParkErr, carParkData) => {
                    const dataArr = [];
                    if (err) {
                        console.log('error')
                    } else {
                        let car = JSON.parse(carParkData);
                        let carr = car.carParks;

                        const parkSpaceData = carr.map(x => x._spaces);
                        const parkNameData = carr.map(x => x._name);

                        let carParkID = [];


                        let obj = JSON.parse(data);
                        let arr = obj.details;

                        const nameData = arr.map(x => x.username);
                        const passData = arr.map(x => x.password);


                        //console.log('nameData: ' + nameData);
                        //console.log('passData: ' + passData);

                        // for every user
                        for (let i = 0; i < nameData.length; i++) {
                            // push their name and password to the array
                            dataArr.push(nameData[i]);
                            dataArr.push(passData[i]);


                            let count = 0;
                            // then for each parking space in the JSON file
                            for (let j = 0; j < parkSpaceData.length; j++) {
                                //console.log('i: ' + i);


                                // iterate over the fields and
                                for (let k = 0; k < parkSpaceData[j].length; k++) {
                                    if (parkSpaceData[j][k]._isBooked === nameData[i]) {

                                        /*console.log('Car park: ' + parkSpaceData[j][k]._name +
                                            ', Space ID: ' + parkSpaceData[j][k]._spaceID
                                        + ' booked by: ' + nameData[i])*/
                                        dataArr.push(parkSpaceData[j][k]._spaceID);
                                        count++
                                    }
                                }

                            }
                            if (count === 0) {
                                dataArr.push('No spaces booked');
                            }
                        }

                        res.send(dataArr);
                    }
                })

            })
        }
    })

module.exports=users;