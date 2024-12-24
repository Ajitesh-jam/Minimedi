// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



contract LifeCoin {

 


    // Mapping from public address to life coins
    mapping(address => uint256) public lifeCoins;

    // Address array to keep track of all addresses with life coins
    address[] public addresses;

    //Function to get life coins of a given public address
    function getLifeCoins(address _address) public view returns (uint256) {
        return lifeCoins[_address];
    }

    //Function to destroy life coins
    function destroyLifeCoins(address _address, uint256 _amount) public {
        require(lifeCoins[_address] >= _amount, "Not enough life coins to destroy");
        lifeCoins[_address] -= _amount;
       
    }

    //Function to give life coins to a specific public address
    function giveCoins(address _address, uint256 _amount) public {
        if (lifeCoins[_address] == 0) {
            addresses.push(_address);
        }
        lifeCoins[_address] += _amount;
        
    }

    //Function to get the top 3 life coin holders
    function getTopLifeCoinHolders() public view returns (address[3] memory, uint256[3] memory) {
        address[3] memory topAddresses;
        uint256[3] memory topCoins;

        for (uint256 i = 0; i < addresses.length; i++) {
            address currentAddress = addresses[i];
            uint256 currentCoins = lifeCoins[currentAddress];

            // Check if the current holder should be in the top 3
            for (uint256 j = 0; j < 3; j++) {
                if (currentCoins > topCoins[j]) {
                    // Shift lower-ranked holders down
                    for (uint256 k = 2; k > j; k--) {
                        topAddresses[k] = topAddresses[k - 1];
                        topCoins[k] = topCoins[k - 1];
                    }

                    // Insert the current holder in the appropriate rank
                    topAddresses[j] = currentAddress;
                    topCoins[j] = currentCoins;
                    break;
                }
            }
        }

        return (topAddresses, topCoins);
    }



}

//Contract Address : 0xc5B2993EEF65E499554D5684a1a7FcEe80d06e46