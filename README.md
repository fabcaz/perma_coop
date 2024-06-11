### Goal:
To gain some understanding of how the Ethereum blockchain actually works

### Description:

This project is a simple ecommerce app with the backend meant to be deployed on the
Ethereum blockchain, and a basic frontend to interact with the smart contract.

It uses [mugen's diamond1](https://github.com/mudgen/diamond-1) for modularity and upgradability.
It also uses openzeppelin's AccessControl and ERC20 contracts which have
been added as diamond facets.

The Market contract manages the inventory but would need to be rewritten as a
proxy to act more like a simple crud repository; mainly to allow for upgradability.
