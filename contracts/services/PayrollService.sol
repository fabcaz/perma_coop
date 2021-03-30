pragma solidity ^0.7.0;


contract PayrollService{

    //get address of whatever contract hold member and labor/land data

    // includes rented land as job for simplicity
    function calculateTotalPayout(address payee) public view returns(uint256) {
       
        return calculateLaborPayout(payee) + calculateLandPayout(payee);
    }


    function calculateLaborPayout(address payee) private view returns(uint256) {
        //get job wages
        //get payee's curr_month_hours
        //calculate total wage
    }

    function calculateLandPayout(address payee) private view returns(uint256) {
        //get land rates      
        //get payee's lands' curr_month_rented_area
    }

}