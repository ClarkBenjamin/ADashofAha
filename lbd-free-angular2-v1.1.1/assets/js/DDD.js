/**
 * Created by bclark25 on 5/9/17.
 */

/* Handling D3 calls here */

//Init Client
var ahaClient = new aha();

//Result Holder
var mObjects = [];

// function readCSV() {
//
//     count = 0;
//     var readPromise = new Promise(function(resolve, reject) {
//
//     })
//
//     console.log("Testing:");
//     d3.csv("assets/Data/aha_account_Optum_users.csv", function(error, data) {
//         data.forEach(function(d) {
//
//         });
//         return count;
//     });
//
//     console.log(count);
// }

//===========================================================================================================
//Search with paging

//This function takes care of the paging
function paging(ahaClient, jsonResponse){
    if(typeof jsonResponse.pagination !== 'undefined' && typeof jsonResponse.pagination.next_page !== 'undefined'){
        ahaClient.nextPage(jsonResponse.pagination.next_page).then(function(response){
            response.products.forEach(function(productJSON){mObjects.push(new Product(productJSON));	});
            paging(ahaClient, response);
        });
    }else{
        // var contentHolder = document.getElementById("demo");
        for(var i=0; i<mObjects.length; i++){
            // var content = document.createElement("div");
            console.log( mObjects[i].toString());
            // contentHolder.appendChild(content);
        }
    }
}

//This function performs the intial search
function basicSearchForProductsWithPaging(){
    mObjects= [];
    // clearDemo();

    ahaClient.search({"type":"users"}).then(function(products){
        products.products.forEach(function(productJSON){mObjects.push(new Product(productJSON));	});
        paging(ahaClient, products);
    });
}