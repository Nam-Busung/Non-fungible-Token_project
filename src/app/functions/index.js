const functions = require('firebase-functions');
const admin = require('firebase-admin');
const gcs = require('@google-cloud/storage')
const Busboy = require('busboy');

admin.initializeApp(functions.config().firebase);

const getTime = () => {
    return Math.trunc(Date.now() / 1000);
};

const cors = require('cors')({origin: true});

const messages = {
    serverError: '잠시후 다시 시도해주세요.'
}

/** createAuction
 * @params userId
 * @params tokenId
 * @params title
 * @params description
 * @params price
 * @params due
 */
exports.createAuction = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const { userId, tokenId, title, description, price, due, image } = req.body;
        
        const auctionId = admin.database().ref().child('auctions').push().key;
    
        let updates = {};
    
        //add auction
        updates[`auctions/${auctionId}`] = {
            userId: userId,
            tokenId: tokenId,
            title:title,
            description: description,
            price: price,
            due: due,
            createdAt:getTime(),
            image:image
        };
    
        //add auction to user
        updates[`users/${userId}/auctions/${auctionId}`] = {
            user: userId,
            tokenId: tokenId,
        };
    
        let dbRef = admin.database().ref();
        dbRef.update(updates, error => {
            if (error) res.send({result: false, message: messages.serverError});
            else res.send({ result: true, auctionId: auctionId });
        });
    })
});


/** getAuctionList
 * @params skip
 * @params limit
 */
exports.getAuctionList = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        let skip = req.body.skip || 0;
        let limit = req.body.limit || 25;

        let ref = admin.database().ref(`auctions`);
        ref.once('value').then(snap => {
            let val = snap.val();
            console.log("TCL: val", val)
            return res.send({ result: true, data: val || null });
        }).catch((e) => {
            res.sendStatus(404);
        })
    });
    // cors(req, res, () => {
    //     Promise.all(
    //         admin.database().ref(`auctions`).once('value'),
    //         admin.database().ref(`images`).once('value')
    //     )
    //     .then(values => {
    //         let val = values[0].val();
    //         let images = values[1].val();
    //         console.log("TCL: images", images)
    //         console.log("TCL: val", val);
            
    //         // if(val) {
    //         //     val = map(Object.keys(val).forEach((each) => {
    //         //         let item = val[each];
    //         //         item.userId
    //         //     })
    //         // }
    //         return res.send({ result: true, data: val || null });
    //     }).catch((e) => {
    //         res.sendStatus(404);
    //     })
    // });
});


// bid
exports.bid = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const { userId, tokenId, price, auctionId } = req.body;
        let updates = {};
    

        //add auction
        updates[`auctions/${auctionId}/bid/`] = {
            userId: userId,
            tokenId: tokenId,
            price:price
        };
    
        //add auction to user
        // updates[`users/${userId}/bids/${bidId}`] = {
        //     user: userId,
        //     tokenId: tokenId,
        //     price:price
        // };
    
        let dbRef = admin.database().ref();
        dbRef.update(updates, error => {
            if (error) res.send({result: false, message: messages.serverError});
            else res.send({ result: true, bidPrice: price });
        });
    });
});


// winner takes it all
exports.endAuction = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const { auctionId, fromId, toId, tokenId, price } = req.body;
        let updates = {};
    
        //end auction
        updates[`auctions/${auctionId}/`] = null;
    
        //add auction to user
        updates[`users/${fromId}/auctions/${auctionId}`] = null;
        
        const historyId = admin.database().ref().child('history').push().key;
    
        //add history
        updates[`history/${tokenId}/${historyId}`] = {
            tokenId: tokenId,
            from:fromId,
            to: toId,
            price: price,
            transactionDate:getTime()
        };
    
        let dbRef = admin.database().ref();
        dbRef.update(updates, error => {
            if (error) res.send({result: false, message: messages.serverError});
            else res.send({ result: true });
        });
    });
});

/** createHistory
 * @params title
 * @params tokenId
 * @params touserId
 * @params fromuserId
 * @params price
 */
exports.createHistory = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const { title, tokenId, userId, fromuserId, price } = req.body;
        
        const historyId = admin.database().ref().child('history').push().key;
    
        let updates = {};
    
        //add history
        updates[`history/${tokenId}/${historyId}`] = {
            title: title,
            tokenId: tokenId,
            touserId:userId,
            fromuserId: fromuserId,
            price: price,
            transactionDate:getTime()
        };
    
        let dbRef = admin.database().ref();
        dbRef.update(updates, error => {
            if (error) res.send({result: false, message: messages.serverError});
            else res.send({ result: true, historyId: historyId });
        });
    })
});


/** gethistoryList
 * @params skip
 * @params limit
 */
exports.getHistoryList = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        let skip = req.body.skip || 0;
        let limit = req.body.limit || 25;

        let ref = admin.database().ref(`history`);
        ref.once('value').then(snap => {
            let val = snap.val();
            if (val) return res.send({ result: true, data: val });
            else return res.send({result: false, message: messages.serverError});
        }).catch((e) => {
            res.sendStatus(404);
        })
    });
});